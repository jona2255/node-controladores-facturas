const express = require("express");
const { checkSchema, check, validationResult } = require("express-validator");
const { getFacturas, getFactura } = require("../controlers/facturas");
const facturasJSON = require("../utils/datosAPI");

const router = express.Router();

router.get("/", (req, res, next) => {
  const listaFacturas = getFacturas();
  listaFacturas.then(facturas => res.json(
    {
      total: facturas.length,
      datos: facturas
    }
  ));
});

router.get("/factura/:id", (req, res, next) => {
  const idFactura = + req.params.id;
  const { factura, error } = getFactura(idFactura);
  if (error) {
    next(error);
  } else {
    factura.then(factura => res.json(factura));
  }
});

module.exports = router;
