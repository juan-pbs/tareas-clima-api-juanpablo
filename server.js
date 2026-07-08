require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(helmet());              // cabeceras de seguridad HTTP
app.use(express.json());        // lectura de peticiones JSON
app.use(morgan('dev'));         // registro de peticiones

// Ruta de prueba con validacion de datos
app.post(
  '/api/echo',
  body('mensaje').isString().trim().isLength({ min: 1, max: 200 }).escape(),
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    res.json({ recibido: req.body.mensaje });
  }
);

app.post(
  '/api/registro',
  [
    // Principio: nunca confiar en la entrada del usuario; por eso se valida antes de procesarla.
    body('nombre')
      .trim()
      .notEmpty()
      .withMessage('El nombre no puede estar vacio')
      .escape(),
    body('correo')
      .trim()
      .isEmail()
      .withMessage('El correo debe tener un formato valido')
      .normalizeEmail()
  ],
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    res.status(201).json({
      mensaje: 'Registro recibido correctamente',
      usuario: {
        nombre: req.body.nombre,
        correo: req.body.correo
      }
    });
  }
);

app.get('/api/salud', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
