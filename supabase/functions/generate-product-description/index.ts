import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { productName, category, priceOriginal, priceDiscounted, duration, features } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const featuresList = features ? `Features: ${features}` : "";

    const systemPrompt = `You are a conversion-focused copywriter for a digital subscription store called LightningDeals that sells discounted premium software subscriptions (Netflix, Spotify, Adobe, etc). Write compelling, benefit-driven product descriptions that highlight the value and savings. Be concise, persuasive, and professional. Use simple language. Do not use markdown formatting.`;

    const userPrompt = `Generate two descriptions for this product:

Product: ${productName}
Category: ${category || "General"}
Original Price: ₹${priceOriginal}
Discounted Price: ₹${priceDiscounted}
Duration: ${duration}
${featuresList}

Return a JSON object with:
- "short": A punchy one-liner (max 120 chars) that sells the product
- "long": A detailed 2-3 sentence description highlighting value, savings, and key benefits`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_descriptions",
              description: "Return generated product descriptions",
              parameters: {
                type: "object",
                properties: {
                  short: { type: "string", description: "Short one-liner description (max 120 chars)" },
                  long: { type: "string", description: "Detailed 2-3 sentence description" },
                },
                required: ["short", "long"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_descriptions" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const descriptions = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(descriptions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-product-description error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
