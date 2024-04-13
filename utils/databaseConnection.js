const Sequelize = require("sequelize");

const dbName = process.env.DB_NAME || "birthday-app";
const dbUsername = process.env.DB_USERNAME || "root";
const dbPassword = process.env.DB_PASSWORD || "";
const host = process.env.DB_HOST || "localhost";
const dialect = process.env.DB_DIALECT || "mysql";

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  host,
  dialect,
});

module.exports = sequelize;
