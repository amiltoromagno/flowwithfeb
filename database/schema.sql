CREATE TABLE posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  published_at TEXT NOT NULL,
  cover_image TEXT,
  cover_alt TEXT,
  cover_caption TEXT,
  excerpt TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  body TEXT NOT NULL DEFAULT ''
);
