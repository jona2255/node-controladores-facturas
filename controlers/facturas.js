const { generaError } = require("../utils/errors");
const facturasJSON = require("../utils/datosAPI");

const getFacturas = () => facturasJSON;
const getFacturasIngresos = () => facturasJSON.then(factura => factura.filter(factura => factura.tipo === "ingreso"));
const getFacturasGastos = () => facturasJSON.then(factura => factura.filter(factura => factura.tipo === "gasto"));

const getFactura = id => {
  const factura = facturasJSON.then(factura => factura.find(factura => factura.id === id));
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {
    respuesta.factura = factura;
  } else {
    const error = generaError("La factura solicitado no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};

module.exports = {
  getFacturas,
  getFactura,
  getFacturasIngresos,
  getFacturasGastos
};
