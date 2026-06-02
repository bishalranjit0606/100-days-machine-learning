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
      smoothScrollTo(target);
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
    var boundaryTimer = null;
    var wordSpans = [];
    var selectedVoice = null;

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

    function extractSectionText(card) {
      var num = card.getAttribute("data-section");
      var titleEl = card.querySelector(".lesson-card__title");
      var title = titleEl ? titleEl.textContent.trim() : "";
      var prefix = "Lesson " + num + ". " + title + ". ";

      var clone = card.querySelector(".lesson-card__body");
      if (!clone) return prefix;
      clone = clone.cloneNode(true);
      clone.querySelectorAll("svg, button, .lesson-card__icon, [hidden]").forEach(function (n) {
        n.remove();
      });
      var body = (clone.innerText || clone.textContent || "")
        .replace(/\s+/g, " ")
        .trim();
      return prefix + body;
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

    function unwrapWords() {
      wordSpans.forEach(function (span) {
        var parent = span.parentNode;
        if (!parent) return;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize();
      });
      wordSpans = [];
    }

    function wrapWordsInBody(card) {
      unwrapWords();
      var body = card.querySelector(".lesson-card__body");
      if (!body) return;

      function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          var text = node.textContent;
          if (!text.trim()) return;
          var parts = text.split(/(\s+)/);
          var frag = document.createDocumentFragment();
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
          Array.prototype.slice.call(node.childNodes).forEach(walk);
        }
      }

      Array.prototype.slice.call(body.childNodes).forEach(walk);
    }

    function highlightWord(index) {
      wordSpans.forEach(function (span, i) {
        span.classList.toggle("is-active", i === index);
        span.classList.toggle("is-read", i < index);
      });
      var active = wordSpans[index];
      if (active) {
        var rect = active.getBoundingClientRect();
        if (rect.top < 80 || rect.bottom > window.innerHeight - 120) {
          active.scrollIntoView({ block: "nearest", behavior: REDUCED_MOTION.matches ? "auto" : "smooth" });
        }
      }
    }

    var wordIndex = 0;
    var fallbackInterval = null;

    function startFallbackHighlight(durationMs) {
      clearInterval(fallbackInterval);
      if (!wordSpans.length) return;
      var msPerWord = Math.max(80, durationMs / wordSpans.length);
      wordIndex = 0;
      fallbackInterval = setInterval(function () {
        if (state !== "playing") return;
        highlightWord(wordIndex);
        wordIndex++;
        if (wordIndex >= wordSpans.length) clearInterval(fallbackInterval);
      }, msPerWord);
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
        card.classList.add("is-speaking");
        wrapWordsInBody(card);
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
      clearInterval(fallbackInterval);
      clearTimeout(boundaryTimer);
      unwrapWords();

      if (queueIndex >= queue.length) {
        cleanup();
        statusEl.textContent = "Finished";
        return;
      }

      var item = queue[queueIndex];
      setSpeakingCard(item.card);
      chunks = splitChunks(item.text);
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

      var utter = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      if (selectedVoice) utter.voice = selectedVoice;
      utter.rate = 1;
      utter.lang = "en-US";

      var gotBoundary = false;
      var boundaryFallback = setTimeout(function () {
        if (!gotBoundary && wordSpans.length) {
          startFallbackHighlight(Math.max(3000, chunks[chunkIndex].length * 55));
        }
      }, 1000);

      utter.onboundary = function (ev) {
        if (ev.name === "word" || ev.charIndex >= 0) {
          gotBoundary = true;
          clearTimeout(boundaryFallback);
          var ratio = ev.charIndex / Math.max(1, chunks[chunkIndex].length);
          var wi = Math.floor(ratio * wordSpans.length);
          highlightWord(Math.min(wi, wordSpans.length - 1));
        }
      };

      utter.onend = function () {
        clearTimeout(boundaryFallback);
        clearInterval(fallbackInterval);
        chunkIndex++;
        speakChunk();
      };

      utter.onerror = function () {
        clearTimeout(boundaryFallback);
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
      clearInterval(fallbackInterval);
      clearTimeout(boundaryTimer);
      unwrapWords();
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
        speakNext();
      }
    });

    btnStop.addEventListener("click", cleanup);

    window.addEventListener("beforeunload", cleanup);
  }

  /* --- Boot --- */
  function boot() {
    initIcons();
    initHeroReadyClass();
    initReveals();
    initWorkflowAnimation();
    initSmoothScrollLinks();
    initMobileNav();
    initTocAccordion();
    initTocSearch();
    initScrollSpy();
    initScrollHandlers();
    initTextToSpeech();
    scrollOffsetMobile = getScrollOffset();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
