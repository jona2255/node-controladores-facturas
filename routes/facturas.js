const express = require("express");
const { checkSchema, check, validationResult } = require("express-validator");
const { getFacturas, getFactura, getFacturasIngresos, getFacturasGastos } = require("../controlers/facturas");
const facturasJSON = require("../utils/datosAPI");

const router = express.Router();

const estructuraFacturas = facturas => ({
  total: facturas.length,
  datos: facturas
});

router.get("/", (req, res, next) => {
  const listaFacturas = getFacturas();
  listaFacturas.then(facturas => res.json(
    estructuraFacturas(facturas)
  ));
});
router.get("/ingresos", (req, res, next) => {
  const listaFacturas = getFacturasIngresos();
  listaFacturas.then(facturas => res.json(
    estructuraFacturas(facturas)
  ));
});
router.get("/gastos", (req, res, next) => {
  const listaFacturas = getFacturasGastos();
  listaFacturas.then(facturas => res.json(
    estructuraFacturas(facturas)
  ));
});
router.get("/factura/:idFactura", (req, res, next) => {
  const idFactura = + req.params.idFactura;
  const { factura, error } = getFactura(idFactura);
  if (error) {
    next(error);
  } else {
    factura.then(factura => res.json(factura));
  }
});

module.exports = router;
