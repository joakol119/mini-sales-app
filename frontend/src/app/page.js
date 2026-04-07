'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSales, evaluateSale, deleteSale } from '../lib/api';
import BarChart from '../components/BarChart';
import ScoreStars from '../components/ScoreStars';
import NewSaleForm from '../components/NewSaleForm';

const styles = {
  page: { minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter', system-ui, sans-serif" },
  header: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', padding: '18px 0', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' },
  headerInner: { maxWidth: 960, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  title: { margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' },
  headerStats: { display: 'flex', gap: 10 },
  statPill: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '6px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: 700, lineHeight: 1.2 },
  statLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  main: { maxWidth: 960, margin: '28px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 20 },
  card: { background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)' },
  cardTitle: { margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#0f172a' },
  toggleBtn: { background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  filters: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  searchInput: { padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', minWidth: 220, background: '#f8fafc' },
  select: { padding: '8px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#f8fafc', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: { textAlign: 'left', padding: '8px 12px', color: '#94a3b8', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid #f1f5f9' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '13px 12px', color: '#334155', verticalAlign: 'middle' },
  idBadge: { background: '#f1f5f9', borderRadius: 6, padding: '3px 8px', fontSize: 12, color: '#64748b', fontWeight: 600 },
  productBadge: { background: '#eff6ff', color: '#3b82f6', borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 500 },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.5, padding: '2px 6px', borderRadius: 6 },
  empty: { color: '#94a3b8', textAlign: 'center', padding: '40px 0', margin: 0, fontSize: 14 },
  toast: { position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1e293b', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  errorBanner: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '14px 18px', color: '#ef4444', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  retryBtn: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};

export default function Home() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [filterScore, setFilterScore] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [toast, setToast] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [showChart, setShowChart] = useState(true);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await getSales();
      setSales(data);
    } catch (err) {
      setFetchError('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  const handleScore = async (id, score) => {
    try {
      const updated = await evaluateSale(id, score);
      setSales((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      showToast(`Venta #${id} evaluada con ${score} ★`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`¿Eliminar venta #${id}?`)) return;
    setDeleting(id);
    try {
      await deleteSale(id);
      setSales((prev) => prev.filter((s) => s.id !== id));
      showToast(`Venta #${id} eliminada`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = useMemo(() => {
    let result = [...sales];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.customer.toLowerCase().includes(q) || s.product.toLowerCase().includes(q));
    }
    if (filterScore === 'scored') result = result.filter((s) => s.score);
    if (filterScore === 'unscored') result = result.filter((s) => !s.score);
    if (filterScore === 'high') result = result.filter((s) => s.score >= 4);
    if (sortBy === 'newest') result.sort((a, b) => b.id - a.id);
    if (sortBy === 'oldest') result.sort((a, b) => a.id - b.id);
    if (sortBy === 'amount_desc') result.sort((a, b) => b.amount - a.amount);
    if (sortBy === 'amount_asc') result.sort((a, b) => a.amount - b.amount);
    if (sortBy === 'score_desc') result.sort((a, b) => (b.score || 0) - (a.score || 0));
    return result;
  }, [sales, search, filterScore, sortBy]);

  const totalAmount = sales.reduce((acc, s) => acc + s.amount, 0);
  const scoredSales = sales.filter((s) => s.score);
  const avgScore = scoredSales.length
    ? (scoredSales.reduce((acc, s) => acc + s.score, 0) / scoredSales.length).toFixed(1)
    : null;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <h1 style={styles.title}>📊 Sales Manager</h1>
          <div style={styles.headerStats}>
            <div style={styles.statPill}>
              <span style={styles.statValue}>{sales.length}</span>
              <span style={styles.statLabel}>ventas</span>
            </div>
            <div style={styles.statPill}>
              <span style={styles.statValue}>${totalAmount.toLocaleString('es-UY', { minimumFractionDigits: 0 })}</span>
              <span style={styles.statLabel}>total</span>
            </div>
            {avgScore && (
              <div style={{ ...styles.statPill, background: '#f59e0b20', border: '1px solid #f59e0b40' }}>
                <span style={{ ...styles.statValue, color: '#f59e0b' }}>⭐ {avgScore}</span>
                <span style={styles.statLabel}>promedio</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {toast && <div style={styles.toast}>{toast}</div>}

        <NewSaleForm onCreated={fetchSales} />

        {fetchError && (
          <div style={styles.errorBanner}>
            <span>⚠️ {fetchError}</span>
            <button style={styles.retryBtn} onClick={fetchSales}>Reintentar</button>
          </div>
        )}

        {sales.length > 0 && (
          <div>
            <button style={styles.toggleBtn} onClick={() => setShowChart(!showChart)}>
              {showChart ? '▲ Ocultar gráficos' : '▼ Ver gráficos'}
            </button>
            {showChart && <BarChart sales={sales} />}
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.tableHeader}>
            <h2 style={styles.cardTitle}>
              Ventas {filtered.length !== sales.length && `(${filtered.length} de ${sales.length})`}
            </h2>
            <div style={styles.filters}>
              <input
                style={styles.searchInput}
                placeholder="🔍 Buscar cliente o producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select style={styles.select} value={filterScore} onChange={(e) => setFilterScore(e.target.value)}>
                <option value="all">Todos</option>
                <option value="scored">Con score</option>
                <option value="unscored">Sin score</option>
                <option value="high">Score alto (4-5★)</option>
              </select>
              <select style={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Más nuevos</option>
                <option value="oldest">Más antiguos</option>
                <option value="amount_desc">Mayor monto</option>
                <option value="amount_asc">Menor monto</option>
                <option value="score_desc">Mayor score</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p style={styles.empty}>Cargando...</p>
          ) : fetchError ? (
            <p style={styles.empty}>No se pudieron cargar las ventas.</p>
          ) : filtered.length === 0 ? (
            <p style={styles.empty}>
              {sales.length === 0 ? 'No hay ventas aún. ¡Crea la primera!' : 'No hay resultados.'}
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['#', 'Cliente', 'Producto', 'Monto', 'Score', 'Fecha', ''].map((h) => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sale) => (
                    <tr key={sale.id} style={styles.tr}>
                      <td style={styles.td}><span style={styles.idBadge}>{sale.id}</span></td>
                      <td style={{ ...styles.td, fontWeight: 500 }}>{sale.customer}</td>
                      <td style={styles.td}><span style={styles.productBadge}>{sale.product}</span></td>
                      <td style={{ ...styles.td, fontWeight: 700, color: '#059669' }}>
                        ${Number(sale.amount).toLocaleString('es-UY', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={styles.td}>
                        <ScoreStars score={sale.score} onScore={(s) => handleScore(sale.id, s)} />
                      </td>
                      <td style={{ ...styles.td, color: '#94a3b8', fontSize: 13 }}>
                        {new Date(sale.created_at).toLocaleDateString('es-UY')}
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleDelete(sale.id)}
                          disabled={deleting === sale.id}
                          style={styles.deleteBtn}
                          title="Eliminar"
                        >
                          {deleting === sale.id ? '...' : '🗑️'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
