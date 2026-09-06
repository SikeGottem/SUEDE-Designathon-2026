// Returns one immutable keepsake with short-lived read URLs for its exact private media paths.
import { errorResponse, jsonResponse } from "./_lib/http.mjs";
import { getRuntimeService } from "./_lib/runtime.mjs";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    return jsonResponse(await getRuntimeService().get(url.searchParams.get("id")));
  } catch (error) {
    return errorResponse(error);
  }
}
