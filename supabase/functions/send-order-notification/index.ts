import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const statusMessages: Record<string, { subject: string; body: string }> = {
  processing: {
    subject: "Your Order is Being Processed ⚡",
    body: "Great news! We're processing your order and preparing your subscription credentials. You'll receive them shortly via WhatsApp.",
  },
  delivered: {
    subject: "Your Order Has Been Delivered! 🎉",
    body: "Your subscription has been delivered! Check your WhatsApp for the credentials. If you haven't received them, please contact our support team.",
  },
  cancelled: {
    subject: "Your Order Has Been Cancelled",
    body: "Your order has been cancelled. If you didn't request this or have any questions, please reach out to our support team on WhatsApp.",
  },
  refunded: {
    subject: "Your Refund Has Been Processed 💰",
    body: "Your refund has been processed and will be credited to your original payment method within 5-7 business days.",
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, newStatus } = await req.json();

    if (!orderId || !newStatus) {
      return new Response(JSON.stringify({ error: "orderId and newStatus required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, products(name)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const template = statusMessages[newStatus];
    if (!template) {
      return new Response(JSON.stringify({ error: "No email template for this status" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const productName = order.products?.name || "your subscription";
    const customerName = order.customer_name || "Customer";
    const customerEmail = order.customer_email;

    if (!customerEmail) {
      return new Response(JSON.stringify({ error: "No customer email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create an admin notification to track the email intent
    await supabase.from("admin_notifications").insert({
      title: `Email: ${template.subject}`,
      message: `Status update email queued for ${customerName} (${customerEmail}) — ${productName} marked as ${newStatus}`,
      type: "email",
      order_id: orderId,
    });

    console.log(`[Email Notification] To: ${customerEmail}, Subject: ${template.subject}, Product: ${productName}`);

    return new Response(
      JSON.stringify({
        success: true,
        email: customerEmail,
        subject: template.subject,
        status: newStatus,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
