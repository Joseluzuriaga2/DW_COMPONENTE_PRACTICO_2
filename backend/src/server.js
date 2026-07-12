require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Conexión a la base de datos
connectDB();

// Middlewares globales
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de verificación de estado del servidor
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API del Sistema de Inventario activa' });
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Manejo de rutas no encontradas y errores
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
