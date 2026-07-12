# Sistema de Inventario

Aplicación web full-stack (MERN + JWT) para la gestión de un inventario de productos.
Proyecto académico que cumple con los requisitos de autenticación, CRUD completo,
base de datos MongoDB, backend en Node/Express, frontend en React y pruebas con Postman.

## 1. Análisis del problema

**Necesidad:** una pequeña empresa necesita controlar el stock de sus productos
(alta, baja, edición, consulta) y restringir el acceso al sistema solo a usuarios
registrados, evitando que cualquier persona pueda ver o modificar el inventario.

**Solución:** sistema web con autenticación JWT donde cada usuario registrado puede
gestionar el catálogo de productos: nombre, SKU, categoría, precio, cantidad en stock
y stock mínimo (para alertar cuando un producto está por agotarse).

## 2. Arquitectura

```
inventory-system/
├── backend/                 # API REST (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/db.js         # Conexión a MongoDB
│   │   ├── models/               # Esquemas Mongoose (User, Product)
│   │   ├── middleware/           # auth (JWT) y manejo de errores
│   │   ├── controllers/          # Lógica de negocio
│   │   ├── routes/               # Definición de endpoints + validaciones
│   │   └── server.js              # Punto de entrada de Express
│   ├── package.json
│   └── .env.example
├── frontend/                # Cliente (React + Vite)
│   ├── src/
│   │   ├── api/axios.js          # Cliente HTTP con interceptores JWT
│   │   ├── context/AuthContext.jsx  # Estado global de autenticación
│   │   ├── components/           # Navbar, PrivateRoute, ProductForm, ProductTable
│   │   ├── pages/                # Login, Register, Dashboard, Products
│   │   └── App.jsx / main.jsx
│   ├── package.json
│   └── .env.example
└── postman/
    └── Inventory_System.postman_collection.json
```

### Modelo de datos (MongoDB)

**Colección `users`**
| Campo | Tipo | Descripción |
|---|---|---|
| name | String | Nombre del usuario |
| email | String (único) | Correo, usado para login |
| password | String | Hash bcrypt de la contraseña |
| role | String | `admin` o `user` |

**Colección `products`**
| Campo | Tipo | Descripción |
|---|---|---|
| name | String | Nombre del producto |
| sku | String (único) | Código identificador |
| category | String | Categoría del producto |
| description | String | Descripción opcional |
| price | Number | Precio unitario |
| quantity | Number | Cantidad en stock |
| minStock | Number | Umbral para alerta de stock bajo |
| createdBy | ObjectId → `users` | Relación: usuario que creó el producto |

## 3. Tecnologías

- **Frontend:** React 18, React Router DOM, Axios, Vite
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, express-validator
- **Base de datos:** MongoDB
- **Pruebas de API:** Postman (colección incluida)

## 4. Instalación y ejecución

### Requisitos previos
- Node.js 18+
- MongoDB una URI de MongoDB Atlas

### Backend

```bash
cd backend
cp .env     # editar JWT_SECRET y MONGO_URI si es necesario
npm install
npm run dev               # http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env
npm install
npm run dev               # http://localhost:5173
```

### Postman

1. Abrir Postman → **Import** → seleccionar `postman/Inventory_System.postman_collection.json`.
2. Ejecutar primero `Auth > Registrar usuario` o `Auth > Iniciar sesión` (el token se guarda
   automáticamente en la variable de colección `token`).
3. Ejecutar las peticiones de `Productos` (usan el token guardado automáticamente).

## 5. Endpoints de la API

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar usuario | Público |
| POST | `/api/auth/login` | Iniciar sesión | Público |
| POST | `/api/auth/logout` | Cerrar sesión | Privado |
| GET | `/api/auth/profile` | Validar token / obtener perfil | Privado |
| GET | `/api/products` | Listar productos (`?search=`) | Privado |
| POST | `/api/products` | Crear producto | Privado |
| GET | `/api/products/:id` | Obtener producto | Privado |
| PUT | `/api/products/:id` | Actualizar producto | Privado |
| DELETE | `/api/products/:id` | Eliminar producto | Privado |

## 6. Seguridad implementada

- Contraseñas encriptadas con `bcryptjs` (nunca se guardan en texto plano).
- Autenticación stateless con JWT firmado (`JWT_SECRET`) y expiración configurable.
- Middleware `protect` que valida el token en cada ruta privada del backend.
- Rutas privadas protegidas también en el frontend con `PrivateRoute`.
- Token almacenado en `localStorage` en el cliente y enviado vía header
  `Authorization: Bearer <token>` mediante interceptor de Axios.
- Validaciones tanto en frontend (formularios controlados) como en backend
  (`express-validator` + validaciones de esquema en Mongoose).
- Manejo centralizado de errores (`errorHandler`) con mensajes claros y códigos HTTP correctos.

## 7. Buenas prácticas aplicadas

- Separación de responsabilidades: rutas / controladores / modelos / middleware.
- Componentes React reutilizables (`ProductForm`, `ProductTable`, `Navbar`, `PrivateRoute`).
- Nombres descriptivos de variables, funciones y archivos.
- Un solo punto de verdad para el estado de autenticación (`AuthContext`).
- Manejo de errores consistente en API y UI.
- Código modular y organizado por carpetas según su responsabilidad.
