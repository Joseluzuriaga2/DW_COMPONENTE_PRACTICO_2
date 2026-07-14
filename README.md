# Sistema de Inventario

Aplicación web full-stack (MERN + JWT) para la gestión de un inventario de productos.
Proyecto académico que cumple con los requisitos de autenticación, CRUD completo,
base de datos MongoDB, backend en Node/Express, frontend en React y pruebas con Postman.

## Enlaces del proyecto

| Recurso | Enlace |
|---|---|
| Repositorio GitHub | https://github.com/Joseluzuriaga2/DW_COMPONENTE_PRACTICO_2 |
| Prototipo en Figma | [COMPONENTE_2](https://www.figma.com/design/RFUmBaAMarJIdKrEU5BOdW/COMPONENTE_2?node-id=0-1&t=mGolZYMu7tEW2POI-1) |
| Colección de Postman | [`postman/Inventory_System.postman_collection.json`](postman/Inventory_System.postman_collection.json) |

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
│   │   ├── components/           # Navbar, PrivateRoute, ProductForm,
│   │   │                         # ProductTable, StatCard, Icon
│   │   ├── pages/                # Login, Register, Dashboard, Products
│   │   ├── styles/app.css        # Estilos globales + diseño responsive
│   │   └── App.jsx / main.jsx
│   ├── package.json
│   └── .env.example
└── postman/
    └── Inventory_System.postman_collection.json
```

### Pantallas

| Pantalla | Ruta | Acceso | Descripción |
|---|---|---|---|
| Login | `/login` | Público | Inicio de sesión. Al autenticarse redirige al Dashboard. |
| Registro | `/register` | Público | Alta de nuevos usuarios. |
| Dashboard | `/` | Privado | Resumen del inventario: total de productos, unidades en stock, valor total, alerta de productos con stock bajo y últimos productos agregados. |
| Productos | `/products` | Privado | CRUD completo: listado, búsqueda, crear, editar y eliminar. |

La interfaz es **responsive**: en pantallas pequeñas el menú se apila, los formularios
pasan a una sola columna y las tablas se reorganizan como tarjetas legibles en móvil.

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
- MongoDB en local (`mongodb://127.0.0.1:27017`) o una URI de MongoDB Atlas

### Backend

```bash
cd backend
cp .env.example .env      # editar MONGO_URI y JWT_SECRET si es necesario
npm install
npm run dev               # http://localhost:5000
```

Al arrancar correctamente debe mostrar:

```
Servidor corriendo en http://localhost:5000
MongoDB conectado: 127.0.0.1
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

> **Nota:** el frontend debe correr en el puerto `5173`, que es el que el backend
> autoriza por CORS a través de la variable `CLIENT_URL`.

### Variables de entorno

**`backend/.env`**

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor Express | `5000` |
| `MONGO_URI` | Cadena de conexión a MongoDB | `mongodb://127.0.0.1:27017/inventory_system` |
| `JWT_SECRET` | Clave para firmar los tokens JWT | — (obligatoria) |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `1d` |
| `CLIENT_URL` | Origen permitido por CORS | `http://localhost:5173` |

**`frontend/.env`**

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API REST | `http://localhost:5000/api` |

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
