const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getSales() {
  const res = await fetch(`${API_URL}/sales`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch sales');
  return res.json();
}

export async function createSale(data) {
  const res = await fetch(`${API_URL}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create sale');
  }
  return res.json();
}

export async function evaluateSale(id, score) {
  const res = await fetch(`${API_URL}/sales/${id}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to evaluate sale');
  }
  return res.json();
}

export async function deleteSale(id) {
  const res = await fetch(`${API_URL}/sales/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete sale');
  }
  return res.json();
}
