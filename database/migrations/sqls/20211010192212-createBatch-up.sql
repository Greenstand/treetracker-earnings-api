CREATE TABLE IF NOT EXISTS batch (
    id uuid NOT NULL PRIMARY KEY,
    url varchar NOT NULL,
    status varchar NOT NULL,
    active boolean NOT NULL
)