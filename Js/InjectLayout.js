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

  // Clear if anything exists
  ol.innerHTML = "";

  const path = window.location.pathname.replace(/\/+$/, ""); // remove trailing /
  const segments = path.split("/").filter(Boolean); // e.g. ["blog","organic-moringa-powder-benefits.html"]

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

  if (path === "/" || segments.length === 0) {
    // Home page only
    return;
  }

  // Blog index
  if (path === "/blog" || path === "/blog/index.html") {
    addItem({ label: "Blog", active: true });
    return;
  }

  // Blog post: /blog/slug.html
  if (segments[0] === "blog" && segments.length === 2) {
    addItem({ label: "Blog", href: "/blog/index.html" });

    const file = segments[1].replace(".html", "");
    const label = file
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

  // Product detail: /products/slug.html
  if (segments[0] === "products" && segments.length === 2) {
    addItem({ label: "Products", href: "/OurProduct.html" });

    const file = segments[1].replace(".html", "");
    const label = file
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    addItem({ label, active: true });
    return;
  }

  // Fallback: just show last segment as active label
  const last = segments[segments.length - 1].replace(".html", "");
  const lastLabel = last
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
  addItem({ label: lastLabel, active: true });
}

document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer from site root so it works in /blog/, /products/, etc.
  Promise.all([
    loadHTML("#header", "/Header.html"),
    loadHTML("#footer", "/Footer.html")
  ]).then(() => {
    // After header is injected, build breadcrumb into <ol id="breadcrumb"> in Header.html
    buildBreadcrumb();
  });
});
