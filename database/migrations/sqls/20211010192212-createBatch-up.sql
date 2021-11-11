CREATE TYPE status AS ENUM ('created', 'completed', 'failed');

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS batch (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    url varchar NOT NULL,
    status status NOT NULL,
    active boolean NOT NULL
)
