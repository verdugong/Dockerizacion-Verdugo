const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const PRODUCTS_SERVICE_URL =
  process.env.PRODUCTS_SERVICE_URL || 'http://products-service:4001';
const ORDERS_SERVICE_URL =
  process.env.ORDERS_SERVICE_URL || 'http://orders-service:4002';

app.use(cors());
app.use(express.json());

// Servir frontend estático
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint para obtener productos
app.get('/api/products', async (req, res) => {
  try {
    const response = await fetch(`${PRODUCTS_SERVICE_URL}/products`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Endpoint para crear pedidos
app.post('/api/orders', async (req, res) => {
  try {
    const response = await fetch(`${ORDERS_SERVICE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear la orden' });
  }
});

// Ruta raíz para servir el index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gateway listening on port ${PORT}`);
});

