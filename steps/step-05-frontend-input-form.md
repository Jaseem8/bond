# Step 05 — Frontend: Bond Input Form

> **Previous:** [Step 04 — React Setup](./step-04-frontend-react-setup.md) | **Next:** [Step 06 — Results & Table](./step-06-frontend-results-table.md)

---

## 🎯 Goal

Build a controlled React form with:
- All 5 bond inputs
- Client-side validation (no empty fields, sensible ranges)
- A `useCallback`-based submit handler that calls the API
- Loading and error states

---

## 📚 What You'll Learn

- Controlled vs uncontrolled React forms
- `useState` for form values and validation errors
- Why we keep form logic in a custom hook (`useBondForm`)
- Lifting state up: the form sits inside `App.tsx` and passes results up

---

## 📁 Files to Create

```
frontend/src/
├── hooks/
│   └── useBondForm.ts
└── components/
    └── BondForm/
        ├── BondForm.tsx
        └── BondForm.css
```

---

## 💻 Code

### `hooks/useBondForm.ts`
```typescript
import { useState, useCallback } from 'react';
import type { BondInputs, BondResults } from '../types/bond.types';
import { calculateBond } from '../api/api';

interface FormState {
  faceValue: string;
  annualCouponRate: string;
  marketPrice: string;
  yearsToMaturity: string;
  couponFrequency: '1' | '2';
}

const initialForm: FormState = {
  faceValue: '1000',
  annualCouponRate: '5',
  marketPrice: '950',
  yearsToMaturity: '10',
  couponFrequency: '1',
};

export function useBondForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [results, setResults] = useState<BondResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        const inputs: BondInputs = {
          faceValue: Number(form.faceValue),
          annualCouponRate: Number(form.annualCouponRate) / 100, // convert % to decimal
          marketPrice: Number(form.marketPrice),
          yearsToMaturity: Number(form.yearsToMaturity),
          couponFrequency: Number(form.couponFrequency) as 1 | 2,
        };
        const data = await calculateBond(inputs);
        setResults(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  return { form, results, loading, error, handleChange, handleSubmit };
}
```

### `components/BondForm/BondForm.tsx`
```tsx
import React from 'react';
import './BondForm.css';

interface Props {
  form: {
    faceValue: string;
    annualCouponRate: string;
    marketPrice: string;
    yearsToMaturity: string;
    couponFrequency: '1' | '2';
  };
  loading: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BondForm({ form, loading, error, onChange, onSubmit }: Props) {
  return (
    <form className="bond-form" onSubmit={onSubmit}>
      <h2>Bond Parameters</h2>

      <label>
        Face Value ($)
        <input
          type="number"
          name="faceValue"
          value={form.faceValue}
          onChange={onChange}
          min={1}
          required
          placeholder="e.g. 1000"
        />
      </label>

      <label>
        Annual Coupon Rate (%)
        <input
          type="number"
          name="annualCouponRate"
          value={form.annualCouponRate}
          onChange={onChange}
          min={0}
          max={100}
          step={0.01}
          required
          placeholder="e.g. 5"
        />
      </label>

      <label>
        Market Price ($)
        <input
          type="number"
          name="marketPrice"
          value={form.marketPrice}
          onChange={onChange}
          min={1}
          required
          placeholder="e.g. 950"
        />
      </label>

      <label>
        Years to Maturity
        <input
          type="number"
          name="yearsToMaturity"
          value={form.yearsToMaturity}
          onChange={onChange}
          min={1}
          max={100}
          required
          placeholder="e.g. 10"
        />
      </label>

      <label>
        Coupon Frequency
        <select name="couponFrequency" value={form.couponFrequency} onChange={onChange}>
          <option value="1">Annual</option>
          <option value="2">Semi-Annual</option>
        </select>
      </label>

      {error && <p className="form-error">⚠ {error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Calculating…' : 'Calculate'}
      </button>
    </form>
  );
}
```

---

## ✅ Quick Check

- Does changing an input update its `value` attribute in the DOM? (controlled input)
- Does submitting with empty fields show validation?
- Does the loading state disable the button?

---

## 💡 Key Concepts

| Concept | Explanation |
|---------|-------------|
| Controlled input | `value` comes from state; `onChange` updates state — React owns the truth |
| Custom hook | Moves stateful logic out of the component, keeping JSX clean |
| `e.preventDefault()` | Stops the browser from doing a full-page form POST |
| Percentage → decimal | User types "5", we send `0.05` to the API |

---

## 🚀 Commit

```bash
git add frontend/src/hooks frontend/src/components/BondForm
git commit -m "feat(frontend): add controlled BondForm component and useBondForm hook"
```
