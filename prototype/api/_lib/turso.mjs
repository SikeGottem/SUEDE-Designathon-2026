// Adapts the Turso serverless client to atomic publish-session and immutable-keepsake operations.
import { createClient } from "@libsql/client/web";

export function createTursoAdapter({ databaseUrl, databaseToken, client } = {}) {
  const db = client ?? createClient({ url: databaseUrl, authToken: databaseToken });

  return {
    async createOrGetSession(session, limits, now) {
      const existing = await selectSessionByIdempotency(db, session.idempotencyKey);
      if (existing) return compareSession(existing, session);

      await db.execute({
        sql: `INSERT INTO publish_sessions (
          id, idempotency_key, request_hash, owner_token_hash, state,
          snapshot_json, media_plan_json, receiver_id, created_at_ms, expires_at_ms
        )
        SELECT ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?
        WHERE (SELECT COUNT(*) FROM publish_sessions WHERE state = 'pending' AND expires_at_ms >= ?) < ?
          AND (SELECT COUNT(*) FROM publish_sessions WHERE created_at_ms >= ?) < ?
          AND (SELECT COUNT(*) FROM keepsakes) < ?
        ON CONFLICT(idempotency_key) DO NOTHING`,
        args: [
          session.id, session.idempotencyKey, session.requestHash, session.ownerTokenHash,
          session.snapshotJson, session.mediaPlanJson, session.receiverId, session.createdAtMs,
          session.expiresAtMs, now, limits.maxPendingSessions,
          now - 60 * 60 * 1000, limits.maxStartsPerHour, limits.maxPublishedKeepsakes,
        ],
      });

      const saved = await selectSessionByIdempotency(db, session.idempotencyKey);
      if (saved) return compareSession(saved, session);

      const counts = await db.execute({
        sql: `SELECT
          (SELECT COUNT(*) FROM publish_sessions WHERE state = 'pending' AND expires_at_ms >= ?) AS pending_count,
          (SELECT COUNT(*) FROM publish_sessions WHERE created_at_ms >= ?) AS recent_count,
          (SELECT COUNT(*) FROM keepsakes) AS published_count`,
        args: [now, now - 60 * 60 * 1000],
      });
      const row = counts.rows[0] ?? {};
      if (Number(row.published_count) >= limits.maxPublishedKeepsakes) return { status: "published_limit" };
      if (Number(row.pending_count) >= limits.maxPendingSessions) return { status: "pending_limit" };
      if (Number(row.recent_count) >= limits.maxStartsPerHour) return { status: "rate_limit" };
      return { status: "conflict" };
    },

    async getSession(id) {
      const result = await db.execute({ sql: "SELECT * FROM publish_sessions WHERE id = ?", args: [id] });
      return result.rows[0] ? mapSession(result.rows[0]) : null;
    },

    async publishSession({ draftId, ownerTokenHash, verifiedMediaJson, contentHash, now, maxPublishedKeepsakes }) {
      await db.batch([
        {
          sql: `INSERT INTO keepsakes (
            receiver_id, session_id, snapshot_json, media_json, content_hash, created_at_ms
          )
          SELECT receiver_id, id, snapshot_json, ?, ?, ?
          FROM publish_sessions
          WHERE id = ? AND owner_token_hash = ? AND state = 'pending' AND expires_at_ms >= ?
            AND (SELECT COUNT(*) FROM keepsakes) < ?
          ON CONFLICT(session_id) DO NOTHING`,
          args: [verifiedMediaJson, contentHash, now, draftId, ownerTokenHash, now, maxPublishedKeepsakes],
        },
        {
          sql: `UPDATE publish_sessions
            SET state = 'published', verified_media_json = ?
            WHERE id = ? AND owner_token_hash = ?
              AND EXISTS (SELECT 1 FROM keepsakes WHERE session_id = publish_sessions.id)`,
          args: [verifiedMediaJson, draftId, ownerTokenHash],
        },
      ], "write");

      const result = await db.execute({
        sql: `SELECT p.*, k.receiver_id AS published_receiver_id
          FROM publish_sessions p LEFT JOIN keepsakes k ON k.session_id = p.id
          WHERE p.id = ?`,
        args: [draftId],
      });
      if (!result.rows[0]) return { status: "missing" };
      const row = result.rows[0];
      const session = mapSession(row);
      if (session.ownerTokenHash !== ownerTokenHash) return { status: "missing" };
      if (row.published_receiver_id) return { status: "published", session };
      if (session.expiresAtMs < now || ["cleaning", "cleaned"].includes(session.state)) return { status: "expired" };
      if (session.state === "pending") return { status: "published_limit" };
      return { status: "conflict" };
    },

    async getKeepsake(receiverId) {
      const result = await db.execute({ sql: "SELECT * FROM keepsakes WHERE receiver_id = ?", args: [receiverId] });
      if (!result.rows[0]) return null;
      const row = result.rows[0];
      return {
        receiverId: String(row.receiver_id),
        sessionId: String(row.session_id),
        snapshotJson: String(row.snapshot_json),
        mediaJson: String(row.media_json),
        contentHash: String(row.content_hash),
        createdAtMs: Number(row.created_at_ms),
      };
    },

    async claimExpiredSessions({ now, leaseUntilMs, limit }) {
      const result = await db.execute({
        sql: `UPDATE publish_sessions
          SET state = 'cleaning', cleanup_lease_until_ms = ?
          WHERE id IN (
            SELECT id FROM publish_sessions
            WHERE ((state = 'pending' AND expires_at_ms < ?)
              OR (state = 'cleaning' AND cleanup_lease_until_ms < ?))
              AND NOT EXISTS (SELECT 1 FROM keepsakes WHERE session_id = publish_sessions.id)
            ORDER BY expires_at_ms ASC LIMIT ?
          )
          RETURNING *`,
        args: [leaseUntilMs, now, now, limit],
      });
      return result.rows.map(mapSession);
    },

    async markSessionCleaned(id, leaseUntilMs) {
      await db.execute({
        sql: `UPDATE publish_sessions SET state = 'cleaned', cleanup_lease_until_ms = NULL
          WHERE id = ? AND state = 'cleaning' AND cleanup_lease_until_ms = ?
          AND NOT EXISTS (SELECT 1 FROM keepsakes WHERE session_id = publish_sessions.id)`,
        args: [id, leaseUntilMs],
      });
    },
  };
}

async function selectSessionByIdempotency(db, idempotencyKey) {
  const result = await db.execute({
    sql: "SELECT * FROM publish_sessions WHERE idempotency_key = ?",
    args: [idempotencyKey],
  });
  return result.rows[0] ? mapSession(result.rows[0]) : null;
}

function compareSession(saved, proposed) {
  const matches = saved.requestHash === proposed.requestHash
    && saved.ownerTokenHash === proposed.ownerTokenHash;
  return matches ? { status: saved.state === "pending" || saved.state === "published" ? "existing" : "expired", session: saved }
    : { status: "conflict" };
}

function mapSession(row) {
  return {
    id: String(row.id),
    idempotencyKey: String(row.idempotency_key),
    requestHash: String(row.request_hash),
    ownerTokenHash: String(row.owner_token_hash),
    state: String(row.state),
    snapshotJson: String(row.snapshot_json),
    mediaPlanJson: String(row.media_plan_json),
    receiverId: String(row.receiver_id),
    verifiedMediaJson: row.verified_media_json == null ? null : String(row.verified_media_json),
    createdAtMs: Number(row.created_at_ms),
    expiresAtMs: Number(row.expires_at_ms),
    cleanupLeaseUntilMs: row.cleanup_lease_until_ms == null ? null : Number(row.cleanup_lease_until_ms),
  };
}
