import type { BondResults as BondResultsType } from '../../types/bond.types';
import { MetricCard } from './MetricCard';
import { CashFlowTable } from '../CashFlowTable/CashFlowTable';
import './BondResults.css';

interface Props {
  results: BondResultsType;
}

function pct(n: number): string {
  if (!isFinite(n) || isNaN(n)) return 'N/A';
  return (n * 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }) + '%';
}
function usd(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function BondResults({ results }: Props) {
  const {
    currentYield,
    ytm,
    totalInterestEarned,
    isPremium,
    isDiscount,
    cashFlowSchedule,
  } = results;

  const highlight = isPremium ? 'premium' : isDiscount ? 'discount' : 'neutral';
  const statusLabel = isPremium
    ? '📈 Trading at Premium'
    : isDiscount
    ? '📉 Trading at Discount'
    : '⚖ Trading at Par';
  const statusSub = isPremium
    ? 'Market price > Face value'
    : isDiscount
    ? 'Market price < Face value'
    : 'Market price = Face value';

  return (
    <section className="bond-results">
      <h2 className="results-heading">
        <span className="results-icon">🔬</span> Yield Intelligence
      </h2>

      <div className="metrics-grid">
        <MetricCard
          label="Current Yield"
          value={pct(currentYield)}
          sub="Annual coupon ÷ Market price"
        />
        <MetricCard
          label="Yield to Maturity"
          value={pct(ytm)}
          sub="Bisection Root Finder"
        />
        <MetricCard
          label="Total Interest Earned"
          value={usd(totalInterestEarned)}
          sub="Over full bond life"
        />
        <MetricCard
          label="Bond Status"
          value={statusLabel}
          sub={statusSub}
          highlight={highlight}
        />
      </div>

      <CashFlowTable rows={cashFlowSchedule} />
    </section>
  );
}
