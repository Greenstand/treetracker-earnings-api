/* Replace with your SQL commands */
ALTER TABLE earnings
    DROP COLUMN payment_confirmed_by,
    ADD COLUMN payment_confirmed_by uuid;