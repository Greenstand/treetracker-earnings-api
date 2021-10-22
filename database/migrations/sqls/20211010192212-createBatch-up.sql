CREATE TYPE status AS ENUM ('created', 'completed', 'failed');

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA IF NOT EXISTS earnings;

CREATE TABLE IF NOT EXISTS earnings.batch (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    url varchar NOT NULL,
    status status NOT NULL,
    active boolean NOT NULL
)