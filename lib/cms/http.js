const MAX_BODY_BYTES = 1_000_000;

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function json(res, status, payload, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(payload));
}

export function methodNotAllowed(res, allowed) {
  json(res, 405, { error: "Method not allowed" }, { Allow: allowed.join(", ") });
}

export function noStore(res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
}

export function sendError(res, error) {
  if (error instanceof HttpError) {
    return json(res, error.status, { error: error.message });
  }

  if (error?.code === "23505") {
    return json(res, 409, { error: "An item with the same unique key already exists" });
  }

  // Database and runtime errors can contain operational details. Keep them server-side.
  console.error("API request failed", error?.code || error?.name || "unknown error");
  return json(res, 500, { error: "The request could not be completed" });
}

export async function readJson(req) {
  if (req.body !== undefined && req.body !== null) {
    if (Buffer.isBuffer(req.body)) return parseJson(req.body.toString("utf8"));
    if (typeof req.body === "string") return parseJson(req.body);
    if (typeof req.body === "object") return req.body;
  }

  const contentLength = Number(req.headers?.["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    throw new HttpError(413, "Request body is too large");
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new HttpError(413, "Request body is too large");
    }
    chunks.push(chunk);
  }
  return parseJson(Buffer.concat(chunks).toString("utf8"));
}

function parseJson(value) {
  if (!value || !value.trim()) return {};
  try {
    const parsed = JSON.parse(value);
    if (!isPlainObject(parsed)) {
      throw new HttpError(400, "JSON body must be an object");
    }
    return parsed;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "Invalid JSON body");
  }
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function requirePlainObject(value, message = "Request body must be an object") {
  if (!isPlainObject(value)) throw new HttpError(400, message);
  return value;
}
