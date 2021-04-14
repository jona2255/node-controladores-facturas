
const Proyecto = require("../db/models/proyecto");
const { generaError } = require("../utils/errors");

const getProyectos = async (queryParams, estado) => {
  const estadoProyecto = estado
    ? {
      estado
    }
    : {};
  const proyectos = await Proyecto
    .find(estadoProyecto,)
    .select({ __v: 0, _id: 0 });
  return proyectos;
};

const getProyecto = async id => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyecto = await Proyecto.findById(id);
  if (proyecto) {
    respuesta.proyecto = proyecto;
  } else {
    const error = generaError("El proyecto solicitado no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};
const crearProyecto = async nuevoProyecto => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyectoEncontrado = await Proyecto.findOne({
    nombre: nuevoProyecto.nombre,
  });
  if (proyectoEncontrado) {
    const error = generaError("Ya existe el proyecto", 409);
    respuesta.error = error;
  } else {
    const nuevoProyectoBD = await Proyecto.create(nuevoProyecto);
    respuesta.proyecto = nuevoProyectoBD;
  }
  return respuesta;
};

const sustituirProyecto = async (idProyecto, proyectoModificado) => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyectoEncontrado = await Proyecto.findById(idProyecto);
  if (proyectoEncontrado) {
    await proyectoEncontrado.updateOne(proyectoModificado);
    respuesta.proyecto = proyectoModificado;
  } else {
    const { proyecto, error } = await crearProyecto(proyectoModificado);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.proyecto = proyecto;
    }
  }
  return respuesta;
};

const modificarProyecto = async (idProyecto, cambios) => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyecto = await Proyecto.findByIdAndUpdate(idProyecto, cambios);
  if (proyecto) {
    respuesta.proyecto = proyecto;
  } else {
    const error = generaError("El proyecto solicitado no existe", 404);
    respuesta.error = error;
  }

  return respuesta;
};

const borrarProyecto = async idProyecto => {
  const proyectoEncontrado = await Proyecto.findByIdAndDelete(idProyecto);
  const respuesta = {
    proyecto: null,
    error: null
  };
  if (proyectoEncontrado) {
    respuesta.proyecto = proyectoEncontrado;
  } else {
    const error = generaError("El proyecto solicitado no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};


module.exports = {
  getProyectos,
  getProyecto,
  crearProyecto,
  sustituirProyecto,
  modificarProyecto,
  borrarProyecto
};
