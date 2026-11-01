/**
 * Reads the same content from any JSON API: a headless CMS, Supabase/PostgREST behind a view, a small
 * server in front of a database, or static JSON on a bucket. Enable with DATA_SOURCE=http.
 *
 *   GET {DATA_API_URL}/projects             → Project[]
 *   GET {DATA_API_URL}/cv                   → CV
 *   GET {DATA_API_URL}/tools                → { setup, toolGroups, toolboxHighlights }
 *
 * If DATA_API_TOKEN is set it's sent as `Authorization: Bearer …`. Responses are validated like local data.
 */
import { DATA_API_URL, DATA_API_TOKEN } from "astro:env/server";
import type { DataSource } from "./types";

async function get(path: string): Promise<unknown> {
  if (!DATA_API_URL) throw new Error("DATA_SOURCE=http needs DATA_API_URL (see .env.example)");
  const url = `${DATA_API_URL.replace(/\/$/, "")}/${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...(DATA_API_TOKEN ? { Authorization: `Bearer ${DATA_API_TOKEN}` } : {}) },
  }).catch((e) => {
    throw new Error(`GET ${url} failed (${e.cause?.code ?? e.message}). Is DATA_API_URL right and the API up?`);
  });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status} ${res.statusText}`);
  return res.json();
}

export const http: DataSource = {
  name: "http",
  projects: () => get("projects"),
  cv: () => get("cv"),
  tools: () => get("tools"),
};
