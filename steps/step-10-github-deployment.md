# Step 10 — GitHub & Deployment

> **Previous:** [Step 09 — Testing](./step-09-testing.md) | **Next:** _(Done! 🎉)_

---

## 🎯 Goal

1. Push the code to GitHub
2. Write a professional README
3. (Optional) Deploy backend to Railway, frontend to Vercel

---

## 📚 What You'll Learn

- Good README structure (reviewers will read this first!)
- Environment variables for deployment
- How to configure CORS for a production domain

---

## 🐙 GitHub Setup

```bash
# Initialise git (if not already done)
git init
git add .
git commit -m "chore: initial commit"

# Create a new repo on GitHub (via web UI or gh CLI)
gh repo create bond-yield-calculator --public --source=. --remote=origin --push

# Or manually:
git remote add origin https://github.com/YOUR_USERNAME/bond-yield-calculator.git
git branch -M main
git push -u origin main
```

---

## 📄 README Template

Create `README.md` in the project root:

```markdown
# Bond Yield Calculator

A full-stack bond yield calculator built with **React** (Vite) + **NestJS** + **TypeScript**.

## Features

- Computes Current Yield, YTM, Total Interest Earned
- Identifies Premium / Discount bonds
- Full cash-flow schedule with payment dates
- Responsive, dark-mode UI

## Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | React 18 + Vite     |
| Backend  | NestJS              |
| Language | TypeScript          |
| Styling  | Vanilla CSS (dark)  |
| Tests    | Jest + Supertest    |

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Running Locally

```bash
# Terminal 1
cd backend && npm run start:dev   # → http://localhost:3000

# Terminal 2
cd frontend && npm run dev        # → http://localhost:5173
```

### Running Tests

```bash
cd backend && npm run test
```

## API

### `POST /bond/calculate`

**Request body:**
```json
{
  "faceValue": 1000,
  "annualCouponRate": 0.05,
  "marketPrice": 950,
  "yearsToMaturity": 10,
  "couponFrequency": 1
}
```

**Response:**
```json
{
  "currentYield": 0.052631,
  "ytm": 0.055839,
  "totalInterestEarned": 500,
  "isPremium": false,
  "isDiscount": true,
  "cashFlowSchedule": [...]
}
```

## Notes on YTM Implementation

YTM is solved numerically using the Newton-Raphson method applied to the bond
pricing equation `P = Σ C/(1+r)^t + F/(1+r)^n`.  The algorithm converges in
< 50 iterations for all typical inputs.
```

---

## 🚀 Optional Deployment

### Backend → Railway

```bash
# Install Railway CLI
npm i -g @railway/cli
railway login
cd backend
railway init
railway up
```

Set environment variables in Railway dashboard:
- `PORT=3000`
- `FRONTEND_ORIGIN=https://your-app.vercel.app`

Update `main.ts` to use `process.env.FRONTEND_ORIGIN` in `enableCors`.

### Frontend → Vercel

```bash
npm i -g vercel
cd frontend
vercel
```

Set environment variable in Vercel dashboard:
- `VITE_API_URL=https://your-backend.railway.app`

---

## ✅ Final Pre-Interview Checklist

- [ ] `git log --oneline` shows meaningful commit messages
- [ ] `npm run test` passes with no failures
- [ ] App runs from a clean `npm install` on a fresh machine
- [ ] README explains how to run everything
- [ ] You can explain **why** Newton-Raphson was used for YTM
- [ ] You can add a new feature (e.g. duration calculation) live in < 10 minutes
- [ ] CORS is configured correctly for the deployed URLs

---

## 🎤 Interview Talking Points

| Question they might ask | What to say |
|------------------------|-------------|
| Why NestJS? | Structured, testable, decorator-based — mirrors enterprise patterns |
| How does YTM work? | Present-value equation is transcendental; Newton-Raphson finds the root numerically |
| How would you add Macaulay Duration? | Add a new formula in `bond.utils.ts`, expose in DTO, render a new metric card — 10-minute change |
| What would you add next? | Interactive yield curve chart, PDF export, database persistence for saved bonds |

---

## 🏁 Done!

The Bond Yield Calculator is complete.  
Share the GitHub link and be ready to demo and modify it live.  
Good luck! 🚀
