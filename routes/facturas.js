const express = require("express");
const { checkSchema, check, validationResult } = require("express-validator");
const { badRequestError } = require("../utils/errors");
const { getFacturas, getFactura, getFacturasIngresos, getFacturasGastos, crearFactura } = require("../controlers/facturas");

const router = express.Router();

const estructuraFacturas = facturas => ({
  total: facturas.length,
  datos: facturas
});

const getFacturaSchema = () => {
  const numero = {
    isLength: {
      errorMessage: "El número tiene que tener 4 caracteres como mínimo",
      options: {
        min: 4
      }
    }
  };
  const fecha = {
    errorMessage: "Falta La fecha de la factura",
  };
  const vencimiento = {
    errorMessage: "Falta La fecha de la factura",
    isEmpty: true
  };
  const concepto = {
    errorMessage: "Falta La fecha de la factura",
    isEmpty: true
  };
  const base = {
    isFloat: {
      errorMessage: "La nota debe ser mayor a 0",
      options: {
        min: 0
      }
    }
  };
  const tipoIva = {
    isInteger: {
      errorMessage: "El nombre tiene que tener 2 caracteres como mínimo",
      options: {
        min: 2
      }
    }
  };
  const tipo = {
    errorMessage: "Falta el tipo de la factura",
  };
  const abonada = {
    errorMessage: "Se debe de poner si la factura está abonada o no",
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

router.get("/", (req, res, next) => {
  const listaFacturas = getFacturas();
  console.log(listaFacturas);
  res.json(estructuraFacturas(listaFacturas));
});
router.get("/ingresos", (req, res, next) => {
  const listaFacturas = getFacturasIngresos();
  res.json(estructuraFacturas(listaFacturas));
});
router.get("/gastos", (req, res, next) => {
  const listaFacturas = getFacturasGastos();
  res.json(estructuraFacturas(listaFacturas));
});
router.get("/factura/:idFactura", (req, res, next) => {
  const idFactura = + req.params.idFactura;
  const { factura, error } = getFactura(idFactura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

router.post("/factura",
  checkSchema(getFacturaSchema),
  (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const nuevaFactura = req.body;
    const { factura, error } = crearFactura(nuevaFactura);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });


module.exports = router;
