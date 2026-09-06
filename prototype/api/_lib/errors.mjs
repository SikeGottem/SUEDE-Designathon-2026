// Defines stable backend error codes while keeping credentials and provider failures out of client responses.
import { HostedValidationError } from "../../shared/hosted-keepsake.mjs";

export class HostedServiceError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "HostedServiceError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function asServiceError(error) {
  if (error instanceof HostedServiceError) return error;
  if (error instanceof HostedValidationError) {
    return new HostedServiceError(error.status, error.code, error.message, error.details);
  }
  return new HostedServiceError(503, "SERVICE_UNAVAILABLE", "Hosted keepsakes are temporarily unavailable.");
}

