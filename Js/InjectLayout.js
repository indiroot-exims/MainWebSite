function loadHTML(selector, url) {
  fetch(url)
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
      console.error(`Failed to load ${url}:`, error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadHTML("#header", "/Header.html");
  loadHTML("#footer", "/Footer.html");
});
