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

  const segments = path.split("/").filter(Boolean); // e.g. ["BananaPowder.html"]
  const fileName = segments.length > 0 ? segments[segments.length - 1] : "";
  const fileNameLower = fileName.toLowerCase();

  // Pages where breadcrumb bar should be completely hidden
  const hideOnPaths = [
    "/",          // root
    "/index.html" // direct index.html if ever hit
  ];

  if (hideOnPaths.includes(path)) {
    if (breadcrumbNav) breadcrumbNav.style.display = "none";
    return;
  } else if (breadcrumbNav) {
    breadcrumbNav.style.display = "";
  }

  // Clear if anything exists
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

  // Always start with Home
  addItem({ label: "Home", href: "/" });

  // Blog index
  if (path === "/blog" || path === "/blog/index.html") {
    addItem({ label: "Blog", active: true });
    return;
  }

  // Blog post: any file under /blog/ that is not index.html
  if (segments[0] && segments[0].toLowerCase() === "blog" && fileNameLower !== "index.html") {
    addItem({ label: "Blog", href: "/blog/index.html" });

    const base = fileName.replace(".html", "");
    const label = base
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    addItem({ label, active: true });
    return;
  }

  // Products main page
  if (path === "/OurProduct.html") {
    addItem({ label: "Products", active: true });
    return;
  }

  // Product detail page: single HTML file in root that is not home/about/contact/etc.
  const productDetailFiles = [
    "bananapowder.html",
    "lemongrass.html",
    "moringapowder.html",
    "amlapowder.html",
    "beatrootpowder.html",
    "neempowder.html",
    "wheatgrasspowder.html"
    // add other product detail file names here, all lowercase
  ];

  if (productDetailFiles.includes(fileNameLower)) {
    addItem({ label: "Products", href: "/OurProduct.html" });

    const base = fileName.replace(".html", "");
    const label = base
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    addItem({ label, active: true });
    return;
  }

  // Fallback: only if we actually have segments
  if (segments.length > 0) {
    const last = fileName.replace(".html", "");
    const lastLabel = last
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
    addItem({ label: lastLabel, active: true });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    loadHTML("#header", "/Header.html"),
    loadHTML("#footer", "/Footer.html")
  ]).then(() => {
    buildBreadcrumb();
  });
});
