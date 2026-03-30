const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// GET /sales - List all sales
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const sales = db.prepare('SELECT * FROM sales ORDER BY created_at DESC').all();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /sales - Create a sale
router.post('/', (req, res) => {
  const { customer, product, amount } = req.body;

  if (!customer || !product || amount === undefined) {
    return res.status(400).json({ error: 'customer, product and amount are required' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  try {
    const db = getDb();
    const stmt = db.prepare(
      'INSERT INTO sales (customer, product, amount) VALUES (?, ?, ?)'
    );
    const result = stmt.run(customer.trim(), product.trim(), amount);
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /sales/:id - Delete a sale
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    db.prepare('DELETE FROM sales WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /sales/:id/evaluate - Assign a score to a sale
router.post('/:id/evaluate', (req, res) => {
  const { id } = req.params;
  const { score } = req.body;

  if (score === undefined || !Number.isInteger(score) || score < 1 || score > 5) {
    return res.status(400).json({ error: 'score must be an integer between 1 and 5' });
  }

  try {
    const db = getDb();
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    db.prepare('UPDATE sales SET score = ? WHERE id = ?').run(score, id);
    const updated = db.prepare('SELECT * FROM sales WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
