(function () {
  "use strict";

  var MOBILE_MQ = window.matchMedia("(max-width: 1024px)");
  var REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");

  var currentSectionId = "1";
  var scrollOffsetDesktop = 24;
  var scrollOffsetMobile = 64;

  /* --- Icons --- */
  function initIcons(root) {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      var opts = { attrs: { "aria-hidden": "true" } };
      if (root) opts.root = root;
      lucide.createIcons(opts);
    }
  }

  function setPauseIcon(isPaused) {
    var el = document.getElementById("tts-pause-icon");
    if (!el) return;
    el.setAttribute("data-lucide", isPaused ? "play" : "pause");
    var parent = el.parentElement;
    if (parent) {
      parent.setAttribute("aria-label", isPaused ? "Resume" : "Pause");
      parent.setAttribute("title", isPaused ? "Resume" : "Pause");
    }
    initIcons(parent || document);
  }

  /* --- Hero layer glow bounds --- */
  function initHeroLayerGlows() {
    var padding = 10;
    var pairs = [
      { glow: ".hero__layer-glow--input", layer: ".hero__layer--input" },
      { glow: ".hero__layer-glow--hidden", layer: ".hero__layer--hidden" },
      { glow: ".hero__layer-glow--output", layer: ".hero__layer--output" }
    ];

    pairs.forEach(function (pair) {
      var glowRect = document.querySelector(pair.glow);
      var layer = document.querySelector(pair.layer);
      if (!glowRect || !layer) return;

      var minX = Infinity;
      var minY = Infinity;
      var maxX = -Infinity;
      var maxY = -Infinity;

      layer.querySelectorAll(".hero__node").forEach(function (node) {
        var transform = node.getAttribute("transform") || "";
        var match = transform.match(/translate\(([\d.]+)\s+([\d.]+)\)/);
        if (!match) return;

        var cx = parseFloat(match[1]);
        var cy = parseFloat(match[2]);
        var ring = node.querySelector(".hero__node-ring");
        var r = ring ? parseFloat(ring.getAttribute("r") || "16") : 16;
        r += 1.75;

        minX = Math.min(minX, cx - r);
        maxX = Math.max(maxX, cx + r);
        minY = Math.min(minY, cy - r);
        maxY = Math.max(maxY, cy + r);
      });

      if (!isFinite(minX)) return;

      glowRect.setAttribute("x", (minX - padding).toFixed(1));
      glowRect.setAttribute("y", (minY - padding).toFixed(1));
      glowRect.setAttribute("width", (maxX - minX + padding * 2).toFixed(1));
      glowRect.setAttribute("height", (maxY - minY + padding * 2).toFixed(1));
    });
  }

  /* --- Hero training loop --- */
  function initHeroTraining() {
    var visual = document.querySelector(".hero__visual");
    var epochEl = document.getElementById("hero-epoch");
    var accFill = document.getElementById("hero-acc-fill");
    var accPct = document.getElementById("hero-acc-pct");
    var lossLine = document.getElementById("hero-loss-line");
    var lossArea = document.getElementById("hero-loss-area");
    var lossValLine = document.getElementById("hero-loss-val-line");
    var lossReadout = document.getElementById("hero-loss-val");
    var nodeVals = document.querySelectorAll(".hero__node-val");
    if (!visual) return;

    var CYCLE = 3000;
    var LIVE_DELAY = 300;
    var POINTS = 12;
    var CHART = { x0: 28, x1: 276, yTop: 16, yBase: 48, minV: 0.08, maxV: 1.0 };
    var epoch = 1;
    var acc = 72;
    var bases = [0.82, 0.41, 0.67, 0.21, 0.93, 0.55, 0.14, 0.78, 0.61];
    var trainLoss = [0.94, 0.91, 0.89, 0.86, 0.84, 0.82, 0.8, 0.79, 0.77, 0.76, 0.74, 0.73];
    var valLoss = [0.98, 0.95, 0.93, 0.9, 0.88, 0.86, 0.85, 0.83, 0.82, 0.81, 0.8, 0.79];

    function fmt(n) {
      return n.toFixed(2);
    }

    function drift(base, index, ep) {
      var wave = Math.sin((ep + index) * 0.65) * 0.05;
      var nudge = Math.cos((ep * 0.4) + index) * 0.03;
      return Math.max(0.08, Math.min(0.98, base + wave + nudge));
    }

    function lossNoise(ep, slot) {
      return Math.sin(ep * 1.35 + slot * 0.85) * 0.016 + Math.cos(ep * 0.55 + slot * 1.2) * 0.012;
    }

    function nextLoss(prev, ep, slot, floor, bias) {
      var drop = 0.006 + ((ep % 5) * 0.002);
      return Math.max(floor, prev - drop + lossNoise(ep, slot) + bias);
    }

    function valueToY(v) {
      var span = CHART.maxV - CHART.minV;
      return CHART.yBase - ((v - CHART.minV) / span) * (CHART.yBase - CHART.yTop);
    }

    function seriesToLine(values) {
      var step = (CHART.x1 - CHART.x0) / (values.length - 1);
      var parts = [];
      values.forEach(function (v, i) {
        var x = CHART.x0 + (i * step);
        parts.push((i === 0 ? "M" : "L") + x.toFixed(1) + " " + valueToY(v).toFixed(1));
      });
      return parts.join(" ");
    }

    function seriesToArea(values) {
      return seriesToLine(values) + " L" + CHART.x1 + " " + CHART.yBase + " L" + CHART.x0 + " " + CHART.yBase + " Z";
    }

    function renderChart() {
      if (lossLine) lossLine.setAttribute("d", seriesToLine(trainLoss));
      if (lossArea) lossArea.setAttribute("d", seriesToArea(trainLoss));
      if (lossValLine) lossValLine.setAttribute("d", seriesToLine(valLoss));
      if (lossReadout) lossReadout.textContent = fmt(trainLoss[trainLoss.length - 1]);
    }

    function advanceChart() {
      trainLoss.shift();
      valLoss.shift();
      trainLoss.push(nextLoss(trainLoss[trainLoss.length - 1], epoch, POINTS, 0.12, 0));
      valLoss.push(nextLoss(valLoss[valLoss.length - 1], epoch, POINTS + 7, 0.16, 0.035));
      renderChart();
    }

    function seedChartForEpoch(ep) {
      trainLoss = [];
      valLoss = [];
      var t = 0.94;
      var v = 0.98;
      var i;
      for (i = 0; i < POINTS; i += 1) {
        t = nextLoss(t, ep - (POINTS - i), i, 0.12, 0);
        v = nextLoss(v, ep - (POINTS - i), i + 4, 0.16, 0.035);
        trainLoss.push(t);
        valLoss.push(v);
      }
      renderChart();
    }

    function setAcc(val) {
      if (accFill) accFill.style.setProperty("--acc-scale", (val / 100).toFixed(2));
      if (accPct) accPct.textContent = val + "%";
    }

    function updateActivations() {
      nodeVals.forEach(function (el, i) {
        el.textContent = fmt(drift(bases[i], i, epoch));
      });
    }

    function tick() {
      epoch = epoch >= 24 ? 1 : epoch + 1;
      acc = acc >= 94 ? 72 : acc + 1;
      if (epochEl) epochEl.textContent = "Epoch " + epoch;
      setAcc(acc);
      updateActivations();
      advanceChart();
    }

    if (REDUCED_MOTION.matches) {
      visual.classList.add("hero__visual--live");
      epoch = 12;
      if (epochEl) epochEl.textContent = "Epoch 12";
      setAcc(91);
      nodeVals.forEach(function (el, i) {
        el.textContent = fmt(bases[i]);
      });
      seedChartForEpoch(12);
      return;
    }

    setAcc(acc);
    renderChart();
    updateActivations();

    setTimeout(function () {
      visual.classList.add("hero__visual--live");
      updateActivations();
    }, LIVE_DELAY);

    setTimeout(function () {
      tick();
      setInterval(tick, CYCLE);
    }, LIVE_DELAY + CYCLE);
  }

  /* --- Hero ready --- */
  function initHeroReadyClass() {
    requestAnimationFrame(function () {
      document.documentElement.classList.add("is-ready");
    });
  }

  /* --- Scroll reveal --- */
  function initReveals() {
    var targets = document.querySelectorAll(".chapter-divider, .lesson-card, .reveal");
    if (!targets.length) return;

    if (REDUCED_MOTION.matches) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --- Workflow animation --- */
  function initWorkflowAnimation() {
    var workflows = document.querySelectorAll(".workflow");
    if (!workflows.length) return;

    if (REDUCED_MOTION.matches) {
      workflows.forEach(function (w) {
        w.classList.add("is-animated");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-animated");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    workflows.forEach(function (w) {
      observer.observe(w);
    });
  }

  /* --- Scroll offset --- */
  function getScrollOffset() {
    if (MOBILE_MQ.matches) {
      var header = document.querySelector(".mobile-header");
      var h = header ? header.offsetHeight : 56;
      return h + 8;
    }
    return scrollOffsetDesktop;
  }

  var resizeTimer;
  function onResizeOffset() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      scrollOffsetMobile = getScrollOffset();
    }, 150);
  }

  window.addEventListener("resize", onResizeOffset);
  window.addEventListener("orientationchange", function () {
    onResizeOffset();
    if (!MOBILE_MQ.matches) closeMobileNav();
  });

  /* --- Smooth scroll --- */
  function smoothScrollTo(targetEl) {
    if (!targetEl) return;
    var offset = getScrollOffset();
    var top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
    var behavior = REDUCED_MOTION.matches ? "auto" : "smooth";
    window.scrollTo({ top: top, behavior: behavior });
  }

  function initSmoothScrollLinks() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute("href");
      if (!href || href === "#") return;
      var id = href.slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var sectionMatch = id.match(/^section-(\d+)$/);
      if (sectionMatch && document.documentElement.classList.contains("is-mobile-ux")) {
        goToLesson(sectionMatch[1]);
      } else {
        smoothScrollTo(target);
      }
      if (link.classList.contains("toc-link")) closeMobileNav();
    });
  }

  /* --- Mobile nav --- */
  var menuBtn = document.getElementById("menu-btn");
  var sidebar = document.getElementById("sidebar-nav");
  var overlay = document.getElementById("nav-overlay");

  function openMobileNav() {
    if (!MOBILE_MQ.matches) return;
    sidebar.classList.add("is-open");
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    menuBtn.setAttribute("aria-expanded", "true");
  }

  function closeMobileNav() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    menuBtn.setAttribute("aria-expanded", "false");
  }

  function initMobileNav() {
    if (!menuBtn || !sidebar) return;
    menuBtn.addEventListener("click", function () {
      if (sidebar.classList.contains("is-open")) closeMobileNav();
      else openMobileNav();
    });
    overlay.addEventListener("click", closeMobileNav);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sidebar.classList.contains("is-open")) {
        closeMobileNav();
        menuBtn.focus();
      }
    });
    MOBILE_MQ.addEventListener("change", function (e) {
      if (!e.matches) closeMobileNav();
    });
  }

  /* --- TOC accordion --- */
  function setChapterOpen(chapter, open) {
    if (!chapter) return;
    var btn = chapter.querySelector(".toc-chapter__toggle");
    var panel = chapter.querySelector(".toc-chapter__links");
    if (!btn || !panel) return;
    chapter.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      panel.removeAttribute("hidden");
    } else {
      panel.setAttribute("hidden", "");
    }
  }

  function openChapterForSection(sectionId) {
    var card = document.querySelector('.lesson-card[data-section="' + sectionId + '"]');
    if (!card) return;
    var slug = card.getAttribute("data-chapter");
    var chapter = document.querySelector('.toc-chapter[data-chapter="' + slug + '"]');
    if (!chapter) return;
    document.querySelectorAll(".toc-chapter").forEach(function (ch) {
      if (ch !== chapter && !document.getElementById("toc-search").value.trim()) {
        setChapterOpen(ch, false);
      }
    });
    setChapterOpen(chapter, true);
  }

  function initTocAccordion() {
    document.querySelectorAll(".toc-chapter__toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var chapter = btn.closest(".toc-chapter");
        var isOpen = chapter.classList.contains("is-open");
        document.querySelectorAll(".toc-chapter").forEach(function (ch) {
          setChapterOpen(ch, false);
        });
        if (!isOpen) setChapterOpen(chapter, true);
      });
    });
    openChapterForSection("1");
  }

  /* --- TOC search --- */
  function initTocSearch() {
    var input = document.getElementById("toc-search");
    if (!input) return;
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      document.querySelectorAll(".toc-chapter").forEach(function (chapter) {
        var visible = 0;
        chapter.querySelectorAll(".toc-link").forEach(function (link) {
          var text = link.textContent.toLowerCase();
          var match = !q || text.indexOf(q) !== -1;
          link.classList.toggle("hidden", !match);
          if (match) visible++;
        });
        chapter.classList.toggle("is-empty", visible === 0);
        if (q && visible > 0) {
          setChapterOpen(chapter, true);
        } else if (!q) {
          var sid = currentSectionId;
          var activeCard = document.querySelector('.lesson-card[data-section="' + sid + '"]');
          var activeSlug = activeCard ? activeCard.getAttribute("data-chapter") : "day-1";
          setChapterOpen(chapter, chapter.getAttribute("data-chapter") === activeSlug);
        }
      });
    });
  }

  /* --- Scroll spy --- */
  function initScrollSpy() {
    var sections = document.querySelectorAll(".lesson-card[data-section]");
    var links = document.querySelectorAll(".toc-link[data-section]");
    if (!sections.length) return;

    var ratios = new Map();

    function updateActive() {
      var best = null;
      var bestRatio = 0;
      ratios.forEach(function (ratio, el) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = el;
        }
      });
      if (!best) return;
      var sid = best.getAttribute("data-section");
      currentSectionId = sid;
      links.forEach(function (l) {
        l.classList.toggle("is-active", l.getAttribute("data-section") === sid);
      });
      var searchInput = document.getElementById("toc-search");
      if (!searchInput || !searchInput.value.trim()) {
        openChapterForSection(sid);
      }
      updateMobileBar(sid);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            ratios.set(entry.target, entry.intersectionRatio);
          } else {
            ratios.set(entry.target, 0);
          }
        });
        updateActive();
      },
      {
        rootMargin: "-15% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  /* --- Reading progress + back to top --- */
  function initScrollHandlers() {
    var fill = document.getElementById("reading-progress-fill");
    var backBtn = document.getElementById("back-to-top");
    var ticking = false;

    function update() {
      ticking = false;
      var doc = document.documentElement;
      var scrollMax = doc.scrollHeight - window.innerHeight;
      var pct = scrollMax > 0 ? (window.scrollY / scrollMax) * 100 : 0;
      pct = Math.min(100, Math.max(0, pct));
      if (fill) fill.style.width = pct + "%";
      if (backBtn) backBtn.classList.toggle("is-visible", window.scrollY > 500);
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );

    if (backBtn) {
      backBtn.addEventListener("click", function () {
        var top = document.getElementById("top");
        if (top) {
          var behavior = REDUCED_MOTION.matches ? "auto" : "smooth";
          window.scrollTo({ top: 0, behavior: behavior });
        }
      });
    }

    update();
  }

  /* --- Text to speech --- */
  function initTextToSpeech() {
    if (!("speechSynthesis" in window)) return;

    var dock = document.getElementById("tts-dock");
    var statusEl = document.getElementById("tts-status");
    var btnHere = document.getElementById("tts-listen-here");
    var btnAll = document.getElementById("tts-listen-all");
    var btnPause = document.getElementById("tts-pause");
    var btnStop = document.getElementById("tts-stop");

    dock.hidden = false;

    var state = "idle";
    var queue = [];
    var queueIndex = 0;
    var chunkIndex = 0;
    var chunks = [];
    var currentCard = null;
    var wordSpans = [];
    var chunkWordStarts = [];
    var spokenWordCount = 0;
    var lastHighlightIndex = -1;
    var lastBoundaryAt = 0;
    var highlightLagTimer = null;
    var paceBackstopTimer = null;
    var chunkSpeakStartedAt = 0;
    var selectedVoice = null;
    var HIGHLIGHT_LAG_MS = 420;
    var PACE_BACKSTOP_MS = 680;
    var SPEECH_CHARS_PER_SEC = 9.5;

    function pickVoice() {
      var voices = speechSynthesis.getVoices();
      var enLocal = voices.find(function (v) {
        return v.lang && v.lang.indexOf("en") === 0 && v.localService;
      });
      if (enLocal) return enLocal;
      var enUs = voices.find(function (v) {
        return v.lang && v.lang.indexOf("en-US") === 0;
      });
      if (enUs) return enUs;
      return voices.find(function (v) {
        return v.lang && v.lang.indexOf("en") === 0;
      });
    }

    speechSynthesis.addEventListener("voiceschanged", function () {
      selectedVoice = pickVoice();
    });
    selectedVoice = pickVoice();

    function setUiState(s) {
      state = s;
      var playing = s === "playing" || s === "paused";
      btnHere.disabled = playing;
      btnAll.disabled = playing;
      btnPause.disabled = !playing;
      btnStop.disabled = !playing;
      setPauseIcon(s === "paused");
    }

    function getSectionsOrdered() {
      return Array.prototype.slice.call(
        document.querySelectorAll(".lesson-card[data-section]")
      );
    }

    function getBodyPlainText(card) {
      var clone = card.querySelector(".lesson-card__body");
      if (!clone) return "";
      clone = clone.cloneNode(true);
      clone.querySelectorAll("svg, button, .lesson-card__icon, [hidden]").forEach(function (n) {
        n.remove();
      });
      return (clone.innerText || clone.textContent || "").replace(/\s+/g, " ").trim();
    }

    function extractSectionText(card) {
      var num = card.getAttribute("data-section");
      var titleEl = card.querySelector(".lesson-card__title");
      var title = titleEl ? titleEl.textContent.trim() : "";
      var prefix = "Lesson " + num + ". ";
      var body = getBodyPlainText(card);
      return (prefix + title + ". " + body).replace(/\s+/g, " ").trim();
    }

    function countWords(text) {
      var m = text.match(/\S+/g);
      return m ? m.length : 0;
    }

    function charIndexToWordIndex(text, charIndex) {
      var slice = text.slice(0, Math.max(0, charIndex));
      return Math.max(0, countWords(slice) - 1);
    }

    function maxIndexFromElapsed(chunkText, chunkStart, elapsedMs) {
      var words = countWords(chunkText);
      if (!words) return chunkStart;
      var duration = (chunkText.length / SPEECH_CHARS_PER_SEC) * 1000;
      var progress = Math.min(1, elapsedMs / Math.max(duration, 1));
      return chunkStart + Math.floor(progress * words);
    }

    function capHighlightIndex(requested, chunkText, chunkStart) {
      var elapsed = performance.now() - chunkSpeakStartedAt;
      var timeCap = maxIndexFromElapsed(chunkText, chunkStart, elapsed);
      return Math.min(requested, timeCap);
    }

    function buildChunkWordStarts(chunks) {
      var starts = [];
      var offset = 0;
      chunks.forEach(function (chunk) {
        starts.push(offset);
        offset += countWords(chunk);
      });
      return starts;
    }

    function splitChunks(text, maxLen) {
      maxLen = maxLen || 300;
      var result = [];
      var sentences = text.match(/[^.!?]+[.!?]+|\S+/g) || [text];
      var buf = "";
      sentences.forEach(function (sent) {
        sent = sent.trim();
        if (!sent) return;
        if ((buf + " " + sent).trim().length <= maxLen) {
          buf = (buf + " " + sent).trim();
        } else {
          if (buf) result.push(buf);
          if (sent.length <= maxLen) buf = sent;
          else {
            for (var i = 0; i < sent.length; i += maxLen) {
              result.push(sent.slice(i, i + maxLen));
            }
            buf = "";
          }
        }
      });
      if (buf) result.push(buf);
      return result.length ? result : [text];
    }

    function appendWordSpans(container, text) {
      var parts = text.split(/(\s+)/);
      parts.forEach(function (part) {
        if (/^\s+$/.test(part)) {
          container.appendChild(document.createTextNode(part));
        } else if (part) {
          var span = document.createElement("span");
          span.className = "tts-word";
          span.textContent = part;
          wordSpans.push(span);
          container.appendChild(span);
        }
      });
    }

    function wrapTextNodesInElement(el) {
      if (!el) return;
      function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          var text = node.textContent;
          if (!text.trim()) return;
          var frag = document.createDocumentFragment();
          var parts = text.split(/(\s+)/);
          parts.forEach(function (part) {
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else if (part) {
              var span = document.createElement("span");
              span.className = "tts-word";
              span.textContent = part;
              wordSpans.push(span);
              frag.appendChild(span);
            }
          });
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          var tag = node.tagName.toLowerCase();
          if (tag === "script" || tag === "style") return;
          if (
            node.classList &&
            (node.classList.contains("tts-word") ||
              node.classList.contains("tts-intro") ||
              node.classList.contains("tts-bridge"))
          ) {
            return;
          }
          Array.prototype.slice.call(node.childNodes).forEach(walk);
        }
      }
      Array.prototype.slice.call(el.childNodes).forEach(walk);
    }

    function unwrapWordsInCard(card) {
      if (!card) return;
      card.querySelectorAll(".tts-word").forEach(function (span) {
        var parent = span.parentNode;
        if (!parent) return;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize();
      });
      card.querySelectorAll(".tts-intro, .tts-bridge").forEach(function (el) {
        el.remove();
      });
      wordSpans = [];
    }

    function wrapWordsInCard(card) {
      unwrapWordsInCard(card);
      var num = card.getAttribute("data-section");
      var inner = card.querySelector(".lesson-card__inner");
      var header = card.querySelector(".lesson-card__header");
      var titleEl = card.querySelector(".lesson-card__title");
      var bodyEl = card.querySelector(".lesson-card__body");
      if (!inner || !header) return;

      wordSpans = [];

      if (titleEl) {
        var intro = document.createElement("span");
        intro.className = "tts-intro";
        titleEl.insertBefore(intro, titleEl.firstChild);
        appendWordSpans(intro, "Lesson " + num + ". ");
        wrapTextNodesInElement(titleEl);
        var bridge = document.createElement("span");
        bridge.className = "tts-bridge";
        titleEl.appendChild(bridge);
        appendWordSpans(bridge, ". ");
      }

      wrapTextNodesInElement(bodyEl);
      spokenWordCount = countWords(extractSectionText(card));
    }

    function clearHighlightTimers() {
      clearTimeout(highlightLagTimer);
      clearTimeout(paceBackstopTimer);
    }

    function scheduleHighlight(index, chunkText, chunkStart) {
      clearTimeout(highlightLagTimer);
      highlightLagTimer = setTimeout(function () {
        if (state !== "playing") return;
        var capped = capHighlightIndex(index, chunkText, chunkStart);
        if (capped > lastHighlightIndex) {
          lastHighlightIndex = capped;
          highlightWord(capped);
        }
      }, HIGHLIGHT_LAG_MS);
    }

    function resetPaceBackstop(chunkText, chunkStart) {
      clearTimeout(paceBackstopTimer);
      function tick() {
        if (state !== "playing") return;
        var chunkEnd = chunkStart + countWords(chunkText) - 1;
        var idle = Date.now() - lastBoundaryAt;
        if (idle < PACE_BACKSTOP_MS) {
          paceBackstopTimer = setTimeout(tick, PACE_BACKSTOP_MS - idle + 40);
          return;
        }
        if (lastHighlightIndex < chunkEnd) {
          var next = capHighlightIndex(lastHighlightIndex + 1, chunkText, chunkStart);
          if (next > lastHighlightIndex) {
            lastHighlightIndex = next;
            scheduleHighlight(lastHighlightIndex, chunkText, chunkStart);
          }
        }
        if (lastHighlightIndex < chunkEnd) {
          paceBackstopTimer = setTimeout(tick, PACE_BACKSTOP_MS);
        }
      }
      paceBackstopTimer = setTimeout(tick, PACE_BACKSTOP_MS);
    }

    function advanceFromBoundary(chunkText, chunkStart, charIndex) {
      var localWi = charIndexToWordIndex(chunkText, charIndex);
      var globalWi = chunkStart + localWi;
      var maxIndex = Math.min(
        wordSpans.length - 1,
        spokenWordCount ? spokenWordCount - 1 : wordSpans.length - 1
      );
      globalWi = Math.min(globalWi, maxIndex);
      var target = Math.min(globalWi, lastHighlightIndex + 1);
      target = Math.max(chunkStart, target);
      if (target > lastHighlightIndex) {
        lastBoundaryAt = Date.now();
        scheduleHighlight(target, chunkText, chunkStart);
      }
    }

    function highlightWord(index) {
      if (!wordSpans.length) return;
      index = Math.max(0, Math.min(index, wordSpans.length - 1));
      wordSpans.forEach(function (span, i) {
        span.classList.toggle("is-read", i <= index);
        span.classList.toggle("is-active", i === index);
      });
      var active = wordSpans[index];
      if (active) {
        var rect = active.getBoundingClientRect();
        if (rect.top < 80 || rect.bottom > window.innerHeight - 120) {
          active.scrollIntoView({ block: "nearest", behavior: REDUCED_MOTION.matches ? "auto" : "smooth" });
        }
      }
    }

    function clearSpeakingCard() {
      if (currentCard) currentCard.classList.remove("is-speaking");
      document.querySelectorAll(".lesson-card.is-speaking").forEach(function (c) {
        c.classList.remove("is-speaking");
      });
    }

    function setSpeakingCard(card) {
      clearSpeakingCard();
      currentCard = card;
      if (card) {
        if (document.documentElement.classList.contains("is-mobile-ux")) {
          var sid = card.getAttribute("data-section");
          document.querySelectorAll(".lesson-card.is-collapsible").forEach(function (c) {
            var on = c.getAttribute("data-section") === sid;
            c.classList.toggle("is-expanded", on);
            var b = c.querySelector(".lesson-card__toggle");
            if (b) b.setAttribute("aria-expanded", on ? "true" : "false");
          });
        }
        card.classList.add("is-speaking");
        wrapWordsInCard(card);
        var num = card.getAttribute("data-section");
        var title = card.querySelector(".lesson-card__title");
        var t = title ? title.textContent.trim() : "";
        if (t.length > 36) t = t.slice(0, 33) + "…";
        statusEl.textContent = "Lesson " + num + ": " + t;
        if (!REDUCED_MOTION.matches) {
          card.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }

    function speakNext() {
      if (state === "paused") return;
      clearHighlightTimers();
      if (currentCard) unwrapWordsInCard(currentCard);

      if (queueIndex >= queue.length) {
        cleanup();
        statusEl.textContent = "Finished";
        return;
      }

      var item = queue[queueIndex];
      setSpeakingCard(item.card);
      chunks = splitChunks(item.text);
      chunkWordStarts = buildChunkWordStarts(chunks);
      chunkIndex = 0;
      speakChunk();
    }

    function speakChunk() {
      if (state !== "playing") return;
      if (chunkIndex >= chunks.length) {
        queueIndex++;
        speakNext();
        return;
      }

      var chunkText = chunks[chunkIndex];
      var chunkStart = chunkWordStarts[chunkIndex] || 0;
      lastHighlightIndex = chunkStart - 1;
      lastBoundaryAt = Date.now();

      var utter = new SpeechSynthesisUtterance(chunkText);
      if (selectedVoice) utter.voice = selectedVoice;
      utter.rate = 1;
      utter.lang = "en-US";

      utter.onstart = function () {
        chunkSpeakStartedAt = performance.now();
        resetPaceBackstop(chunkText, chunkStart);
      };

      utter.onboundary = function (ev) {
        if (ev.name && ev.name !== "word") return;
        advanceFromBoundary(chunkText, chunkStart, ev.charIndex);
      };

      utter.onend = function () {
        clearHighlightTimers();
        var endIndex = chunkStart + countWords(chunkText) - 1;
        if (endIndex >= 0) {
          lastHighlightIndex = Math.min(endIndex, wordSpans.length - 1);
          highlightWord(lastHighlightIndex);
        }
        chunkIndex++;
        speakChunk();
      };

      utter.onerror = function () {
        clearHighlightTimers();
        chunkIndex++;
        speakChunk();
      };

      speechSynthesis.speak(utter);
    }

    function buildQueue(fromSectionId, all) {
      var sections = getSectionsOrdered();
      var startIdx = 0;
      if (!all) {
        startIdx = sections.findIndex(function (s) {
          return s.getAttribute("data-section") === String(fromSectionId);
        });
        if (startIdx < 0) startIdx = 0;
      }
      var list = [];
      for (var i = startIdx; i < sections.length; i++) {
        list.push({ card: sections[i], text: extractSectionText(sections[i]) });
      }
      return list;
    }

    function cleanup() {
      speechSynthesis.cancel();
      clearHighlightTimers();
      lastHighlightIndex = -1;
      if (currentCard) unwrapWordsInCard(currentCard);
      clearSpeakingCard();
      currentCard = null;
      queue = [];
      queueIndex = 0;
      setUiState("idle");
      statusEl.textContent = "Ready";
    }

    function startListen(all) {
      cleanup();
      queue = buildQueue(currentSectionId, all);
      if (!queue.length) return;
      queueIndex = 0;
      setUiState("playing");
      statusEl.textContent = "Playing…";
      speakNext();
    }

    btnHere.addEventListener("click", function () {
      startListen(false);
    });
    btnAll.addEventListener("click", function () {
      startListen(true);
    });

    btnPause.addEventListener("click", function () {
      if (state === "playing") {
        speechSynthesis.cancel();
        state = "paused";
        setUiState("paused");
        statusEl.textContent = "Paused";
      } else if (state === "paused") {
        state = "playing";
        setUiState("playing");
        statusEl.textContent = "Playing…";
        speakChunk();
      }
    });

    btnStop.addEventListener("click", cleanup);

    window.addEventListener("beforeunload", cleanup);
  }

  /* --- Mobile UX: collapsible lessons, bottom bar, compact mission --- */
  var mobileBarInited = false;

  function updateMobileBar(sectionId) {
    if (!MOBILE_MQ.matches) return;
    var label = document.getElementById("mobile-bar-label");
    var prevBtn = document.getElementById("mobile-bar-prev");
    var nextBtn = document.getElementById("mobile-bar-next");
    var cards = document.querySelectorAll(".lesson-card[data-section]");
    var n = parseInt(sectionId, 10);
    var card = document.querySelector('.lesson-card[data-section="' + sectionId + '"]');
    var titleEl = card ? card.querySelector(".lesson-card__title") : null;
    var title = titleEl ? titleEl.textContent.trim() : "";
    if (title.length > 28) title = title.slice(0, 25) + "\u2026";
    if (label) {
      label.textContent = title ? "Lesson " + n + " \u00b7 " + title : "Lesson " + n;
    }
    if (prevBtn) prevBtn.disabled = n <= 1;
    if (nextBtn) nextBtn.disabled = n >= cards.length;
  }

  function collapseAllLessonsExcept(sectionId) {
    document.querySelectorAll(".lesson-card.is-collapsible").forEach(function (card) {
      var on = card.getAttribute("data-section") === String(sectionId);
      card.classList.toggle("is-expanded", on);
      var btn = card.querySelector(".lesson-card__toggle");
      if (btn) btn.setAttribute("aria-expanded", on ? "true" : "false");
    });
  }

  function expandAllLessonsDesktop() {
    document.querySelectorAll(".lesson-card").forEach(function (card) {
      card.classList.add("is-expanded");
      card.classList.remove("is-collapsible");
    });
  }

  function goToLesson(sectionId) {
    currentSectionId = String(sectionId);
    if (document.documentElement.classList.contains("is-mobile-ux")) {
      collapseAllLessonsExcept(sectionId);
    }
    var el = document.getElementById("section-" + sectionId);
    if (el) smoothScrollTo(el);
    updateMobileBar(sectionId);
    document.querySelectorAll(".toc-link").forEach(function (l) {
      l.classList.toggle("is-active", l.getAttribute("data-section") === String(sectionId));
    });
  }

  function wrapLessonCard(card) {
    if (card.dataset.mobileWrap === "1") return;
    var inner = card.querySelector(".lesson-card__inner");
    var header = inner && inner.querySelector(".lesson-card__header");
    var body = inner && inner.querySelector(".lesson-card__body");
    if (!inner || !header || !body) return;

    var sectionId = card.getAttribute("data-section");
    body.id = "lesson-body-" + sectionId;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lesson-card__toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", body.id);

    var marker = card.querySelector(".lesson-card__marker");
    if (marker && marker.parentNode === card) {
      btn.appendChild(marker);
    }

    header.parentNode.insertBefore(btn, header);
    btn.appendChild(header);

    var chevron = document.createElement("i");
    chevron.setAttribute("data-lucide", "chevron-down");
    chevron.className = "lesson-card__chevron";
    chevron.setAttribute("aria-hidden", "true");
    btn.appendChild(chevron);

    btn.addEventListener("click", function () {
      var willExpand = !card.classList.contains("is-expanded");
      if (willExpand) {
        collapseAllLessonsExcept(sectionId);
      } else {
        card.classList.remove("is-expanded");
        btn.setAttribute("aria-expanded", "false");
      }
    });

    card.classList.add("is-collapsible");
    card.dataset.mobileWrap = "1";
  }

  function unwrapLessonCard(card) {
    if (card.dataset.mobileWrap !== "1") return;
    var btn = card.querySelector(".lesson-card__toggle");
    var inner = card.querySelector(".lesson-card__inner");
    var body = inner && inner.querySelector(".lesson-card__body");
    if (!btn || !inner) return;

    var header = btn.querySelector(".lesson-card__header");
    var marker = btn.querySelector(".lesson-card__marker");
    var chevron = btn.querySelector(".lesson-card__chevron");

    if (header) {
      inner.insertBefore(header, body);
    }
    if (marker) {
      card.insertBefore(marker, inner);
    }
    btn.remove();
    if (chevron) chevron.remove();

    card.classList.remove("is-collapsible", "is-expanded");
    delete card.dataset.mobileWrap;
    if (body) body.removeAttribute("id");
  }

  function applyMobileLayout(isMobile) {
    document.documentElement.classList.toggle("is-mobile-ux", isMobile);
    var bar = document.getElementById("mobile-lesson-bar");
    if (bar) {
      bar.classList.toggle("is-active", isMobile);
      bar.hidden = !isMobile;
    }

    if (isMobile) {
      document.querySelectorAll(".lesson-card").forEach(wrapLessonCard);
      document.querySelectorAll(".lesson-card.is-collapsible").forEach(function (card) {
        card.classList.remove("is-expanded");
        var btn = card.querySelector(".lesson-card__toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
      initIcons();
    } else {
      document.querySelectorAll(".lesson-card").forEach(unwrapLessonCard);
      expandAllLessonsDesktop();
    }
    updateMobileBar(currentSectionId);
  }

  function initMissionMobileToggle() {
    var toggle = document.getElementById("mission-toggle");
    var inner = toggle && toggle.closest(".course-mission__inner");
    if (!toggle || !inner || toggle.dataset.inited === "1") return;
    toggle.dataset.inited = "1";

    toggle.addEventListener("click", function () {
      if (!MOBILE_MQ.matches) return;
      var open = inner.classList.toggle("is-mission-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initMobileLessonBar() {
    if (mobileBarInited) return;
    mobileBarInited = true;

    var menuBtn = document.getElementById("mobile-bar-menu");
    var prevBtn = document.getElementById("mobile-bar-prev");
    var nextBtn = document.getElementById("mobile-bar-next");

    if (menuBtn) {
      menuBtn.addEventListener("click", openMobileNav);
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        var n = parseInt(currentSectionId, 10);
        if (n > 1) goToLesson(n - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var n = parseInt(currentSectionId, 10);
        var total = document.querySelectorAll(".lesson-card[data-section]").length;
        if (n < total) goToLesson(n + 1);
      });
    }
  }

  function initMobileUx() {
    initMissionMobileToggle();
    initMobileLessonBar();
    applyMobileLayout(MOBILE_MQ.matches);

    MOBILE_MQ.addEventListener("change", function (e) {
      applyMobileLayout(e.matches);
      if (!e.matches) closeMobileNav();
    });

    var hash = window.location.hash;
    if (hash && /^#section-\d+$/.test(hash) && MOBILE_MQ.matches) {
      var id = hash.replace("#section-", "");
      goToLesson(id);
    }
  }

  /* --- Boot --- */
  function boot() {
    initIcons();
    initHeroReadyClass();
    initHeroLayerGlows();
    initHeroTraining();
    initReveals();
    initWorkflowAnimation();
    initSmoothScrollLinks();
    initMobileNav();
    initTocAccordion();
    initTocSearch();
    initScrollSpy();
    initScrollHandlers();
    initTextToSpeech();
    initMobileUx();
    scrollOffsetMobile = getScrollOffset();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
