/**
 * build.js
 * ---------------------------------------------------------------------
 * Inlines Header.html and Footer.html into every page at build time,
 * so the HTML that ships to browsers (and crawlers) already contains
 * the full navigation — no client-side fetch() needed for header/footer.
 *
 * Source pages keep the same simple placeholders they use today:
 *   <div id="header"></div>
 *   <div id="footer"></div>
 * This script fills those in and writes the result to /docs, which is
 * what you point GitHub Pages at (Settings → Pages → Source → /docs).
 *
 * Usage:
 *   node build.js
 *
 * No dependencies required — uses only Node's built-in fs/path.
 * ---------------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, "docs");

// Files/folders to skip when scanning for pages to build
const SKIP = new Set([
  "docs", "node_modules", ".git", ".github",
  "Header.html", "Footer.html", "build.js"
]);

function readPartial(name) {
  const file = path.join(ROOT, name);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing partial: ${name} (expected at ${file})`);
  }
  return fs.readFileSync(file, "utf8").trim();
}

function findHtmlFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(full, results);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

function build() {
  const headerHTML = readPartial("Header.html");
  const footerHTML = readPartial("Footer.html");

  const pages = findHtmlFiles(ROOT);
  if (pages.length === 0) {
    console.warn("No .html pages found to build.");
    return;
  }

  let count = 0;
  for (const filePath of pages) {
    let html = fs.readFileSync(filePath, "utf8");

    const before = html;
    html = html.replace(
      /<div id="header">[\s\S]*?<\/div>/,
      `<div id="header">\n${headerHTML}\n</div>`
    );
    html = html.replace(
      /<div id="footer">[\s\S]*?<\/div>/,
      `<div id="footer">\n${footerHTML}\n</div>`
    );

    if (html === before) {
      console.warn(`⚠️  No #header/#footer placeholder found in: ${path.relative(ROOT, filePath)}`);
    }

    const relPath = path.relative(ROOT, filePath);
    const outPath = path.join(OUT_DIR, relPath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, "utf8");
    count++;
  }

  // Copy static asset folders as-is (Images, Css, Js) so /docs is a
  // complete, deployable site.
  for (const assetDir of ["Images", "Css", "Js", "favicon.ico"]) {
    const src = path.join(ROOT, assetDir);
    if (fs.existsSync(src)) {
      copyRecursive(src, path.join(OUT_DIR, assetDir));
    }
  }

  console.log(`✅ Built ${count} page(s) into /docs`);
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

build();
