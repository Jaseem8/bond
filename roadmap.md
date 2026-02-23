# Bond Yield Calculator — Project Roadmap

> **Goal:** Build a full-stack Bond Yield Calculator with a React frontend and NestJS backend, both in TypeScript.

---

## 🗺️ Steps Overview

| # | Step | Description | File |
|---|------|-------------|------|
| 1 | [Project Setup](#step-1) | Initialise monorepo, install dependencies, configure TypeScript | [step-01-project-setup.md](./steps/step-01-project-setup.md) |
| 2 | [Backend — Core Logic](#step-2) | Implement bond math utilities (YTM, current yield, cash flows) | [step-02-backend-core-logic.md](./steps/step-02-backend-core-logic.md) |
| 3 | [Backend — NestJS API](#step-3) | Create NestJS module, controller, service & DTOs | [step-03-backend-nestjs-api.md](./steps/step-03-backend-nestjs-api.md) |
| 4 | [Frontend — React Setup](#step-4) | Scaffold React app with Vite, configure ESLint/Prettier | [step-04-frontend-react-setup.md](./steps/step-04-frontend-react-setup.md) |
| 5 | [Frontend — Input Form](#step-5) | Build the bond parameter input form with validation | [step-05-frontend-input-form.md](./steps/step-05-frontend-input-form.md) |
| 6 | [Frontend — Results & Chart](#step-6) | Display computed outputs and render a cash-flow schedule table | [step-06-frontend-results-table.md](./steps/step-06-frontend-results-table.md) |
| 7 | [API Integration](#step-7) | Connect frontend to backend via HTTP (Axios/Fetch), handle errors | [step-07-api-integration.md](./steps/step-07-api-integration.md) |
| 8 | [Styling & UX Polish](#step-8) | Apply premium design — dark mode, animations, responsive layout | [step-08-styling-ux.md](./steps/step-08-styling-ux.md) |
| 9 | [Testing](#step-9) | Unit tests for math logic (Jest) and E2E smoke tests | [step-09-testing.md](./steps/step-09-testing.md) |
| 10 | [GitHub & Deployment](#step-10) | Push to GitHub, add README, optional Vercel/Railway deploy | [step-10-github-deployment.md](./steps/step-10-github-deployment.md) |

---

## 📁 Intended Folder Structure

```
bond/
├── roadmap.md
├── steps/
│   ├── step-01-project-setup.md
│   ├── step-02-backend-core-logic.md
│   ├── step-03-backend-nestjs-api.md
│   ├── step-04-frontend-react-setup.md
│   ├── step-05-frontend-input-form.md
│   ├── step-06-frontend-results-table.md
│   ├── step-07-api-integration.md
│   ├── step-08-styling-ux.md
│   ├── step-09-testing.md
│   └── step-10-github-deployment.md
├── backend/          ← NestJS app (created in Step 1)
└── frontend/         ← React + Vite app (created in Step 1)
```

---

## 🔢 Financial Concepts Quick Reference

| Term | Formula |
|------|---------|
| **Current Yield** | `Annual Coupon / Market Price × 100` |
| **YTM** | Newton-Raphson / bisection solve of bond price equation |
| **Coupon Payment** | `Face Value × Annual Rate / Frequency` |
| **Total Interest** | `Coupon Payment × Total Periods` |
| **Premium / Discount** | Market Price > Face Value → Premium; < → Discount |

---

## ✅ Evaluation Checklist

- [ ] TypeScript throughout (no `any` where avoidable)
- [ ] Clean NestJS module structure
- [ ] Validated DTOs (`class-validator`)
- [ ] React components are small and focused
- [ ] Math logic is isolated and unit-tested
- [ ] Git history tells a story (commit per step)
- [ ] README explains how to run the project
