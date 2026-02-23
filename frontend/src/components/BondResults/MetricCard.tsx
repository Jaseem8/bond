interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: 'premium' | 'discount' | 'neutral';
}

export function MetricCard({
  label,
  value,
  sub,
  highlight = 'neutral',
}: MetricCardProps) {
  return (
    <div className={`metric-card metric-card--${highlight}`}>
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
      {sub && <span className="metric-sub">{sub}</span>}
    </div>
  );
}
