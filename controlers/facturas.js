const { generaError } = require("../utils/errors");
const options = require("../utils/paramsCLI");
let facturasJSON = require("../facturas.json").facturas;
const Factura = require("../db/models/factura");


const getFacturas = async (queryParams, tipo) => {
  let facturas;
  if (options.datos.toLowerCase() === "json") {
    if (tipo) {
      facturas = facturasJSON.filter(factura => factura.tipo === tipo);
    } else {
      facturas = facturasJSON;
    }
  } else if (options.datos.toLowerCase() === "mysql") {
    if (tipo) {
      facturas = await Factura.findAll(
        {
          where: {
            tipo: tipo
          }
        }
      );
    } else {
      facturas = Factura.findAll();
    }
  } else {
    return generaError("El origen debe ser 'JSON' o 'MySQL'", 400);
  }

  if (queryParams.abonadas) {
    facturas = facturas.filter(factura => {
      if (queryParams.abonadas === factura.abonada.toString()) {
        return factura;
      }
    });
  }
  if (queryParams.vencidas) {
    facturas = facturas.filter(factura => {
      if (queryParams.vencidas) {
        if (queryParams.vencidas === "true") {
          return +factura.vencimiento < new Date().getTime();
        } else {
          return +factura.vencimiento > new Date().getTime();
        }
      } else {
        return factura;
      }
    });
  }
  if (queryParams.ordenPor) {
    if (!queryParams.orden || queryParams.orden === "asc" || queryParams.ordenPor === "") {
      if (queryParams.ordenPor === "fecha") {
        facturas.sort((a, b) => (a.fecha > b.fecha) ? 1 : -1);
      } else if (queryParams.ordenPor === "base") {
        facturas.sort((a, b) => (a.base > b.base) ? 1 : -1);
      }
    } else if (queryParams.orden === "desc") {
      if (queryParams.ordenPor === "fecha") {
        facturas.sort((a, b) => (a.fecha < b.fecha) ? 1 : -1);
      } else if (queryParams.ordenPor === "base") {
        facturas.sort((a, b) => (a.base < b.base) ? 1 : -1);
      }
    }
  }
  if (queryParams.nPorPagina) {
    if (queryParams.pagina) {
      return facturas.slice(+queryParams.pagina * +queryParams.nPorPagina, (+queryParams.pagina + 1) * +queryParams.nPorPagina);
    } else {
      return facturas.slice(0, +queryParams.nPorPagina);
    }
  }
  return facturas;
};

const getFactura = async id => {
  let factura;
  if (options.datos.toLowerCase() === "json") {
    factura = facturasJSON.find(factura => factura.id === id);
  } else if (options.datos.toLowerCase() === "mysql") {
    factura = await Factura.findByPk(id);
  } else {
    return generaError("El origen debe ser 'JSON' o 'MySQL'", 400);
  }
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

const crearFactura = async nuevaFactura => {
  const respuesta = {
    factura: null,
    error: null
  };
  const error = generaError("Ya existe la factura", 409);

  if (options.datos.toLowerCase() === "json") {
    if (facturasJSON.find(factura => +factura.numero === +nuevaFactura.numero)) {
      respuesta.error = error;
    }
    if (!respuesta.error) {
      nuevaFactura.id = facturasJSON[facturasJSON.length - 1].id + 1;
      facturasJSON.push(nuevaFactura);
      respuesta.factura = nuevaFactura;
    }
  } else if (options.datos.toLowerCase() === "mysql") {
    const facturaExistente = await Factura.findOne({
      where: {
        numero: +facturaExistente.numero,
      }
    });
    if (facturaExistente) {
      const error = generaError("Ya existe el alumno", 409);
      respuesta.error = error;
    } else {
      const nuevaFacturaBD = await Factura.create(nuevaFactura);
      respuesta.factura = nuevaFacturaBD;
    }
  } else {
    return generaError("El origen debe ser 'JSON' o 'MySQL'", 400);
  }

  return respuesta;
};

const sustituirFactura = async (idFactura, facturaModificado) => {
  const respuesta = {
    factura: null,
    error: null
  };
  const errores = () => {

  };
  if (options.datos.toLowerCase() === "json") {

  } else if (options.datos.toLowerCase() === "mysql") {

  } else {
    return generaError("El origen debe ser 'JSON' o 'MySQL'", 400);
  }
  const factura = facturasJSON.find(factura => factura.id === idFactura);
  if (factura) {
    facturaModificado.id = factura.id;
    facturasJSON[facturasJSON.indexOf(factura)] = facturaModificado;
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

const modificarFactura = async (idFactura, cambios) => {

  const factura = facturasJSON.find(factura => factura.idFactura === idFactura);
  const respuesta = {
    factura: null,
    error: null
  };
  const facturaModificado = {
    ...factura,
    ...cambios
  };
  facturasJSON[facturasJSON.indexOf(factura)] = facturaModificado;
  respuesta.factura = facturaModificado;

  return respuesta;
};

const borrarFactura = idFactura => {
  const respuesta = {
    factura: null,
    error: null
  };
  const factura = facturasJSON.find(factura => factura.id === idFactura);
  facturasJSON = facturasJSON.filter(factura => factura.id !== idFactura);
  respuesta.factura = factura;
  return respuesta;
};


module.exports = {
  getFacturas,
  getFactura,
  crearFactura,
  sustituirFactura,
  modificarFactura,
  borrarFactura
};
