// Describes the hosted-keepsake transport helpers consumed by the Vite client and server functions.
export type HostedMediaSlot = "photo-0" | "photo-1" | "photo-2" | "photo-3" | "voice" | "song";
export type HostedMediaDescriptor = { slot: HostedMediaSlot; mime: string; bytes: number; filename: string };

export const MEDIA_LIMITS: Readonly<{ photo: number; voice: number; song: number; combined: number }>;
export const HOSTED_LIMITS: Readonly<{
  maxSnapshotBytes: number;
  maxPendingSessions: number;
  maxStartsPerHour: number;
  maxPublishedKeepsakes: number;
  sessionTtlMs: number;
  cleanupLeaseMs: number;
  uploadUrlTtlMs: number;
  readUrlTtlMs: number;
}>;
export const PHOTO_SLOTS: readonly HostedMediaSlot[];
export const MEDIA_SLOTS: readonly HostedMediaSlot[];

export class HostedValidationError extends Error {
  code: string;
  status: number;
  details?: unknown;
}

export function normalizeMime(value: unknown): string;
export function mediaReference(slot: HostedMediaSlot): string;
export function slotFromMediaReference(value: unknown): HostedMediaSlot | null;
export function extensionForMime(mime: string): string | null;
export function canonicalJson(value: unknown): string;
export function validateHostedSnapshot(value: unknown): { value: unknown; json: string; mediaSlots: HostedMediaSlot[] };
export function validateMediaDescriptors(value: unknown, referencedSlots: HostedMediaSlot[]): HostedMediaDescriptor[];
export function validateStartPayload(value: unknown): {
  snapshot: unknown;
  snapshotJson: string;
  media: HostedMediaDescriptor[];
  idempotencyKey: string;
  draftToken: string;
};
export function assertMediaSignature(mime: string, input: Uint8Array | ArrayBuffer): void;
export function isReceiverId(value: unknown): boolean;
export function isDraftId(value: unknown): boolean;
