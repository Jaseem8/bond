import type { CashFlowRow } from '../../types/bond.types';
import './CashFlowTable.css';

interface Props {
  rows: CashFlowRow[];
}

function usd(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
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
              <th>Period</th>
              <th>Payment Date</th>
              <th>Coupon Payment</th>
              <th>Cumulative Interest</th>
              <th>Remaining Principal</th>
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
