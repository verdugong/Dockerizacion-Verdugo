let cart = [];
let products = [];

function formatCurrency(value) {
  return value.toFixed(2);
}

function renderProducts() {
  const container = document.getElementById('products');
  container.innerHTML = '';

  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-xl-4';

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text text-muted small mb-2">
            ${product.description || 'Producto de nuestra tienda en línea.'}
          </p>
          <p class="mb-2">
            <span class="fw-bold">$${formatCurrency(product.price)}</span>
          </p>
          <p class="mb-3">
            <span class="badge bg-secondary">Stock: ${product.stock}</span>
          </p>
          <button class="btn btn-outline-primary mt-auto" data-id="${product.id}">
            Añadir al carrito
          </button>
        </div>
      </div>
    `;

    const button = col.querySelector('button');
    button.addEventListener('click', () => addToCart(product.id));

    container.appendChild(col);
  });
}

function renderCart() {
  const list = document.getElementById('cart-items');
  const totalElement = document.getElementById('cart-total');
  const emptyLabel = document.getElementById('cart-empty');
  const checkoutBtn = document.getElementById('checkout-btn');

  list.innerHTML = '';

  if (cart.length === 0) {
    emptyLabel.classList.remove('d-none');
    checkoutBtn.disabled = true;
    totalElement.textContent = '0.00';
    return;
  }

  emptyLabel.classList.add('d-none');
  checkoutBtn.disabled = false;

  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.className =
      'list-group-item d-flex justify-content-between align-items-center';

    const subtotal = item.price * item.quantity;
    total += subtotal;

    li.innerHTML = `
      <div>
        <div class="fw-semibold">${item.name}</div>
        <small class="text-muted">Cantidad: ${item.quantity} · $${formatCurrency(
      item.price
    )} c/u</small>
      </div>
      <div class="text-end">
        <div class="fw-semibold">$${formatCurrency(subtotal)}</div>
        <button class="btn btn-sm btn-link text-danger p-0">Quitar</button>
      </div>
    `;

    const removeBtn = li.querySelector('button');
    removeBtn.addEventListener('click', () => removeFromCart(item.productId));

    list.appendChild(li);
  });

  totalElement.textContent = formatCurrency(total);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    if (existing.quantity < product.stock) {
      existing.quantity += 1;
    }
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  renderCart();
}

async function loadProducts() {
  const message = document.getElementById('message');
  message.textContent = '';
  message.className = 'mt-3 small';

  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    products = data;
    renderProducts();
  } catch (err) {
    console.error(err);
    message.textContent =
      'No se pudieron cargar los productos. Intenta de nuevo más tarde.';
    message.classList.add('text-danger');
  }
}

async function checkout() {
  const message = document.getElementById('message');
  message.textContent = '';
  message.className = 'mt-3 small';

  if (cart.length === 0) return;

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        total
      })
    });

    const data = await res.json();

    if (!res.ok) {
      message.textContent =
        data.message || 'Ocurrió un error al crear la orden.';
      message.classList.add('text-danger');
      return;
    }

    cart = [];
    renderCart();
    message.innerHTML = `✅ Pedido #<strong>${data.id}</strong> creado por $${formatCurrency(
      data.total
    )}. ¡Gracias por tu compra!`;
    message.classList.add('text-success');
  } catch (err) {
    console.error(err);
    message.textContent =
      'Ocurrió un error al conectar con el servidor. Intenta más tarde.';
    message.classList.add('text-danger');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.addEventListener('click', checkout);
  renderCart();
  loadProducts();
});

