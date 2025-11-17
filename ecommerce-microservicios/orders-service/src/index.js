const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

let orders = [];
let currentId = 1;

app.get('/orders', (req, res) => {
  res.json(orders);
});

app.post('/orders', (req, res) => {
  const { items, total } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'La orden debe incluir al menos un producto.' });
  }

  const order = {
    id: currentId++,
    items,
    total,
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  res.status(201).json(order);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Orders service listening on port ${PORT}`);
});

