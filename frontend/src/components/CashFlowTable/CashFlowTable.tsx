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
  const handleExportCSV = () => {
    const headers = ['Period', 'Payment Date', 'Coupon Payment', 'Cumulative Interest', 'Remaining Principal'];
    const csvContent = [
      headers.join(','),
      ...rows.map(row => [
        row.period,
        row.paymentDate,
        row.couponPayment,
        row.cumulativeInterest,
        row.remainingPrincipal
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bond_cashflow_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="cash-flow-wrapper">
      <div className="table-heading">
        <div className="heading-left">
          <span>📅</span> Cash Flow Schedule
        </div>
        <div className="heading-actions">
          <span className="table-badge">{rows.length} periods</span>
          <button className="export-btn" onClick={handleExportCSV} title="Download as CSV">
            <span>📥</span> 
            <span className="full-text">Export CSV</span>
          </button>
        </div>
      </div>
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
