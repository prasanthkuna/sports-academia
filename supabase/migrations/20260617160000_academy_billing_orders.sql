-- Razorpay SaaS billing orders (setup + first month)

CREATE TABLE public.academy_billing_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id uuid NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  plan public.academy_plan NOT NULL,
  amount_paise integer NOT NULL,
  razorpay_order_id text NOT NULL,
  razorpay_payment_id text,
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  CONSTRAINT academy_billing_orders_order_id_key UNIQUE (razorpay_order_id),
  CONSTRAINT academy_billing_orders_payment_id_key UNIQUE (razorpay_payment_id)
);

CREATE INDEX academy_billing_orders_academy_idx ON public.academy_billing_orders(academy_id, created_at DESC);

ALTER TABLE public.academy_billing_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY academy_billing_orders_select ON public.academy_billing_orders
  FOR SELECT TO authenticated
  USING (academy_id = public.auth_academy_id());

GRANT SELECT ON TABLE public.academy_billing_orders TO authenticated;
GRANT ALL ON TABLE public.academy_billing_orders TO service_role;
