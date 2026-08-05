/* day-include-loader: load all [data-include] files in parallel (async), inject as each arrives */
(function () {
  function loadText(url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(xhr.responseText);
        } else {
          reject(new Error("Failed to load " + url + " (" + xhr.status + ")"));
        }
      };
      xhr.onerror = function () {
        reject(new Error("Network error loading " + url));
      };
      xhr.send(null);
    });
  }

  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));

  window.__includesReady = Promise.all(
    nodes.map(function (div) {
      var url = div.getAttribute("data-include");
      if (!url || div.dataset.includeLoaded === "true") {
        return Promise.resolve();
      }
      return loadText(url)
        .then(function (html) {
          div.innerHTML = html;
          div.dataset.includeLoaded = "true";
          if (typeof window.__onIncludeProgress === "function") {
            window.__onIncludeProgress(div);
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    })
  );
})();
