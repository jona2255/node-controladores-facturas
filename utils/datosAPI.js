const fetch = require("node-fetch");

const facturasJSON = fetch(`${process.env.URL_API_FACTURAS}:${process.env.PUERTO_API_FACTURAS}/facturas`)
  .then(resp => resp.json());

module.exports = facturasJSON;
