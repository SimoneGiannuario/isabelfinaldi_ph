DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    shooting_name TEXT,
    photomodel TEXT,
    date TEXT NOT NULL,
    featured INTEGER DEFAULT 0,
    votes INTEGER DEFAULT 0,
    storage_id TEXT NOT NULL,
    src TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
