DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
    id TEXT PRIMARY KEY,
    title TEXT,
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

CREATE TABLE IF NOT EXISTS event_sections (
    id TEXT PRIMARY KEY CHECK (id = 'homepage'),
    image_key TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    title1_it TEXT NOT NULL,
    title2_it TEXT NOT NULL,
    description_it TEXT NOT NULL,
    title1_en TEXT NOT NULL,
    title2_en TEXT NOT NULL,
    description_en TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
