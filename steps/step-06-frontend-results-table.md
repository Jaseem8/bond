# Step 06 — Frontend: Results Display & Cash Flow Table

> **Previous:** [Step 05 — Input Form](./step-05-frontend-input-form.md) | **Next:** [Step 07 — API Integration](./step-07-api-integration.md)

---

## 🎯 Goal

Display the four computed outputs and the full cash-flow schedule table once the API responds.

---

## 📚 What You'll Learn

- Conditional rendering with TypeScript type narrowing
- `Array.map` to render table rows dynamically
- Formatting numbers as percentages and currencies
- Using a badge/pill component for Premium vs Discount

---

## 📁 Files to Create

```
frontend/src/components/
├── BondResults/
│   ├── BondResults.tsx
│   ├── MetricCard.tsx
│   └── BondResults.css
└── CashFlowTable/
    ├── CashFlowTable.tsx
    └── CashFlowTable.css
```

---

## 💻 Code

### `components/BondResults/MetricCard.tsx`
```tsx
interface MetricCardProps {
  label: string;
  value: string;
  highlight?: 'premium' | 'discount' | 'neutral';
}

export function MetricCard({ label, value, highlight = 'neutral' }: MetricCardProps) {
  return (
    <div className={`metric-card metric-card--${highlight}`}>
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
    </div>
  );
}
```

### `components/BondResults/BondResults.tsx`
```tsx
import type { BondResults as BondResultsType } from '../../types/bond.types';
import { MetricCard } from './MetricCard';
import { CashFlowTable } from '../CashFlowTable/CashFlowTable';
import './BondResults.css';

interface Props {
  results: BondResultsType;
}

function pct(n: number) { return `${(n * 100).toFixed(4)}%`; }
function usd(n: number) { return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`; }

export function BondResults({ results }: Props) {
  const { currentYield, ytm, totalInterestEarned, isPremium, isDiscount, cashFlowSchedule } = results;

  const status = isPremium ? 'premium' : isDiscount ? 'discount' : 'neutral';
  const statusLabel = isPremium ? '📈 Trading at Premium' : isDiscount ? '📉 Trading at Discount' : '⚖ At Par';

  return (
    <section className="bond-results">
      <h2>Results</h2>

      <div className="metrics-grid">
        <MetricCard label="Current Yield" value={pct(currentYield)} />
        <MetricCard label="Yield to Maturity (YTM)" value={pct(ytm)} />
        <MetricCard label="Total Interest Earned" value={usd(totalInterestEarned)} />
        <MetricCard
          label="Bond Status"
          value={statusLabel}
          highlight={status}
        />
      </div>

      <CashFlowTable rows={cashFlowSchedule} />
    </section>
  );
}
```

### `components/CashFlowTable/CashFlowTable.tsx`
```tsx
import type { CashFlowRow } from '../../types/bond.types';
import './CashFlowTable.css';

interface Props {
  rows: CashFlowRow[];
}

function usd(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function CashFlowTable({ rows }: Props) {
  return (
    <div className="cash-flow-wrapper">
      <h3>Cash Flow Schedule</h3>
      <div className="table-scroll">
        <table className="cash-flow-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Payment Date</th>
              <th>Coupon Payment</th>
              <th>Cumulative Interest</th>
              <th>Remaining Principal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.period}>
                <td>{row.period}</td>
                <td>{row.paymentDate}</td>
                <td>{usd(row.couponPayment)}</td>
                <td>{usd(row.cumulativeInterest)}</td>
                <td>{usd(row.remainingPrincipal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 💡 Key Concepts

| Concept | Explanation |
|---------|-------------|
| `toLocaleString` | Browser-native number/currency formatting — no library needed |
| Props interface | Explicit types on props = IDE autocomplete + compile-time safety |
| `key` on `<tr>` | React needs a stable key to efficiently update lists |
| `status` ternary | Calculates badge colour from data — no hard-coded strings in JSX |

---

## ✅ Check

- Do all four metric cards render?
- Does the table scroll horizontally on narrow screens?
- Does the "Premium" card show a different colour to "Discount"?

---

## 🚀 Commit

```bash
git add frontend/src/components
git commit -m "feat(frontend): add BondResults, MetricCard, and CashFlowTable components"
```
