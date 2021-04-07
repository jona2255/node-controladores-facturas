const fetch = require("node-fetch");

module.exports = fetch(`${process.env.URL_API_FACTURAS}:${process.env.PUERTO_API_FACTURAS}/facturas`)
  .then(resp => resp.json());
