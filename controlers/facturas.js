const { generaError } = require("../utils/errors");
let facturasJSON = require("../facturas.json");

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

const sustituirFactura = (idFactura, facturaModificado) => {
  const factura = facturasJSON.facturas.find(factura => factura.id === idFactura);
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {
    facturaModificado.id = factura.id;
    facturasJSON.facturas[facturasJSON.facturas.indexOf(factura)] = facturaModificado;
    respuesta.factura = facturaModificado;
  } else {
    const { error, factura } = crearFactura(facturaModificado);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.factura = factura;
    }
  }
  return respuesta;
};

const modificarFactura = (idFactura, cambios) => {
  const factura = facturasJSON.facturas.find(factura => factura.id === idFactura);
  const respuesta = {
    factura: null,
    error: null
  };
  const facturaModificado = {
    ...factura,
    ...cambios
  };
  facturasJSON.facturas[facturasJSON.facturas.indexOf(factura)] = facturaModificado;
  respuesta.factura = facturaModificado;
  return respuesta;
};

const borrarFactura = idFactura => {
  const respuesta = {
    factura: null,
    error: null
  };
  const factura = facturasJSON.facturas.find(factura => factura.id === idFactura);
  facturasJSON.facturas = facturasJSON.facturas.filter(factura => factura.id !== idFactura);
  respuesta.factura = factura;
  return respuesta;
};


module.exports = {
  getFacturas,
  getFactura,
  getFacturasIngresos,
  getFacturasGastos,
  crearFactura,
  sustituirFactura,
  modificarFactura,
  borrarFactura
};
