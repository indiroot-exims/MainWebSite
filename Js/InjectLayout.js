function loadHTML(selector, url) {
    fetch(url)
      .then(res => res.text())
      .then(data => {
        document.querySelector(selector).innerHTML = data;
      });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    loadHTML("#header", "Header.html");
    loadHTML("#footer", "Footer.html");
  });
  