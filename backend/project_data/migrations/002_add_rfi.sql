CREATE TABLE IF NOT EXISTS rfi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER,
    rfi_number TEXT,
    title TEXT,
    description TEXT,
    question TEXT,
    suggested_fix TEXT,
    page INTEGER,
    x REAL,
    y REAL,
    severity TEXT,
    status TEXT DEFAULT 'Open',
    preview_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(file_id) REFERENCES file_records(id)
);

CREATE TABLE IF NOT EXISTS rfi_counter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    last_number INTEGER DEFAULT 0
);
