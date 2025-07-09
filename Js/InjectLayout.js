function getBaseURL() {
  const path = window.location.pathname;
  const repoName = path.split("/")[1];
  return `/${repoName}/`;
}

function loadHTML(selector, file) {
  const base = getBaseURL();
  fetch(base + file)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.text();
    })
    .then(data => {
      document.querySelector(selector).innerHTML = data;
    })
    .catch(err => {
      console.error(`Failed to load ${file}:`, err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadHTML("#header", "Header.html");
  loadHTML("#footer", "Footer.html");
});
