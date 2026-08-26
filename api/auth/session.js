import { getSession } from "../../lib/cms/auth.js";
import { json, methodNotAllowed, noStore, sendError } from "../../lib/cms/http.js";

export default function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  noStore(res);
  try {
    const session = getSession(req);
    return json(res, 200, session
      ? { authenticated: true, expiresAt: session.exp }
      : { authenticated: false });
  } catch (error) {
    return sendError(res, error);
  }
}
