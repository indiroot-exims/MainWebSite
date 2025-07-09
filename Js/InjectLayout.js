function loadHTML(selector, filename) {
  const path = `${window.location.origin}/MainWebSite/${filename}`;
  fetch(path)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.text();
    })
    .then(data => {
      document.querySelector(selector).innerHTML = data;
    })
    .catch(error => {
      console.error(`Failed to load ${filename}:`, error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadHTML("#header", "Header.html");
  loadHTML("#footer", "Footer.html");
});
