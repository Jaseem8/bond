# Step 04 — Frontend: React + Vite Setup

> **Previous:** [Step 03 — NestJS API](./step-03-backend-nestjs-api.md) | **Next:** [Step 05 — Input Form](./step-05-frontend-input-form.md)

---

## 🎯 Goal

Set up an organised, scalable React project structure with:
- TypeScript strict mode
- ESLint + Prettier
- A shared types file matching the backend DTOs
- A basic API client (`api.ts`)

---

## 📚 What You'll Learn

- How Vite's React template is structured
- Why we keep types in a shared file
- How to configure a dev proxy so `fetch('/api/...')` goes to `localhost:3000`

---

## 📁 Target Structure

```
frontend/src/
├── api/
│   └── api.ts            ← all fetch calls in one place
├── types/
│   └── bond.types.ts     ← shared TypeScript types
├── components/
│   ├── BondForm/
│   └── BondResults/
├── App.tsx
└── main.tsx
```

---

## 💻 Code

### `src/types/bond.types.ts`
```typescript
export interface BondInputs {
  faceValue: number;
  annualCouponRate: number;   // decimal, e.g. 0.05
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: 1 | 2;
}

export interface CashFlowRow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondResults {
  currentYield: number;
  ytm: number;
  totalInterestEarned: number;
  isPremium: boolean;
  isDiscount: boolean;
  cashFlowSchedule: CashFlowRow[];
}
```

### `src/api/api.ts`
```typescript
import type { BondInputs, BondResults } from '../types/bond.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function calculateBond(inputs: BondInputs): Promise<BondResults> {
  const response = await fetch(`${BASE_URL}/bond/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message ?? 'Calculation failed');
  }

  return response.json();
}
```

### `vite.config.ts` — add a dev proxy (alternative to CORS)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/bond': 'http://localhost:3000',
    },
  },
});
```

> **Note:** If you use the proxy you can change the BASE_URL to `''` (empty string).

---

## 🏃 Install Optional Tools

```bash
cd frontend

# Nice date formatting (used in the cash flow table)
npm install date-fns

# Axios is an alternative to fetch — not strictly needed
# npm install axios
```

---

## ✅ Verify

- Delete the boilerplate in `App.tsx` and replace with `<h1>Bond Calculator</h1>`
- Run `npm run dev` — you should see the heading at `localhost:5173`
- No TypeScript errors in the terminal

---

## 💡 Key Concepts

| Concept | Explanation |
|---------|-------------|
| `import.meta.env` | Vite's way of reading `.env` variables in the browser |
| Shared types | Keeps frontend and backend in sync — if the API changes, TypeScript will yell |
| Dev proxy | Avoids CORS issues during development by forwarding requests from the frontend server |

---

## 🚀 Commit

```bash
git add frontend/src
git commit -m "feat(frontend): scaffold React app structure, shared types, and API client"
```
