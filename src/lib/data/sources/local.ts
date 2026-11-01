/**
 * The default source: the files in src/data/, committed to git. Edit those files to change the site.
 */
import type { DataSource } from "./types";
import { projects } from "@/data/projects";
import { cv } from "@/data/cv";
import { setup, toolGroups, toolboxHighlights } from "@/data/tools";

export const local: DataSource = {
  name: "local",
  projects: async () => projects,
  cv: async () => cv,
  tools: async () => ({ setup, toolGroups, toolboxHighlights }),
};
