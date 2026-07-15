let usuarios = [];
let siguienteId = 1;

module.exports = {
  buscarPorCorreo: (correo) => usuarios.find((usuario) => usuario.correo === correo),
  crear: (correo, hashPassword) => {
    const nuevo = { id: siguienteId++, correo, password: hashPassword };
    usuarios.push(nuevo);
    return nuevo;
  }
};
