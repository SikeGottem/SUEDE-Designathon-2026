// Verifies every uploaded object and atomically publishes an immutable keepsake.
import { errorResponse, jsonResponse, readJson } from "./_lib/http.mjs";
import { getRuntimeService } from "./_lib/runtime.mjs";

export async function POST(request) {
  try {
    return jsonResponse(await getRuntimeService().finalize(request, await readJson(request)));
  } catch (error) {
    return errorResponse(error);
  }
}
