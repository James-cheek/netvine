import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const hash = createHmac("sha512", PAYSTACK_SECRET)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const { event, data } = JSON.parse(body);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  if (event === "charge.success") {
    const userId = data.metadata?.user_id;
    const customerCode = data.customer?.customer_code;

    if (userId) {
      await supabase
        .from("profiles")
        .update({
          plan: "pro",
          subscription_status: "active",
          paystack_customer_code: customerCode || null,
        })
        .eq("id", userId);
    }
  }

  if (event === "subscription.disable" || event === "subscription.not_renew") {
    const customerCode = data.customer?.customer_code;

    if (customerCode) {
      await supabase
        .from("profiles")
        .update({
          plan: "free",
          subscription_status: "cancelled",
        })
        .eq("paystack_customer_code", customerCode);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
