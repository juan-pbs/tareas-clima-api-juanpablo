let tareas = [
  { id: 1, titulo: 'Revisar documentacion de la API', completada: false },
  { id: 2, titulo: 'Configurar certificado HTTPS', completada: true }
];

let siguienteId = 3;

module.exports = {
  obtenerTodas: () => tareas,
  obtenerPorId: (id) => tareas.find((tarea) => tarea.id === id),
  crear: (titulo) => {
    const nueva = { id: siguienteId++, titulo, completada: false };
    tareas.push(nueva);
    return nueva;
  },
  actualizar: (id, datos) => {
    const tarea = tareas.find((item) => item.id === id);
    if (!tarea) return null;
    Object.assign(tarea, datos);
    return tarea;
  },
  eliminar: (id) => {
    const indice = tareas.findIndex((tarea) => tarea.id === id);
    if (indice === -1) return false;
    tareas.splice(indice, 1);
    return true;
  }
};
