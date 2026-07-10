const express = require('express');
const { param, validationResult } = require('express-validator');
const { obtenerClima } = require('../services/clima');

const router = express.Router();

function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
}

const validarCiudad = param('ciudad')
  .trim()
  .notEmpty()
  .withMessage('La ciudad no puede estar vacia')
  .matches(/^[A-Za-zÀ-ÿ\s.'-]+$/)
  .withMessage('La ciudad contiene caracteres invalidos');

router.get('/', (req, res) => {
  res.status(400).json({ error: 'La ciudad no puede estar vacia' });
});

// GET /api/clima/:ciudad - clima independiente de una ciudad
router.get('/:ciudad', validarCiudad, validar, async (req, res) => {
  try {
    const clima = await obtenerClima(req.params.ciudad);
    res.status(200).json(clima);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

module.exports = router;
