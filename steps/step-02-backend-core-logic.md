# Step 02 — Backend Core Logic (Bond Math)

> **Previous:** [Step 01 — Project Setup](./step-01-project-setup.md) | **Next:** [Step 03 — NestJS API](./step-03-backend-nestjs-api.md)

---

## 🎯 Goal

Write **pure TypeScript functions** that do all the bond maths.  
No HTTP, no NestJS — just plain logic that can be unit-tested in isolation.

---

## 📚 What You'll Learn

- How bond prices and yields are related
- Why YTM needs a numerical method (Newton-Raphson)
- How to structure pure utility functions in TypeScript

---

## 📐 The Maths

### Current Yield
```
Current Yield = (Annual Coupon Rate × Face Value) / Market Price
```

### Bond Price (present value)
```
P = Σ [C / (1 + r)^t]  +  F / (1 + r)^n

Where:
  C = coupon payment per period
  r = yield per period (YTM / frequency)
  F = face value
  n = total number of periods
```

### YTM — Newton-Raphson Iteration
We cannot solve for `r` algebraically when `n > 1`, so we iterate:

```
r(next) = r - f(r) / f'(r)

f(r)  = calculated bond price at rate r − market price
f'(r) = derivative of bond price with respect to r
```

We iterate until `|f(r)| < tolerance` (e.g. 1e-10).

---

## 📁 File to Create

```
backend/src/bond/
└── bond.utils.ts
```

---

## 💻 Code

```typescript
// backend/src/bond/bond.utils.ts

export interface BondInputs {
  faceValue: number;
  annualCouponRate: number;   // e.g. 0.05 for 5%
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: 1 | 2;    // 1 = annual, 2 = semi-annual
}

export interface CashFlowRow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondOutputs {
  currentYield: number;
  ytm: number;
  totalInterestEarned: number;
  isPremium: boolean;
  isDiscount: boolean;
  cashFlowSchedule: CashFlowRow[];
}

// ─── Price → Yield helper ─────────────────────────────────────────────────────

function bondPrice(periodicRate: number, coupon: number, faceValue: number, periods: number): number {
  let price = 0;
  for (let t = 1; t <= periods; t++) {
    price += coupon / Math.pow(1 + periodicRate, t);
  }
  price += faceValue / Math.pow(1 + periodicRate, periods);
  return price;
}

function bondPriceDerivative(periodicRate: number, coupon: number, faceValue: number, periods: number): number {
  let deriv = 0;
  for (let t = 1; t <= periods; t++) {
    deriv -= t * coupon / Math.pow(1 + periodicRate, t + 1);
  }
  deriv -= periods * faceValue / Math.pow(1 + periodicRate, periods + 1);
  return deriv;
}

export function calculateYTM(
  marketPrice: number,
  coupon: number,
  faceValue: number,
  periods: number,
  frequency: number,
  tolerance = 1e-10,
  maxIterations = 1000,
): number {
  let r = coupon / marketPrice; // initial guess
  for (let i = 0; i < maxIterations; i++) {
    const price = bondPrice(r, coupon, faceValue, periods);
    const diff = price - marketPrice;
    if (Math.abs(diff) < tolerance) break;
    r -= diff / bondPriceDerivative(r, coupon, faceValue, periods);
  }
  return r * frequency; // annualise
}

// ─── Cash Flow Schedule ───────────────────────────────────────────────────────

export function buildCashFlowSchedule(
  inputs: BondInputs,
  startDate: Date = new Date(),
): CashFlowRow[] {
  const { faceValue, annualCouponRate, yearsToMaturity, couponFrequency } = inputs;
  const periods = yearsToMaturity * couponFrequency;
  const couponPayment = (faceValue * annualCouponRate) / couponFrequency;
  const monthsPerPeriod = 12 / couponFrequency;

  const rows: CashFlowRow[] = [];
  let cumulative = 0;

  for (let p = 1; p <= periods; p++) {
    cumulative += couponPayment;
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + p * monthsPerPeriod);

    rows.push({
      period: p,
      paymentDate: paymentDate.toISOString().split('T')[0],
      couponPayment: +couponPayment.toFixed(4),
      cumulativeInterest: +cumulative.toFixed(4),
      remainingPrincipal: faceValue, // principal repaid at maturity only
    });
  }
  return rows;
}

// ─── Main Calculator ──────────────────────────────────────────────────────────

export function calculateBond(inputs: BondInputs): BondOutputs {
  const { faceValue, annualCouponRate, marketPrice, yearsToMaturity, couponFrequency } = inputs;

  const annualCoupon = faceValue * annualCouponRate;
  const periodicCoupon = annualCoupon / couponFrequency;
  const periods = yearsToMaturity * couponFrequency;

  const currentYield = annualCoupon / marketPrice;
  const ytm = calculateYTM(marketPrice, periodicCoupon, faceValue, periods, couponFrequency);
  const totalInterestEarned = periodicCoupon * periods;

  return {
    currentYield: +currentYield.toFixed(6),
    ytm: +ytm.toFixed(6),
    totalInterestEarned: +totalInterestEarned.toFixed(4),
    isPremium: marketPrice > faceValue,
    isDiscount: marketPrice < faceValue,
    cashFlowSchedule: buildCashFlowSchedule(inputs),
  };
}
```

---

## ✅ Manual Verification (before writing tests)

Open a Node REPL and paste the function, then try:
```
Face Value: 1000, Rate: 5%, Market Price: 950, Years: 10, Annual
Expected Current Yield: ~5.26%
Expected YTM: ~5.58% (approx)
```

---

## 🚀 Commit

```bash
git add backend/src/bond/bond.utils.ts
git commit -m "feat(backend): add pure bond math utility functions (YTM, cash flow)"
```
