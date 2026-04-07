'use client';

import { useState } from 'react';

export default function ScoreStars({ score, onScore }) {
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScore = async (s) => {
    if (loading) return;
    setLoading(true);
    try {
      await onScore(s);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 1, opacity: loading ? 0.4 : 1, transition: 'opacity 0.2s' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={() => handleScore(s)}
          onMouseEnter={() => !loading && setHovered(s)}
          onMouseLeave={() => setHovered(null)}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 18,
            padding: '0 1px',
            transition: 'color 0.1s',
            color: s <= (hovered ?? score ?? 0) ? '#f59e0b' : '#d1d5db',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
