import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Simple PDF generator - creates a valid PDF without external libs
function generateInvoicePDF(invoice: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  amount: number;
  date: string;
  paymentId: string;
}): Uint8Array {
  const lines: string[] = [];
  let yPos = 750;
  const smallLineHeight = 14;

  const addText = (text: string, x: number, y: number, size = 12, bold = false) => {
    const font = bold ? "/F2" : "/F1";
    lines.push(`BT ${font} ${size} Tf ${x} ${y} Td (${escapePdf(text)}) Tj ET`);
  };

  const escapePdf = (str: string) => str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  const addLine = (x1: number, y1: number, x2: number, y2: number) => {
    lines.push(`${x1} ${y1} m ${x2} ${y2} l S`);
  };

  // Header
  addText("INVOICE", 50, yPos, 28, true);
  addText("Lightning Deals", 350, yPos, 16, true);
  yPos -= 20;
  addText("Premium Digital Subscriptions", 350, yPos, 9, false);
  yPos -= 40;

  addLine(50, yPos, 545, yPos);
  yPos -= 30;

  addText("Invoice Details", 50, yPos, 14, true);
  yPos -= 25;
  addText(`Invoice #: INV-${invoice.orderId.slice(0, 8).toUpperCase()}`, 50, yPos, 10, false);
  addText(`Date: ${invoice.date}`, 350, yPos, 10, false);
  yPos -= smallLineHeight;
  addText(`Payment ID: ${invoice.paymentId}`, 50, yPos, 10, false);
  yPos -= 30;

  addText("Bill To", 50, yPos, 14, true);
  yPos -= 22;
  addText(invoice.customerName, 50, yPos, 11, false);
  yPos -= smallLineHeight;
  addText(invoice.customerEmail, 50, yPos, 10, false);
  yPos -= 35;

  addLine(50, yPos + 5, 545, yPos + 5);
  addText("Item", 55, yPos - 10, 10, true);
  addText("Qty", 370, yPos - 10, 10, true);
  addText("Amount", 460, yPos - 10, 10, true);
  yPos -= 25;
  addLine(50, yPos, 545, yPos);
  yPos -= 20;

  addText(invoice.productName, 55, yPos, 10, false);
  addText("1", 380, yPos, 10, false);
  addText(`Rs. ${invoice.amount.toFixed(2)}`, 455, yPos, 10, false);
  yPos -= 25;

  addLine(50, yPos, 545, yPos);
  yPos -= 22;

  addText("Total:", 370, yPos, 12, true);
  addText(`Rs. ${invoice.amount.toFixed(2)}`, 455, yPos, 12, true);
  yPos -= 15;
  addLine(370, yPos, 545, yPos);
  yPos -= 50;

  addText("Thank you for your purchase!", 50, yPos, 11, true);
  yPos -= 18;
  addText("For support, contact us on WhatsApp or email sidhjain9002@gmail.com", 50, yPos, 9, false);
  yPos -= smallLineHeight;
  addText("This is a computer-generated invoice and does not require a signature.", 50, yPos, 8, false);

  const stream = lines.join("\n");
  const streamBytes = new TextEncoder().encode(stream);
  const streamLength = streamBytes.length;

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]
   /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj

4 0 obj
<< /Length ${streamLength} >>
stream
${stream}
endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj

xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
0
%%EOF`;

  return new TextEncoder().encode(pdf);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, products(name)')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const pdfBytes = generateInvoicePDF({
      orderId: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      productName: order.products?.name || 'Product',
      amount: Number(order.payment_amount),
      date: new Date(order.created_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      }),
      paymentId: order.payment_id || 'N/A',
    });

    const fileName = `${order.user_id}/invoice-${order.id.slice(0, 8)}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Failed to upload invoice' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabase.from('orders').update({ invoice_url: fileName }).eq('id', order_id);

    return new Response(JSON.stringify({ success: true, invoice_path: fileName }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
