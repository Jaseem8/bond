# Step 07 — API Integration (Wiring Frontend ↔ Backend)

> **Previous:** [Step 06 — Results & Table](./step-06-frontend-results-table.md) | **Next:** [Step 08 — Styling & UX](./step-08-styling-ux.md)

---

## 🎯 Goal

Connect all the pieces: the form, the hook, and the results display inside `App.tsx`. Make sure data flows end-to-end and errors are surfaced gracefully.

---

## 📚 What You'll Learn

- How to compose components and hooks in `App.tsx`
- Error boundary basics
- Handling network errors vs. validation errors from the API

---

## 💻 Code

### `App.tsx` — wire everything together
```tsx
import { BondForm } from './components/BondForm/BondForm';
import { BondResults } from './components/BondResults/BondResults';
import { useBondForm } from './hooks/useBondForm';
import './App.css';

export default function App() {
  const { form, results, loading, error, handleChange, handleSubmit } = useBondForm();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bond Yield Calculator</h1>
        <p className="subtitle">Enter bond parameters to compute yields and cash flows</p>
      </header>

      <main className="app-main">
        <BondForm
          form={form}
          loading={loading}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        {results && <BondResults results={results} />}
      </main>
    </div>
  );
}
```

---

## 🔍 Data Flow Diagram

```
User types → BondForm → useBondForm.handleSubmit
                            │
                            ▼
                    api.ts:calculateBond (POST /bond/calculate)
                            │
                            ▼
                   NestJS BondController
                            │
                            ▼
                   BondService → bond.utils.ts
                            │
                            ▼
                   JSON response
                            │
                            ▼
              useBondForm sets `results` state
                            │
                            ▼
                  BondResults + CashFlowTable render
```

---

## 🧯 Error Cases to Handle

| Case | What Happens | How We Handle It |
|------|-------------|-----------------|
| Network down | `fetch` throws | `catch` sets `error` string |
| Invalid inputs | NestJS returns 400 | Parse `error.message` array from response |
| Server crash | 500 response | Generic "Something went wrong" |
| Rate → 0% | Division by zero in YTM | Return `currentYield = 0` gracefully |

---

## 🏃 Running Both Servers

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend && npm run start:dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Navigate to `http://localhost:5173`, fill in the form, click Calculate.

---

## ✅ End-to-End Checklist

- [ ] Form submits without page reload
- [ ] Results appear below the form
- [ ] Changing inputs and re-submitting updates results
- [ ] Disconnecting the backend shows an error message (not a crash)
- [ ] Console is clean (no warnings about missing `key` props)

---

## 🚀 Commit

```bash
git add frontend/src/App.tsx
git commit -m "feat: wire BondForm and BondResults in App.tsx — end-to-end working"
```
