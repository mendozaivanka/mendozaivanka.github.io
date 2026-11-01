// ───────── Edit these: everything personal lives here ─────────

export const site = {
  name: "Ivanka",
  role: "AI & Automation Engineer",
  description:
    "Ivanka Mendoza is an AI, automation and prompt engineer who builds RAG pipelines, agents and workflows that quietly do the busywork.",
  location: "Metro Manila",
  // IANA time zone for the header clock. Leave empty to use the visitor's own.
  timeZone: "Asia/Manila",
  email: "mendozaivanka@gmail.com",
  available: true,
};

export type Social = { name: string; href: string; note: string };

export const socials: Social[] = [
  { name: "GitHub", href: "https://github.com/mendozaivanka", note: "workflows, prompts & experiments" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/mendozaivanka/", note: "the professional version" },
  // { name: "X / Twitter", href: "https://x.com/", note: "half-baked AI thoughts" },
  // { name: "Upwork", href: "https://www.upwork.com/", note: "hire me for a project" },
  // { name: "Contra", href: "https://contra.com/", note: "freelance profile" },
];

/** Lines that rotate in the "Currently prompting" card. */
export const prompts = [
  "You are a calm, precise assistant…",
  "Extract every invoice line item as JSON.",
  "Think step by step, then answer in one line.",
  "If you're unsure, say so. Never guess.",
  "Classify this ticket: billing, bug, or feature?",
];

/** Eval pass rate (%) for prompt versions v1…v9, drawn as the hero sparkline. Sample data. */
export const passRates = [71, 74, 82, 80, 85, 88, 90, 93, 95];

export const nav = [
  { label: "Projects", href: "/projects/" },
  { label: "Coffee", href: "/#coffee" },
  { label: "CV", href: "/cv/" },
  { label: "Nordic Rose", href: "/nordic-rose/" },
  { label: "Contact", href: "/#contact" },
];

/** Where Timpla lives. Its own repo (served at /timpla/ on this domain) isn't up yet, so this points at the
 *  last Render build. Change it to "/timpla/" when mendozaivanka/timpla deploys. */
export const TIMPLA_URL = "https://portfolio-d79q.onrender.com/timpla/";

export type CoffeeSite = {
  name: string;
  blurb: string;
  status: "Live" | "Building" | "Planned";
  /** Empty until the site is public. */
  href: string;
  /** Label for the preview box until a real screenshot exists. */
  preview: string;
  tint: "rosas" | "sand" | "fjord" | "heather";
};

/** The coffee family: open-data side projects, each its own repo on GitHub Pages. */
export const coffee: CoffeeSite[] = [
  { name: "Timpla", blurb: "Metro Manila's independent cafés, and Philippine coffee by province", status: "Live", href: TIMPLA_URL, preview: "Café map", tint: "rosas" },
  { name: "Sinturon", blurb: "Where the world's coffee species grow, and who produces it", status: "Building", href: "", preview: "Species map", tint: "sand" },
  { name: "Pigâ", blurb: "Espresso, pour-over and press, explained through their physics", status: "Planned", href: "", preview: "Pressure vs flow", tint: "fjord" },
  { name: "Sangkap", blurb: "What's in a cup: caffeine and chlorogenic acids, with sources", status: "Planned", href: "", preview: "Caffeine curve", tint: "heather" },
];
