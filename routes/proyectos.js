
const express = require("express");
const { generaError, badRequestError, idNoExisteError } = require("../utils/errors");
const {
  getProyectos, getProyecto, crearProyecto, borrarProyecto, modificarProyecto, sustituirProyecto
} = require("../controlers/proyectos");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const queryParams = req.query;
  const listaProyectos = await getProyectos(queryParams);
  listaProyectos.codigo === 400 && next(listaProyectos);
  res.json(listaProyectos);
});
router.get("/pendientes", async (req, res, next) => {
  const queryParams = req.query;
  const listaProyectos = await getProyectos(queryParams, "pendiente");
  listaProyectos.codigo === 400 && next(listaProyectos);
  res.json(listaProyectos);
});
router.get("/en-progreso", async (req, res, next) => {
  const queryParams = req.query;
  const listaProyectos = await getProyectos(queryParams, "wip");
  listaProyectos.codigo === 400 && next(listaProyectos);
  res.json(listaProyectos);
});
router.get("/finalizados", async (req, res, next) => {
  const queryParams = req.query;
  const listaProyectos = await getProyectos(queryParams, "finalizado");
  listaProyectos.codigo === 400 && next(listaProyectos);
  res.json(listaProyectos);
});
router.get("/proyecto/:idProyecto", async (req, res, next) => {
  const idProyecto = req.params.idProyecto;
  const { proyecto, error } = await getProyecto(idProyecto);
  if (error) {
    next(error);
  } else {
    res.json(proyecto);
  }
});
router.post("/proyecto", async (req, res, next) => {
  const error400 = badRequestError(req);
  const nuevoProyecto = req.body;
  if (error400) {
    return next(error400);
  }
  const { proyecto, error } = await crearProyecto(nuevoProyecto);
  if (error) {
    next(error);
  } else {
    res.json(proyecto);
  }
});
router.put("/proyecto/:idProyecto", async (req, res, next) => {
  const error400 = badRequestError(req);
  if (error400) {
    return next(error400);
  }
  const idProyecto = req.params.idProyecto;
  const proyectoModificado = req.body;
  const { proyecto, error } = await sustituirProyecto(idProyecto, proyectoModificado);
  if (error) {
    next(error);
  } else {
    res.json(proyecto);
  }
});

router.patch("/proyecto/:idProyecto", async (req, res, next) => {
  const error400 = badRequestError(req);
  if (error400) {
    return next(error400);
  }
  const idProyecto = req.params.idProyecto;
  const proyectoModificado = req.body;
  const { proyecto, error } = await sustituirProyecto(idProyecto, proyectoModificado);
  if (error) {
    next(error);
  } else {
    res.json(proyecto);
  }
});

router.delete("/proyecto/:idProyecto",
  // check("id", "No existe el proyecto").custom(compruebaId),
  async (req, res, next) => {
    const idProyecto = req.params.idProyecto;
    const { proyecto, error } = await borrarProyecto(idProyecto);
    if (error) {
      next(error);
    } else {
      res.json(proyecto);
    }
  });

module.exports = router;
