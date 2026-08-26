import { clearSession } from "../../lib/cms/auth.js";
import { json, methodNotAllowed, noStore } from "../../lib/cms/http.js";

export default function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  noStore(res);
  clearSession(res);
  return json(res, 200, { authenticated: false });
}
