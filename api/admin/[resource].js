import { createItem, listItems } from "../../lib/cms/db.js";
import { requireAdmin } from "../../lib/cms/auth.js";
import { json, methodNotAllowed, noStore, readJson, sendError } from "../../lib/cms/http.js";

export default async function handler(req, res) {
  noStore(res);
  if (!requireAdmin(req, res)) return;
  const resource = Array.isArray(req.query?.resource) ? req.query.resource[0] : req.query?.resource;

  try {
    if (req.method === "GET") {
      return json(res, 200, { items: await listItems(resource) });
    }
    if (req.method === "POST") {
      const item = await createItem(resource, await readJson(req));
      return json(res, 201, { item });
    }
    return methodNotAllowed(res, ["GET", "POST"]);
  } catch (error) {
    return sendError(res, error);
  }
}
