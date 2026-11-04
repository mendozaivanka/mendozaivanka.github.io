// Keeps the CV PDF away from bots. The site is static (GitHub Pages), so there is no server to check a captcha;
// instead the PDF never ships as a plain file. It ships encrypted, and the key is a secret number the browser has to
// find by brute force (a proof-of-work: about a second on a phone). The download button does that work after a real
// click, then decrypts and saves the PDF. Crawlers, link scrapers and AI-training bots fetch URLs; they don't click,
// run the search, and decrypt, so they only ever see an opaque .bin.
//
// It is a speed bump, not a vault: the CV text is on /about/ and in this public repo. What it stops is the PDF being
// harvested and indexed. The browser side is src/lib/cv-download.ts.
//
// Blob layout: [bits 1][salt 16][iv 12][tag 8][AES-256-GCM ciphertext + 16-byte auth tag]
//   key = SHA-256(salt ‖ n as 4 bytes big-endian), for a secret n < 2^bits
//   tag = first 8 bytes of SHA-256(key), so the browser knows when it has found n
import { createCipheriv, createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

/** Work factor: the browser tries up to 2^BITS candidates (half that on average). */
export const BITS = 18;

const sha = (...parts) => createHash("sha256").update(Buffer.concat(parts.map((p) => Buffer.from(p)))).digest();

/** Encrypt a PDF into a lock blob. Deterministic per PDF, so rebuilds don't churn the output. */
export function lockPdf(pdf) {
  const salt = sha("cv-lock salt", pdf).subarray(0, 16);
  const iv = sha("cv-lock iv", pdf).subarray(0, 12);
  const n = sha("cv-lock n", pdf).readUInt32BE(0) % 2 ** BITS;
  const nBytes = Buffer.alloc(4);
  nBytes.writeUInt32BE(n);
  const key = sha(salt, nBytes);
  const tag = sha(key).subarray(0, 8);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([cipher.update(pdf), cipher.final(), cipher.getAuthTag()]);
  return Buffer.concat([Buffer.from([BITS]), salt, iv, tag, body]);
}

/** Where the locked blob is served, for a PDF file name like "Ivanka-Mendoza-CV.pdf". Keep in sync with cv-download.ts. */
export const blobPath = (pdfName) => `/dl/${pdfName.replace(/\.pdf$/i, "")}.bin`;

/**
 * Lock cv/<pdfName> into <outDir>/dl/<name>.bin, removing stale blobs. Returns false (and writes nothing) if the PDF
 * isn't there yet, so a fresh clone still builds.
 */
export function writeLockedCv(root, pdfName, outDir) {
  const src = path.join(root, "cv", pdfName);
  if (!existsSync(src)) return false;
  const dir = path.join(outDir, "dl");
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) if (f.endsWith(".bin")) rmSync(path.join(dir, f));
  writeFileSync(path.join(outDir, blobPath(pdfName)), lockPdf(readFileSync(src)));
  return true;
}

/** Astro integration: writes the locked CV into public/dl/ before dev, check or build. */
export function cvLock({ pdfName }) {
  return {
    name: "cv-lock",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        if (!pdfName) return;
        const root = new URL(".", config.root).pathname;
        const ok = writeLockedCv(root, pdfName, new URL(".", config.publicDir).pathname);
        if (!ok) logger.warn(`cv/${pdfName} not found: run \`npm run resume:pdf\` to make it`);
      },
    },
  };
}
