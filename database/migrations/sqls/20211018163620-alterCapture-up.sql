/* Replace with your SQL commands */ /* Replace with your SQL commands */
CREATE SCHEMA IF NOT EXISTS treetracker;
CREATE TABLE IF NOT EXISTS treetracker.capture (
    id uuid NOT NULL PRIMARY KEY
);
ALTER TABLE treetracker.capture ADD earnings_id uuid REFERENCES public.earnings(id);