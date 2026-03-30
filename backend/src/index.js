const express = require('express');
const cors = require('cors');
const db = require('./db');
const salesRouter = require('./routes/sales');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Init DB
db.init();

// Routes
app.use('/sales', salesRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
