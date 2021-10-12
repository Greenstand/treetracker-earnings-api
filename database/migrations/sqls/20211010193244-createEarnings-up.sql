/* Replace with your SQL commands */
CREATE TYPE earning_status_enum AS ENUM ('calculated', 'cancelled', 'paid');
CREATE TYPE confirmation_method_enum AS ENUM ('single', 'batch');
CREATE TYPE currency_enum AS ENUM ('USD');

CREATE TABLE public.earnings
(
    id uuid NOT NULL PRIMARY KEY,
    worker_id uuid NOT NULL REFERENCES stakeholder.stakeholder(id),
    funder_id uuid NOT NULL,
    amount numeric NOT NULL,
    currency currency_enum NOT NULL,
    calculated_at timestamptz NOT NULL,
    consolidation_id uuid NOT NULL,
    consolidation_period_start timestamptz NOT NULL,
    consolidation_period_end timestamptz NOT NULL,
    payment_confirmation_id varchar,
    payment_system varchar,
    payment_confirmed_by uuid NOT NULL,
    payment_confirmation_method confirmation_method_enum NOT NULL,
    paid_at timestamptz,
    status earning_status_enum NOT NULL,
    active boolean NOT NULL,
    batch_id uuid NOT NULL REFERENCES batch(id)
);