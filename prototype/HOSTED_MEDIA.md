<!-- This document records the verified hosted-media handoff and its release boundaries. -->
# Hosted media handoff

## Status

**Deployed and verified at https://warm-and-fuzzies.vercel.app on 6 September 2026.** Public publishing is enabled by Ethan’s explicit 6 September correction: any visitor may prepare media without a code or account, using the existing shared limits. The code-free release is awaiting deployment; Ethan will perform the live test.

The normal maker can prepare one exact finished keepsake for its named receiver. It preserves the Cecelia/Gaegu paper, envelope, carrier, opening and cabinet experience: hosting moves supported media with that same object, rather than introducing an account, inbox, paired demo or a new receiver surface. The result is an unlisted capability link at `/for/<192-bit receiver id>`: anyone holding it can open the keepsake. The receiver needs no account; media never autoplays; no receipt is sent.

`/demo/create` and `/demo/receive` remain the existing local-safe rehearsal flow. They do not use this service and keep their safe-v3 fragment and bare-fallback behaviour.

## What is implemented

- The maker chooses supported local media and presses “prepare to give”, then receives a normal exact receiver link and QR without entering a code. Video remains local-only.
- Up to four photos (8 MiB each), one voice recording (12 MiB), and one song (20 MiB) can travel, capped at 32 MiB combined. Snapshot content is separately bounded and strictly validated.
- Server-only configuration uses Turso/libSQL and private Vercel Blob. The deployed service uses the `warm-and-fuzzies` Turso database with a 100 MB cap and Sydney private Blob store. This document deliberately omits keys and token values.
- A public publish session stores only a hash of the 256-bit draft owner token, permits short direct uploads, verifies each uploaded object, then finalizes an immutable Turso record. Published media stays at its exact private path; the receiver GET returns fresh short-lived reads, which the browser turns into temporary local object URLs and revokes when no longer needed.
- Sessions expire after one hour. Upload URLs last at most five minutes and never outlive the session; receiver reads last ten minutes. Limits are 10 starts per hour, 10 pending sessions, and 100 published keepsakes. Only the operator can call cleanup for expired unpublished uploads; its server-only secret remains required. Removing a cabinet entry removes only that browser-local reference, never hosted content.

The scoped Turso token is intended to expire about 6 October 2026 (created 6 September) and is limited to `data_read`, `data_add`, and `data_update` for `publish_sessions`, and `data_read` and `data_add` for `keepsakes`; the server never relies on client DDL or delete access.

## API and trust boundary

| Route | Role | Result |
| --- | --- | --- |
| `POST /api/publish-start` | Public; shared quotas | Creates or resumes a pending, idempotent session and returns bounded private upload URLs. |
| `PUT` signed Blob URL | Signed upload capability | Uploads only the planned object before expiry. |
| `POST /api/publish-finalize` | Draft token capability | Verifies the planned media and makes the immutable receiver record. |
| `GET /api/keepsake?id=<receiver id>` | Unlisted receiver capability | Returns the snapshot and fresh short-lived private media reads. |
| `POST /api/publish-cleanup` | Server-only operator key | Reclaims only expired unpublished uploads. |

This is privacy-by-unlisted-capability, not identity verification, end-to-end encryption, guaranteed retention, deletion, notification, analytics, service-grade delivery, or a claim that a link cannot be forwarded. Starting a publish is public; finalizing requires the draft owner token; cleanup requires the operator key. Receiver access is possession of the link. Any visitor can consume the shared hourly, pending and published quotas. Ethan explicitly accepted that scope when removing the presenter gate.

## Verification and remaining checks

- Build, 10 backend tests, and 35 combined browser regressions passed in the current local verification.
- The real-provider fixture passed locally and again on the production URL (33.5 seconds): ordinary creation uploaded a PNG, voice WAV and song WAV, then produced its exact receiver link and QR. A fresh browser context opened the photo and played both audio items after user taps; reload and cabinet revisit preserved them.
- Security fixes and verification cover stale receiver-link reuse, fragment override, copy failure, late PUT expiry, and request buffering.
- Production configuration uses sensitive production-only values. Release source `abd0a0b` is pushed to GitHub and the verified Vercel prebuilt deployment is aliased to the production URL. Physical phone, actual microphone capture and camera QR scanning remain unverified; the voice fixture used a synthetic recorder.

The source decision and proportional judging review are in [WIKI/DECISIONS.md](../WIKI/DECISIONS.md). The preflight basis is reproduced there from `Media-sharing-preflight.md` so this repository does not depend on an external workspace path.
