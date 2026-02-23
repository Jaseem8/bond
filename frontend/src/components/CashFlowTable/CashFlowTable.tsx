import type { CashFlowRow } from '../../types/bond.types';
import './CashFlowTable.css';

interface Props {
  rows: CashFlowRow[];
}

function usd(n: number, hideCents = false): string {
  return n.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: hideCents ? 0 : 2,
    maximumFractionDigits: hideCents ? 0 : 2,
  });
}

export function CashFlowTable({ rows }: Props) {
  return (
    <div className="cash-flow-wrapper">
      <h3 className="table-heading">
        <span>📅</span> Cash Flow Schedule
        <span className="table-badge">{rows.length} periods</span>
      </h3>
      <div className="table-scroll">
        <table className="cash-flow-table">
          <thead>
            <tr>
              <th><span className="full-text">Period</span><span className="short-text">P.</span></th>
              <th><span className="full-text">Payment Date</span><span className="short-text">Date</span></th>
              <th><span className="full-text">Coupon Payment</span><span className="short-text">Coupon</span></th>
              <th><span className="full-text">Cumulative Interest</span><span className="short-text">Interest</span></th>
              <th><span className="full-text">Remaining Principal</span><span className="short-text">Principal</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.period} className={row.period % 2 === 0 ? 'row-alt' : ''}>
                <td className="period-cell">{row.period}</td>
                <td>{row.paymentDate}</td>
                <td className="num-cell">{usd(row.couponPayment)}</td>
                <td className="num-cell">{usd(row.cumulativeInterest)}</td>
                <td className="num-cell principal-cell">{usd(row.remainingPrincipal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
