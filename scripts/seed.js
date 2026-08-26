import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import crypto from "node:crypto";
import { getPool } from "../lib/cms/db.js";
import { migrate } from "./migrate.js";

const fallbackSettings = {
  brandName: "Techy BD",
  tagline: "Web Design & Digital Solutions — Bangladesh",
  logo: "/techy-bd-logo.png",
  contact: {
    email: "hello@techybd.com",
    whatsapp: "",
  },
};

function toSeedKey(resource, item, index) {
  const source = String(item.slug || item.title || item.name || `item-${index + 1}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
  return `${source.slice(0, 120)}-${index + 1}`;
}

function asFaqs(faqItems) {
  return (faqItems || []).map((entry) => {
    if (Array.isArray(entry)) return { question: entry[0] || "", answer: entry[1] || "" };
    return entry;
  });
}

export async function seed() {
  await migrate();
  const defaults = await import("../src/data.js");
  const collections = {
    projects: defaults.projects || [],
    services: defaults.services || [],
    offers: defaults.offers || [],
    testimonials: defaults.testimonials || [],
    faqs: asFaqs(defaults.faqItems),
  };
  const settings = {
    ...fallbackSettings,
    ...(defaults.siteSettings || {}),
  };

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO site_settings (setting_key, value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (setting_key) DO NOTHING`,
      ["global", JSON.stringify(settings)],
    );

    for (const [resource, items] of Object.entries(collections)) {
      for (const [index, item] of items.entries()) {
        await client.query(
          `INSERT INTO cms_items (id, resource, item_key, sort_order, data)
           VALUES ($1, $2, $3, $4, $5::jsonb)
           ON CONFLICT (resource, item_key) DO NOTHING`,
          [crypto.randomUUID(), resource, toSeedKey(resource, item, index), index, JSON.stringify(item)],
        );
      }
    }
    await client.query("COMMIT");
    console.log("Database seed completed without overwriting existing CMS content.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

const invokedFile = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedFile === fileURLToPath(import.meta.url)) {
  seed()
    .then(() => getPool().end())
    .catch((error) => {
      console.error("Database seed failed.");
      process.exitCode = 1;
    });
}
