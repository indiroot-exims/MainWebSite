function loadHTML(selector, file) {
  return fetch(file)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.text();
    })
    .then(data => {
      const el = document.querySelector(selector);
      if (el) {
        el.innerHTML = data;
      }
    })
    .catch(err => {
      console.error(`Failed to load ${file}:`, err);
    });
}

function buildBreadcrumb() {
  const ol = document.getElementById("breadcrumb");
  if (!ol) return;
  const breadcrumbNav = ol.closest('nav[aria-label="breadcrumb"]');

  // Normalise path, ensure root stays as "/"
  let path = window.location.pathname || "/";
  path = path === "/" ? "/" : path.replace(/\/+$/, "");
  const segments = path.split("/").filter(Boolean);
  const fileName = segments.length > 0 ? segments[segments.length - 1] : "";
  const fileNameLower = fileName.toLowerCase();

  // Pages where breadcrumb bar should be completely hidden
  const hideOnPaths = ["/", "/index.html"];
  if (hideOnPaths.includes(path)) {
    if (breadcrumbNav) breadcrumbNav.style.display = "none";
    return;
  } else if (breadcrumbNav) {
    breadcrumbNav.style.display = "";
  }

  ol.innerHTML = "";

  function addItem(options) {
    const { label, href, active } = options;
    const li = document.createElement("li");
    li.className = "breadcrumb-item" + (active ? " active" : "");
    if (active) {
      li.setAttribute("aria-current", "page");
      li.textContent = label;
    } else {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      li.appendChild(a);
    }
    ol.appendChild(li);
  }

  addItem({ label: "Home", href: "/" });

  // Blog index
  if (path === "/blog" || path === "/blog/index.html") {
    addItem({ label: "Blog", active: true });
    return;
  }

  // Blog post
  if (segments[0] && segments[0].toLowerCase() === "blog" && fileNameLower !== "index.html") {
    addItem({ label: "Blog", href: "/blog/index.html" });
    const base = fileName.replace(".html", "");
    const label = base.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    addItem({ label, active: true });
    return;
  }

  // Products main page
  if (fileNameLower === "our-product.html") {
    addItem({ label: "Products", active: true });
    return;
  }

  // Product detail pages — matches actual hyphenated filenames used on the site.
  // NOTE: previously this list used non-hyphenated names (e.g. "bananapowder.html")
  // which never matched the real files, so the "Products" breadcrumb parent
  // never appeared on any product page. Fixed here.
  const productDetailFiles = [
    "banana-powder.html",
    "moringa-powder.html",
    "onion-powder.html",
    "tomato-powder.html",
    "garlic-powder.html",
    "neem-powder.html",
    "beetroot-powder.html",
    "amla-powder.html",
    "wheatgrass-powder.html",
    "lemongrass-powder.html",
    "spices.html",
    "banana-powder-usa.html",
    "banana-powder-uae.html",
    "banana-powder-kenya.html",
    "banana-powder-europe.html",
    "moringa-powder-usa.html",
    "moringa-powder-uae.html",
    "moringa-powder-kenya.html",
    "moringa-powder-europe.html"
  ];

  if (productDetailFiles.includes(fileNameLower)) {
    addItem({ label: "Products", href: "/our-product.html" });
    const base = fileName.replace(".html", "");
    const label = base.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    addItem({ label, active: true });
    return;
  }

  // Fallback
  if (segments.length > 0) {
    const last = fileName.replace(".html", "");
    const lastLabel = last.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    addItem({ label: lastLabel, active: true });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.querySelector("#header");
  const footerEl = document.querySelector("#footer");

  // Header/footer are now inlined into every page at build time (see build.js),
  // so #header and #footer should already be populated when this script runs.
  // The fetch() calls below only fire as a fallback — e.g. if you open a page
  // directly without running the build step during local development.
  const needsHeader = headerEl && headerEl.innerHTML.trim() === "";
  const needsFooter = footerEl && footerEl.innerHTML.trim() === "";

  const tasks = [];
  if (needsHeader) tasks.push(loadHTML("#header", "/Header.html"));
  if (needsFooter) tasks.push(loadHTML("#footer", "/Footer.html"));

  Promise.all(tasks).then(() => {
    buildBreadcrumb();
  });
});
