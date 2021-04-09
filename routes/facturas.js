const express = require("express");
const { checkSchema, check } = require("express-validator");
const { generaError, badRequestError, idNoExisteError } = require("../utils/errors");
const {
  getFacturas, getFactura, crearFactura, borrarFactura, modificarFactura, sustituirFactura
} = require("../controlers/facturas");
const facturasJSON = require("../facturas.json");
const router = express.Router();

const compruebaId = idFactura => facturasJSON.find(factura => factura.id === +idFactura);

const estructuraFacturas = facturas => ({
  total: facturas.length,
  datos: facturas
});

const getFacturaSchema = () => {
  const numero = {
    errorMessage: "Debes poner un número",
    notEmpty: true
  };
  const fecha = {
    errorMessage: "Falta La fecha de la factura",
    notEmpty: true
  };
  const vencimiento = {
    errorMessage: "Debes poner una fecha de vencimiento en formato Timestamp",
  };
  const concepto = {
    errorMessage: "Falta el concepto de la factura",
  };
  const base = {
    isFloat: {
      errorMessage: "La base imponible debe ser mayor a 0",
      notEmpty: true,
      options: {
        min: 0
      },
    }
  };
  const tipoIva = {
    isInt: {
      errorMessage: "El tipo del iva tiene que ser un entero",
      notEmpty: true
    }
  };
  const tipo = {
    errorMessage: "Falta el tipo de la factura",
    notEmpty: true
  };
  const abonada = {
    errorMessage: "Se debe de poner si la factura está abonada o no",
    notEmpty: true
  };
  return {
    numero,
    fecha,
    vencimiento,
    concepto,
    base,
    tipoIva,
    tipo,
    abonada
  };
};

router.get("/", async (req, res, next) => {
  const queryParams = req.query;
  const listaFacturas = await getFacturas(queryParams);
  res.json(estructuraFacturas(listaFacturas));
});
router.get("/ingresos", async (req, res, next) => {
  const queryParams = req.query;
  const listaFacturas = await getFacturas(queryParams, "ingreso");
  res.json(estructuraFacturas(listaFacturas));
});
router.get("/gastos", async (req, res, next) => {
  const queryParams = req.query;
  const listaFacturas = await getFacturas(queryParams, "gasto");
  res.json(estructuraFacturas(listaFacturas));
});
router.get("/factura/:idFactura", async (req, res, next) => {
  const idFactura = + req.params.idFactura;
  const { factura, error } = await getFactura(idFactura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});
const comprobarTipoFactura = tipo => tipo !== "ingreso" && tipo !== "gasto";
router.post("/factura",
  checkSchema(getFacturaSchema()),
  (req, res, next) => {
    const error400 = badRequestError(req);
    const nuevaFactura = req.body;
    if (error400) {
      return next(error400);
    } else if (comprobarTipoFactura(nuevaFactura.tipo)) {
      return next(generaError("El tipo debe ser 'ingreso' o 'gasto'", 400));
    }
    const { factura, error } = crearFactura(nuevaFactura);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });

router.put("/factura/:idFactura",
  checkSchema(getFacturaSchema()),
  (req, res, next) => {
    const error400 = badRequestError(req);
    const idFactura = +req.params.idFactura;
    const facturaModificado = req.body;
    if (error400) {
      return next(error400);
    } else if (comprobarTipoFactura(facturaModificado.tipo)) {
      return next(generaError("El tipo debe ser 'ingreso' o 'gasto'", 400));
    }
    const { error, factura } = sustituirFactura(idFactura, facturaModificado);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });


router.patch("/factura/:idFactura",
  checkSchema(getFacturaSchema()),
  check("idFactura", "No existe el factura").custom(compruebaId),
  (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const errorIdNoExiste = idNoExisteError(req);
    const idFactura = +req.params.idFactura;
    const facturaModificado = req.body;
    if (errorIdNoExiste) {
      return next(errorIdNoExiste);
    } else if (comprobarTipoFactura(facturaModificado.tipo)) {
      return next(generaError("El tipo debe ser 'ingreso' o 'gasto'", 400));
    }
    const { error, factura } = modificarFactura(idFactura, facturaModificado);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });

router.delete("/factura/:idFactura",
  check("idFactura", "No existe la factura").custom(compruebaId),
  (req, res, next) => {
    const errorIdNoExiste = idNoExisteError(req);
    if (errorIdNoExiste) {
      return next(errorIdNoExiste);
    }
    const idFactura = +req.params.idFactura;
    const { error, factura } = borrarFactura(idFactura);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });
module.exports = router;
