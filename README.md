# 100 Days of Machine Learning

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-ready-0d9488?style=flat-square)](https://pages.github.com/)
[![HTML5](https://img.shields.io/badge/HTML5-static-7c3aed?style=flat-square)](index.html)

> A free, community-focused course on the **full Machine Learning life cycle** — one new lesson every day for 100 days.

**Live site:** [https://bishalranjitkar.tech/100-days-machine-learning/](https://bishalranjitkar.tech/100-days-machine-learning/)

---

## About this series

This repository powers the public course site for **“100 Days of Machine Learning.”**

The goal is **not** another algorithm catalog. Plenty of resources already explain individual models in depth. This series teaches the **end-to-end ML life cycle** (also called the product life cycle): how real projects move from problem to deployed insight.

**Who it’s for:** beginners and intermediate learners who want to become **proficient** — comfortable with data, modeling decisions, and trade-offs.

**What you’ll learn over 100 days:**

| Topic | Focus |
|--------|--------|
| Data preprocessing | Clean and prepare data before modeling |
| Imputation | Handle missing values thoughtfully |
| Data analysis | Explore patterns before you train |
| Model selection | Pick the right approach for the problem |
| Feature selection | Use inputs that actually matter |
| Bias–variance trade-off | Balance fit and generalization |

**What we skip (on purpose):** deep dives on specific algorithms — those belong in dedicated resources. Here, the emphasis is how everything **connects**.

---

## Progress

| Status | Detail |
|--------|--------|
| Series length | 100 days |
| Published | **Day 8** (53 lessons) |
| Format | Static site + notes in `days/` |

| Day | Topic | Lessons |
|-----|--------|---------|
| 1 | Introduction to ML | 1–6 |
| 2 | AI vs ML vs Deep Learning | 7–10 |
| 3 | Types of Machine Learning | 11–18 |
| 4 | Batch Machine Learning | 19–23 |
| 5 | Online Machine Learning | 24–31 |
| 6 | Instance vs Model Based | 32–37 |
| 7 | Challenges of ML | 38–47 |
| 8 | Applications of ML | 48–53 |

New days are added as notes land in `days/day9`, …

---

## Features

- **Readable course layout** — chapter cards and full-width lesson cards
- **Mobile UX** — collapsible lessons (tap to expand), bottom prev/next bar, compact “About” section
- **Right sidebar** — collapsible days, lesson search, scroll-spy highlighting
- **Mission section** — explains why the series exists
- **Accessibility** — landmarks, keyboard nav, reduced-motion support
- **Listen mode** — Web Speech API (Chrome / Edge recommended)
- **No build step** — plain HTML, CSS, and JavaScript

---

## Quick start

### Run locally

Static site only (HTML, CSS, JS). No build step on the server.

**Option A — local server (recommended for development)**

```bash
cd /path/to/ml
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

**Option B — open `index.html` directly**

Brave and Chrome often block `styles.css` on `file://` URLs. This repo embeds a copy of `styles.css` inside `index.html` so double click still works.

After you edit `styles.css`, run:

```bash
./embed-css.sh
```

**Live site:** [https://bishalranjitkar.tech/100-days-machine-learning/](https://bishalranjitkar.tech/100-days-machine-learning/)

### Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Source: **Deploy from branch** → `main` → `/ (root)`.
4. Save. Your site will be at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

---

## Project structure

```
.
├── index.html          # Course page (hero, mission, lessons, nav)
├── styles.css          # Design system & layout
├── script.js           # Nav, search, scroll spy, TTS
├── favicon.png         # Tab icon (brain: biological + AI)
├── days/               # Source notes (one file per day)
│   ├── day1
│   ├── day2
│   └── day3
└── README.md
```

When you add a new day:

1. Add `days/dayN` with your notes.
2. Add a chapter block and lesson articles in `index.html` (follow existing `data-chapter` / `data-section` patterns).
3. Update the sidebar TOC and hero/footer “Day N published” counters.

---

## Tech stack

- HTML5, CSS3, vanilla JavaScript (no React / no build pipeline)
- [Google Fonts](https://fonts.google.com/) — Sora, Lora, Fira Code
- [Lucide](https://lucide.dev/) icons (UMD, pinned version)

---

## Browser support

| Feature | Chrome / Edge | Firefox | Safari |
|---------|---------------|---------|--------|
| Layout & navigation | ✅ | ✅ | ✅ |
| Text-to-speech + word highlight | ✅ | Partial | Partial |

---

## Contributing

Contributions welcome — typo fixes, clearer explanations, and new `days/` content.

1. Fork the repo  
2. Create a branch (`git checkout -b day-4-notes`)  
3. Commit your changes  
4. Open a Pull Request  

Please keep lessons aligned with the **life cycle** focus rather than long algorithm derivations.

---

## Author

Built to teach the community — one day at a time.

If this helps you, consider starring the repo and sharing the series.

---

## License

Open for community learning. Add an [MIT](https://opensource.org/licenses/MIT) or [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license file when you publish if you want explicit terms.
# 100-days-machine-learning
