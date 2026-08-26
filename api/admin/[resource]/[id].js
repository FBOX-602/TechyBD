import { deleteItem, getItem, updateItem } from "../../../lib/cms/db.js";
import { requireAdmin } from "../../../lib/cms/auth.js";
import { HttpError, json, methodNotAllowed, noStore, readJson, sendError } from "../../../lib/cms/http.js";

function parameter(req, name) {
  const value = req.query?.[name];
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req, res) {
  noStore(res);
  if (!requireAdmin(req, res)) return;
  const resource = parameter(req, "resource");
  const id = parameter(req, "id");

  try {
    if (!id) throw new HttpError(400, "Content id is required");
    if (req.method === "GET") {
      const item = await getItem(resource, id);
      return item
        ? json(res, 200, { item })
        : json(res, 404, { error: "Content item not found" });
    }
    if (req.method === "PATCH" || req.method === "PUT") {
      const item = await updateItem(resource, id, await readJson(req));
      return item
        ? json(res, 200, { item })
        : json(res, 404, { error: "Content item not found" });
    }
    if (req.method === "DELETE") {
      const deleted = await deleteItem(resource, id);
      return deleted
        ? json(res, 200, { deleted: true })
        : json(res, 404, { error: "Content item not found" });
    }
    return methodNotAllowed(res, ["GET", "PUT", "PATCH", "DELETE"]);
  } catch (error) {
    return sendError(res, error);
  }
}
