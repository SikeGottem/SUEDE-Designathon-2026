// Starts or resumes an authenticated, bounded direct-upload publish session.
import { errorResponse, jsonResponse, readJson } from "./_lib/http.mjs";
import { getRuntimeService } from "./_lib/runtime.mjs";

export async function POST(request) {
  try {
    const service = getRuntimeService();
    service.authorizePresenter(request);
    return jsonResponse(await service.start(request, await readJson(request)));
  } catch (error) {
    return errorResponse(error);
  }
}
