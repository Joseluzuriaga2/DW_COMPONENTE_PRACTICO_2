/**
 * Reglas de validación compartidas por los formularios de autenticación.
 * Replican las del backend (User.js y authRoutes.js) para que el cliente
 * rechace los datos inválidos antes de enviar la petición.
 */

// Mismo patrón que el esquema de Mongoose en backend/src/models/User.js
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export const MIN_PASSWORD_LENGTH = 6;
export const MIN_NAME_LENGTH = 2;

export const validateName = (name) => {
  if (!name.trim()) return 'El nombre es obligatorio';
  if (name.trim().length < MIN_NAME_LENGTH) {
    return `El nombre debe tener al menos ${MIN_NAME_LENGTH} caracteres`;
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email.trim()) return 'El correo electrónico es obligatorio';
  if (!EMAIL_REGEX.test(email.trim())) return 'Correo electrónico inválido';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
  }
  return '';
};
