/**
 * The shape of every piece of content the site renders, checked at build time.
 *
 * Each schema is typed against the TypeScript type the components already use (`z.ZodType<Project>`), so
 * the two can't drift: change one without the other and `astro check` fails. Objects are strict, so a
 * misspelled or unknown field ("summmary") fails the build instead of silently disappearing. Whatever data source is
 * active (local files today, a database later) must return data that passes these, or the build stops
 * with a message naming the bad field.
 */
import { z } from "astro/zod";
import type { Project } from "@/data/projects";
import type { CV } from "@/data/cv";
import type { ToolGroup, Swatch } from "@/data/tools";

// ───────── Portfolio ─────────
const tint = z.enum(["rosas", "heather", "moss", "sand"]);
const swatch: z.ZodType<Swatch> = z.enum(["rosas", "heather", "moss", "sand", "fjord"]);
const yearMonth = z.string().regex(/^\d{4}(-\d{2})?$/, 'use "YYYY" or "YYYY-MM"');

export const projectSchema: z.ZodType<Project> = z.strictObject({
  title: z.string().min(1),
  year: z.number().int(),
  period: z.string().optional(),
  kind: z.enum(["work", "personal"]),
  org: z.string().optional(),
  categories: z.array(z.enum(["agents", "automation", "rag", "prompting", "evals", "data"])).min(1),
  description: z.string().min(1),
  summary: z.string().optional(),
  results: z.array(z.string()).optional(),
  tags: z.array(z.string()),
  tint,
  preview: z.array(z.string()),
  links: z.array(z.strictObject({ label: z.string(), href: z.string() })),
  featured: z.boolean().optional(),
  media: z.strictObject({
    poster: z.string().startsWith("/"),
    alt: z.string().min(10, "describe what the image shows"),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }).optional(),
  caseStudy: z.strictObject({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    tagline: z.string().min(1),
    role: z.string().min(1),
    problem: z.strictObject({ headline: z.string().min(1), body: z.array(z.string()).min(1) }),
    architecture: z.strictObject({
      caption: z.string(),
      stages: z.array(z.strictObject({
        title: z.string(),
        nodes: z.array(z.strictObject({ label: z.string(), tech: z.string(), note: z.string().optional() })).min(1),
      })).min(2),
      loop: z.string().optional(),
    }),
    solution: z.array(z.string()).min(1),
    evals: z.strictObject({
      method: z.array(z.string()).min(1),
      metrics: z.array(z.strictObject({ value: z.string(), label: z.string(), note: z.string() })).min(1),
      caveat: z.string().optional(),
    }),
  }).optional(),
});
export const projectsSchema = z.array(projectSchema).superRefine((list, ctx) => {
  const seen = new Set<string>();
  list.forEach((p, i) => {
    const slug = p.caseStudy?.slug;
    if (!slug) return;
    if (seen.has(slug)) ctx.addIssue({ code: "custom", path: [i, "caseStudy", "slug"], message: `duplicate case-study slug "${slug}"` });
    seen.add(slug);
  });
});

export const cvSchema: z.ZodType<CV> = z.strictObject({
  profile: z.strictObject({
    fullName: z.string(),
    title: z.string(),
    location: z.string(),
    email: z.email(),
    phone: z.string().nullable(),
    summary: z.string(),
    pdf: z.string().nullable(),
  }),
  impact: z.array(z.strictObject({ value: z.string(), label: z.string(), note: z.string() })),
  experience: z.array(z.strictObject({
    company: z.string(),
    title: z.string(),
    location: z.string(),
    start: yearMonth,
    end: yearMonth.nullable(),
    bullets: z.array(z.string()),
    stack: z.array(z.string()).optional(),
  })),
  education: z.array(z.strictObject({
    school: z.string(), degree: z.string(), honours: z.string(), location: z.string(), start: z.string(), end: z.string(),
  })),
  skills: z.array(z.strictObject({ group: z.string(), items: z.array(z.string()) })),
  certifications: z.array(z.strictObject({ name: z.string(), issuer: z.string() })),
  languages: z.array(z.strictObject({ name: z.string(), level: z.string() })),
});

export const toolsSchema = z.strictObject({
  setup: z.array(z.strictObject({ label: z.string(), value: z.string() })),
  toolGroups: z.array(z.strictObject({ title: z.string(), description: z.string(), swatch, items: z.array(z.string()) }) satisfies z.ZodType<ToolGroup>),
  toolboxHighlights: z.array(z.strictObject({ label: z.string(), swatch })),
});
