# 100 Days of Machine Learning

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-ready-0d9488?style=flat-square)](https://pages.github.com/)
[![HTML5](https://img.shields.io/badge/HTML5-static-7c3aed?style=flat-square)](index.html)

> A free community course: **ML foundations, then Gen AI apps**. One new topic every day for 100 days.

**Live site:** [https://bishalranjitkar.tech/100-days-machine-learning/](https://bishalranjitkar.tech/100-days-machine-learning/)

---

## About this series

This repository powers the public course site for **“100 Days of Machine Learning.”**

The goal is **not** another algorithm catalog. **Days 1 to 19** teach the ML life cycle, data skills, and problem framing. **From Day 20** the series continues into generative AI and LangChain, so you can ship apps with existing models.

**Who it’s for:** beginners and intermediate learners who want to become **proficient** with data, decisions, and LLM apps.

**What you’ll learn (live path):**

| Topic | Focus |
|--------|--------|
| ML life cycle | Frame problems and think end to end |
| Data skills | CSV, JSON, APIs, web data, NumPy, Pandas |
| Problem framing | Turn a business goal into a clear task |
| Gen AI map | Foundation models, user vs builder |
| LangChain apps | Models, prompts, structured output |
| Next days | More shipping skills, published day by day |

**What we skip (on purpose):** deep dives on every classic algorithm. Those belong in dedicated resources. Here the emphasis is how the pieces **connect**.

---

## Progress

| Status | Detail |
|--------|--------|
| Series length | 100 days |
| Published | **Day 25** (255 lessons, incl. bonus NumPy and Pandas) |
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
| 9 | ML Life Cycle (MDLC) | 54–63 |
| 10 | Data Roles | 64–69 |
| 11 | Tensors | 70–76 |
| 12 | Anaconda Setup | 77–80 |
| — | **Bonus: Learning NumPy** (before Day 13) | 81–95 |
| — | **Bonus: Learning Pandas** (after NumPy, before Day 13) | 96–131 |
| 13 | End to End Project | 132–138 |
| 14 | Framing ML Problems | 139–147 |
| 15 | Working with CSV | 148–156 |
| 16 | Working with JSON and SQL | 157–160 |
| 17 | Fetching Data from an API | 161–163 |
| 18 | Fetching Data from the Web | 164–170 |
| 19 | Understanding Your Data | 171–178 |
| 20 | Gen AI for Beginners (Phase 2 starts) | 179–193 |
| 21 | Gen AI with LangChain | 194–205 |
| 22 | LangChain Components | 206–214 |
| 23 | LangChain Models | 215–230 |
| 24 | Prompts in LangChain | 231–241 |
| 25 | Structured Output | 242–255 |

Bonus chapters in `days/numpy` and `days/pandas` extend topics without advancing the 100 day count. New numbered days land in `days/dayN`.

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
