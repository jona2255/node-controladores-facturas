const { generaError } = require("../utils/errors");
const facturasJSON = require("../facturas.json");

const getFacturas = () => facturasJSON.facturas;
const getFacturasIngresos = () => facturasJSON.facturas.filter(factura => factura.tipo === "ingreso");
const getFacturasGastos = () => facturasJSON.facturas.filter(factura => factura.tipo === "gasto");

const getFactura = id => {
  const factura = facturasJSON.facturas.find(factura => factura.id === id);
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

const crearFactura = nuevaFactura => {
  const respuesta = {
    factura: null,
    error: null
  };
  if (facturasJSON.facturas.find(factura => +factura.numero === +nuevaFactura.numero)) {
    const error = generaError("Ya existe la factura", 409);
    respuesta.error = error;
  }
  if (!respuesta.error) {
    nuevaFactura.id = facturasJSON.facturas[facturasJSON.facturas.length - 1].id + 1;
    facturasJSON.facturas.push(nuevaFactura);
    respuesta.factura = nuevaFactura;
  }
  return respuesta;
};

module.exports = {
  getFacturas,
  getFactura,
  getFacturasIngresos,
  getFacturasGastos,
  crearFactura
};
