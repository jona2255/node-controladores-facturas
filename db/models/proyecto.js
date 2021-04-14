const { Schema, model } = require("mongoose");

const ProyectoSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    required: true
  },
  aprobado: {
    type: String,
    required: true
  },
  entrega: {
    type: String,
    required: true
  },
  cliente: {
    type: String,
    required: true
  },
  tecnologias: {
    type: [String],
    required: true
  },
});

const Proyecto = model("Proyecto", ProyectoSchema, "proyectos");

module.exports = Proyecto;
