# 🛒 Mini E-commerce con Microservicios y Docker Compose

Este proyecto es un ejemplo académico de cómo construir un **mini e-commerce** usando una arquitectura de **microservicios**, orquestados con **Docker Compose**.

La idea principal es mostrar, de forma sencilla y visual, cómo una aplicación puede dividirse en servicios pequeños, independientes y desplegables por separado.

---

## 🧩 Descripción general de la arquitectura

La aplicación se compone de tres servicios principales:

### 1. **Gateway + Frontend** (`gateway`)
- Actúa como *API Gateway*
- Sirve la interfaz web (HTML + CSS + Bootstrap)
- Expone endpoints REST:
  - `GET /api/products` → consulta productos
  - `POST /api/orders` → crea pedidos
- Se comunica internamente con los otros microservicios

### 2. **Microservicio de Productos** (`products-service`)
- Gestiona el **catálogo de productos**
- Expone:
  - `GET /products`
  - `GET /products/:id`
- Los datos se guardan **en memoria** (array en el código) para simplificar el ejemplo

### 3. **Microservicio de Pedidos** (`orders-service`)
- Gestiona las **órdenes/pedidos** que genera el usuario desde el carrito
- Expone:
  - `GET /orders`
  - `POST /orders`
- También guarda la información **en memoria**

Todos estos servicios se levantan como contenedores Docker y se conectan entre sí mediante **Docker Compose**.

---

## 🏗️ Tecnologías utilizadas

- **Node.js** - Backend de los microservicios y gateway
- **Express** - Framework para crear APIs REST
- **Bootstrap 5** - Interfaz simple y responsiva
- **HTML, CSS y JavaScript** - Frontend
- **Docker** - Contenedores
- **Docker Compose** - Orquestación de múltiples contenedores

---

## 🗂️ Estructura del proyecto

```
ecommerce-microservicios/
├── docker-compose.yml
├── gateway/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   └── index.js
│   └── public/
│       ├── index.html
│       ├── app.js
│       └── styles.css
├── products-service/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js
└── orders-service/
    ├── Dockerfile
    ├── package.json
    └── src/
        └── index.js
```

**Resumen rápido:**
- `gateway/` → API Gateway + frontend
- `products-service/` → Microservicio de productos
- `orders-service/` → Microservicio de pedidos
- `docker-compose.yml` → Define cómo se levantan y conectan los 3 servicios

---

## 📦 Requisitos previos

Para poder ejecutar el proyecto necesitas:

- **Docker**
- **Docker Compose**

> **Nota:** No es necesario tener Node.js instalado si usas Docker Compose (recomendado).

---

## 🚀 Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/verdugong/Dockerizacion-Verdugo.git
cd ecommerce-microservicios
```

### 2. Levantar los contenedores

Desde la raíz del proyecto ejecuta:

```bash
docker-compose up --build
```

Esto hará:
- ✅ Construir las imágenes de los 3 servicios
- ✅ Crear una red interna para la comunicación entre servicios
- ✅ Exponer los puertos necesarios

### 3. Acceder a la aplicación

Una vez todo esté levantado, abre en tu navegador:

```
http://localhost:3000
```

Ahí verás el mini e-commerce con:
- Lista de productos
- Carrito de compras
- Botón para realizar pedido

---

## 🌐 Puertos y servicios

| Servicio | Puerto | URL Externa | URL Interna (Docker) |
|----------|--------|-------------|---------------------|
| **Gateway + Frontend** | 3000 | http://localhost:3000 | `http://gateway:3000` |
| **Products Service** | 4001 | http://localhost:4001 | `http://products-service:4001` |
| **Orders Service** | 4002 | http://localhost:4002 | `http://orders-service:4002` |

---

## 🔍 Endpoints principales

### Gateway (puerto 3000)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Devuelve la página principal (frontend) |
| `GET` | `/api/products` | Lista todos los productos (proxy a products-service) |
| `POST` | `/api/orders` | Crea un nuevo pedido (proxy a orders-service) |

**Ejemplo de body para `POST /api/orders`:**
```json
{
  "items": [
    {
      "productId": 1,
      "name": "Laptop gamer",
      "price": 1200,
      "quantity": 1
    }
  ],
  "total": 1200
}
```

### Products Service (puerto 4001)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/products` | Devuelve todos los productos |
| `GET` | `/products/:id` | Devuelve un producto específico por ID |

### Orders Service (puerto 4002)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/orders` | Devuelve todas las órdenes |
| `POST` | `/orders` | Crea una nueva orden |

**Ejemplo de respuesta de `POST /orders`:**
```json
{
  "id": 1,
  "items": [
    {
      "productId": 1,
      "name": "Laptop gamer",
      "price": 1200,
      "quantity": 1
    }
  ],
  "total": 1200,
  "createdAt": "2025-01-01T12:34:56.789Z"
}
```

---

## 🧠 Datos en memoria (importante)

⚠️ **Los datos se almacenan en memoria**, no en una base de datos real.

Esto significa que:
- Si paras los contenedores
- Si reinicias Docker Compose
- Si reinicias el servidor

👉 **Los datos se pierden**

Esto se hace a propósito para mantener el ejemplo simple y didáctico. La arquitectura está diseñada para que puedas sustituir fácilmente el almacenamiento en memoria por una base de datos real (MySQL, MongoDB, PostgreSQL, etc.) en el futuro.

---

## 🧪 Verificar los datos

Además de usar el frontend, puedes consultar directamente las APIs:

### Ver productos
```bash
curl http://localhost:4001/products
```

### Ver pedidos creados
```bash
curl http://localhost:4002/orders
```

---

## 🧭 Flujo de una compra

1. El usuario abre `http://localhost:3000`
2. El frontend llama a `GET /api/products` (gateway)
3. El gateway llama internamente a `GET /products` (products-service)
4. El usuario añade productos al carrito desde la interfaz
5. Al hacer clic en "Realizar pedido":
   - El frontend hace `POST /api/orders` al gateway
   - El gateway reenvía el body a `POST /orders` (orders-service)
   - orders-service crea la orden, la guarda en memoria y responde con el detalle
6. El frontend muestra un mensaje de confirmación con el ID de la orden

---

## 📝 Licencia

Este proyecto es de carácter académico.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Siéntete libre de abrir issues o pull requests para mejorar el proyecto.

---

## 📧 Contacto

Para preguntas o sugerencias, puedes contactar a través de [sebastianvccv@gmail.com]
