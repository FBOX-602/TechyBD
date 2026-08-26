import { getSettings, updateSettings } from "../../lib/cms/db.js";
import { requireAdmin } from "../../lib/cms/auth.js";
import { json, methodNotAllowed, noStore, readJson, sendError } from "../../lib/cms/http.js";

export default async function handler(req, res) {
  noStore(res);
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === "GET") {
      return json(res, 200, { settings: await getSettings() });
    }
    if (req.method === "PATCH") {
      const body = await readJson(req);
      const settings = await updateSettings(body.settings ?? body);
      return json(res, 200, { settings });
    }
    return methodNotAllowed(res, ["GET", "PATCH"]);
  } catch (error) {
    return sendError(res, error);
  }
}
