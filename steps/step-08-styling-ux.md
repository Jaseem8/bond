# Step 08 — Styling & UX Polish

> **Previous:** [Step 07 — API Integration](./step-07-api-integration.md) | **Next:** [Step 09 — Testing](./step-09-testing.md)

---

## 🎯 Goal

Transform the functional app into a visually impressive, premium-feeling product with:
- Dark mode design system
- Smooth animations and transitions
- Responsive layout (desktop + tablet + mobile)
- Consistent typography using Google Fonts

---

## 📚 What You'll Learn

- CSS custom properties (variables) as a design token system
- How `@keyframes` animations work
- Responsive design with CSS Grid and media queries
- Why dark mode improves perceived quality for data-heavy apps

---

## 🎨 Design System

```css
/* Paste into frontend/src/index.css — this is the design token foundation */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* Colours */
  --clr-bg:        #0d1117;
  --clr-surface:   #161b22;
  --clr-border:    #30363d;
  --clr-text:      #e6edf3;
  --clr-muted:     #8b949e;
  --clr-primary:   #58a6ff;
  --clr-premium:   #3fb950;
  --clr-discount:  #f85149;
  --clr-warning:   #d29922;

  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 0 3px rgba(88, 166, 255, 0.25);
}

body {
  font-family: var(--font-sans);
  background: var(--clr-bg);
  color: var(--clr-text);
  line-height: 1.6;
  min-height: 100vh;
}

h1, h2, h3 { font-weight: 700; line-height: 1.2; }
```

---

## 🖼 Layout CSS — `App.css`

```css
.app {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md);
}

.app-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.app-header h1 {
  font-size: var(--text-3xl);
  background: linear-gradient(135deg, var(--clr-primary), #a371f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--clr-muted);
  margin-top: var(--space-sm);
}

.app-main {
  display: grid;
  gap: var(--space-xl);
  grid-template-columns: 360px 1fr;
  align-items: start;
}

@media (max-width: 800px) {
  .app-main { grid-template-columns: 1fr; }
}
```

---

## 🃏 Form CSS — `BondForm.css`

```css
.bond-form {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  animation: fadeSlideIn 0.4s ease both;
}

.bond-form h2 { font-size: var(--text-xl); margin-bottom: var(--space-sm); }

.bond-form label {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  color: var(--clr-muted);
  font-weight: 500;
}

.bond-form input,
.bond-form select {
  background: var(--clr-bg);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  color: var(--clr-text);
  font-size: var(--text-base);
  font-family: inherit;
  padding: 0.6rem 0.8rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.bond-form input:focus,
.bond-form select:focus {
  outline: none;
  border-color: var(--clr-primary);
  box-shadow: var(--shadow-glow);
}

.bond-form button {
  background: var(--clr-primary);
  color: #0d1117;
  font-weight: 700;
  font-size: var(--text-base);
  font-family: inherit;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.75rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  margin-top: var(--space-sm);
}

.bond-form button:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
.bond-form button:disabled { opacity: 0.5; cursor: not-allowed; }

.form-error { color: var(--clr-discount); font-size: var(--text-sm); }
```

---

## 📊 Metric Cards CSS — `BondResults.css`

```css
.bond-results { animation: fadeSlideIn 0.5s ease both; }
.bond-results h2 { margin-bottom: var(--space-lg); font-size: var(--text-xl); }

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.metric-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  box-shadow: var(--shadow-card);
  transition: transform 0.2s;
}
.metric-card:hover { transform: translateY(-2px); }

.metric-label { font-size: var(--text-sm); color: var(--clr-muted); font-weight: 500; }
.metric-value { font-size: var(--text-xl); font-weight: 700; color: var(--clr-text); }

.metric-card--premium  { border-color: var(--clr-premium);  }
.metric-card--premium  .metric-value { color: var(--clr-premium); }
.metric-card--discount { border-color: var(--clr-discount); }
.metric-card--discount .metric-value { color: var(--clr-discount); }

/* Table */
.cash-flow-wrapper h3 { margin-bottom: var(--space-md); }
.table-scroll { overflow-x: auto; }

.cash-flow-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.cash-flow-table th,
.cash-flow-table td {
  padding: 0.6rem 1rem;
  text-align: right;
  border-bottom: 1px solid var(--clr-border);
}

.cash-flow-table th {
  background: var(--clr-surface);
  color: var(--clr-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
}

.cash-flow-table td:first-child,
.cash-flow-table th:first-child { text-align: left; }

.cash-flow-table tbody tr:hover { background: rgba(88, 166, 255, 0.05); }

/* Animation */
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## ✅ Review

- [ ] App looks great on mobile (≤ 400px wide)
- [ ] Form inputs glow blue on focus
- [ ] Results animate in when data arrives
- [ ] Premium row is green, Discount is red
- [ ] Table header stays sticky on scroll

---

## 🚀 Commit

```bash
git add frontend/src
git commit -m "feat(frontend): apply premium dark-mode design system with animations"
```
