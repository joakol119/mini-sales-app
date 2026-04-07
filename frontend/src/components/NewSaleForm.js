'use client';

import { useState } from 'react';
import { createSale } from '../lib/api';

const styles = {
  card: { background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)' },
  cardTitle: { margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#0f172a' },
  formRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  input: { flex: 1, minWidth: 130, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', background: '#f8fafc' },
  btn: { padding: '10px 22px', borderRadius: 8, border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
  error: { color: '#ef4444', fontSize: 13, margin: '8px 0 0' },
};

export default function NewSaleForm({ onCreated }) {
  const [form, setForm] = useState({ customer: '', product: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.customer.trim() || !form.product.trim() || !form.amount) {
      setError('Todos los campos son obligatorios');
      return;
    }
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('El monto debe ser un número positivo');
      return;
    }
    setLoading(true);
    try {
      await createSale({ customer: form.customer.trim(), product: form.product.trim(), amount });
      setForm({ customer: '', product: '', amount: '' });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>➕ Nueva Venta</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Cliente"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Producto"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Monto ($)"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <button
            style={{ ...styles.btn, background: loading ? '#93c5fd' : '#3b82f6' }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : '+ Agregar'}
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
