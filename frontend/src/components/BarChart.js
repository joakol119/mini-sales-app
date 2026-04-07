'use client';

const styles = {
  chartsRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  chartCard: { flex: 1, minWidth: 260, background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.07)' },
  chartTitle: { margin: '0 0 14px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 },
  barGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  barItem: { display: 'flex', alignItems: 'center', gap: 8 },
  barLabel: { fontSize: 12, color: '#64748b', width: 32, textAlign: 'right', flexShrink: 0 },
  barTrack: { flex: 1, height: 10, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99, transition: 'width 0.5s ease', minWidth: 4 },
  barCount: { fontSize: 12, color: '#94a3b8', width: 60, textAlign: 'right' },
};

export default function BarChart({ sales }) {
  if (!sales.length) return null;

  const scored = sales.filter((s) => s.score);
  const byScore = [1, 2, 3, 4, 5].map((s) => ({
    label: `${s}★`,
    count: scored.filter((x) => x.score === s).length,
  }));
  const maxCount = Math.max(...byScore.map((b) => b.count), 1);

  const topProducts = Object.entries(
    sales.reduce((acc, s) => {
      acc[s.product] = (acc[s.product] || 0) + s.amount;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxAmount = Math.max(...topProducts.map((p) => p[1]), 1);

  return (
    <div style={styles.chartsRow}>
      <div style={styles.chartCard}>
        <p style={styles.chartTitle}>Distribución de scores</p>
        <div style={styles.barGroup}>
          {byScore.map((b) => (
            <div key={b.label} style={styles.barItem}>
              <span style={styles.barLabel}>{b.label}</span>
              <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${(b.count / maxCount) * 100}%`, background: b.count ? '#3b82f6' : '#e2e8f0' }} />
              </div>
              <span style={styles.barCount}>{b.count}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.chartCard}>
        <p style={styles.chartTitle}>Top productos por monto</p>
        <div style={styles.barGroup}>
          {topProducts.map(([name, amount]) => (
            <div key={name} style={styles.barItem}>
              <span style={{ ...styles.barLabel, width: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
              <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${(amount / maxAmount) * 100}%`, background: '#10b981' }} />
              </div>
              <span style={styles.barCount}>${amount.toLocaleString('es-UY')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
