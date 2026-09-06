-- Defines immutable keepsakes and bounded publish sessions for the hosted media handoff.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS publish_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  request_hash TEXT NOT NULL,
  owner_token_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'published', 'cleaning', 'cleaned')),
  snapshot_json TEXT NOT NULL CHECK (json_valid(snapshot_json)),
  media_plan_json TEXT NOT NULL CHECK (json_valid(media_plan_json)),
  receiver_id TEXT NOT NULL UNIQUE,
  verified_media_json TEXT CHECK (verified_media_json IS NULL OR json_valid(verified_media_json)),
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  cleanup_lease_until_ms INTEGER
) STRICT;

CREATE INDEX IF NOT EXISTS publish_sessions_state_expiry
  ON publish_sessions (state, expires_at_ms);

CREATE INDEX IF NOT EXISTS publish_sessions_created
  ON publish_sessions (created_at_ms);

CREATE TABLE IF NOT EXISTS keepsakes (
  receiver_id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT NOT NULL UNIQUE REFERENCES publish_sessions(id),
  snapshot_json TEXT NOT NULL CHECK (json_valid(snapshot_json)),
  media_json TEXT NOT NULL CHECK (json_valid(media_json)),
  content_hash TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL
) STRICT;
