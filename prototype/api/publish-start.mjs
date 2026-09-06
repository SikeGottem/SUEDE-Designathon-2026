// Starts or resumes a public, quota-bounded direct-upload publish session.
import { errorResponse, jsonResponse, readJson } from "./_lib/http.mjs";
import { getRuntimeService } from "./_lib/runtime.mjs";

export async function POST(request) {
  try {
    const service = getRuntimeService();
    return jsonResponse(await service.start(await readJson(request)));
  } catch (error) {
    return errorResponse(error);
  }
}
