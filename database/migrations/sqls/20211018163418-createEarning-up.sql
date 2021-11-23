/* Replace with your SQL commands */
CREATE TYPE earning_status_enum AS ENUM ('calculated', 'cancelled', 'paid');
CREATE TYPE confirmation_method_enum AS ENUM ('single', 'batch');
CREATE TYPE currency_enum AS ENUM ('USD');

CREATE TABLE earnings
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id uuid NOT NULL ,
    contract_id uuid NOT NULL ,
    funder_id uuid NOT NULL ,
    amount numeric NOT NULL,
    currency currency_enum NOT NULL,
    calculated_at timestamptz NOT NULL,
    consolidation_id uuid NOT NULL,
    consolidation_period_start timestamptz NOT NULL,
    consolidation_period_end timestamptz NOT NULL,
    payment_confirmation_id varchar,
    payment_system varchar,
    payment_confirmed_by uuid,
    payment_confirmation_method confirmation_method_enum,
    paid_at timestamptz,
    payment_confirmed_at timestamptz,
    status earning_status_enum NOT NULL,
    active boolean DEFAULT true NOT NULL,
    batch_id uuid REFERENCES batch(id)
);
