require("dotenv").config();
const debug = require("debug")("alumnos:db");
const { Sequelize } = require("sequelize");
const chalk = require("chalk");

const sequelize = new Sequelize({
  host: "localhost",
  database: "facturas",
  username: "jona",
  password: "password",
  dialect: "mysql",
  logging: mensaje => debug(chalk.blue("Ésta es la consulta SQL: "), chalk.green(mensaje))
});

module.exports = sequelize;
