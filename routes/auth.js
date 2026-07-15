const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const verificarToken = require('../middleware/auth');
const usuariosModel = require('../models/usuarios');

const router = express.Router();

function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
  next();
}

router.post(
  '/registro',
  [
    body('correo').trim().isEmail().withMessage('El correo debe tener un formato valido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres'),
    validar
  ],
  async (req, res) => {
    const { correo, password } = req.body;
    if (usuariosModel.buscarPorCorreo(correo)) {
      return res.status(409).json({ error: 'El correo ya esta registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const usuario = usuariosModel.crear(correo, hash);

    return res.status(201).json({ id: usuario.id, correo: usuario.correo });
  }
);

router.post(
  '/login',
  [
    body('correo').trim().isEmail().withMessage('El correo debe tener un formato valido').normalizeEmail(),
    body('password').notEmpty().withMessage('El password es obligatorio'),
    validar
  ],
  async (req, res) => {
    const { correo, password } = req.body;
    const usuario = usuariosModel.buscarPorCorreo(correo);
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const datosToken = { id: usuario.id, correo: usuario.correo };
    const token = jwt.sign(datosToken, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token });
  }
);

router.get('/perfil', verificarToken, (req, res) => {
  res.json(req.usuario);
});

module.exports = router;
