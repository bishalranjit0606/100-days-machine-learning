/* day-include-loader: synchronous XHR so all day blocks are in DOM before script.js boots */
(function () {
  document.querySelectorAll("[data-include]").forEach(function (div) {
    var url = div.getAttribute("data-include");
    if (!url || div.dataset.includeLoaded === "true") return;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false); /* synchronous */
    xhr.send(null);
    if (xhr.status === 200 || xhr.status === 0) { /* status 0 = file:// success */
      div.innerHTML = xhr.responseText;
      div.dataset.includeLoaded = "true";
    }
  });
})();
