const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

let products = [
  {
    id: 1,
    name: 'Laptop gamer',
    description: 'Ideal para juegos y tareas pesadas.',
    price: 1200,
    stock: 5
  },
  {
    id: 2,
    name: 'Mouse inalámbrico',
    description: 'Cómodo y preciso para uso diario.',
    price: 25,
    stock: 20
  },
  {
    id: 3,
    name: 'Audífonos Bluetooth',
    description: 'Buena calidad de sonido y batería duradera.',
    price: 60,
    stock: 15
  }
];

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.json(product);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Products service listening on port ${PORT}`);
});
