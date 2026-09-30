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

INSERT OR IGNORE INTO event_sections (
    id, image_key, expires_at,
    title1_it, title2_it, description_it,
    title1_en, title2_en, description_en
) VALUES (
    'homepage',
    'xmas-naitiry.jpeg',
    '2026-11-17',
    '🎄✨ La magia del Natale',
    'arriva in sala posa! ✨🎄',
    'Dal 2 al 16 novembre ti aspetto per una speciale sessione fotografica natalizia dedicata a famiglie, bambini e a tutti quei momenti da custodire nel cuore. 🤎 Un''atmosfera calda e accogliente, per creare insieme ricordi da conservare e regalare. 📸✨ 📅 Prenotazioni entro il 31 ottobre 💌 Per maggiori informazioni, scrivimi in privato. I posti sono limitati… non lasciarti sfuggire la tua sessione di Natale! 🎁🎄',
    '🎄✨ The magic of Christmas',
    'comes to the studio! ✨🎄',
    'From November 2 to 16, join me for a special Christmas photo session for families, children, and all the moments you want to hold close. 🤎 A warm, welcoming atmosphere where we can create memories to keep and share. 📸✨ 📅 Book by October 31 💌 Message me for more information. Spaces are limited… don''t miss your Christmas session! 🎁🎄'
);