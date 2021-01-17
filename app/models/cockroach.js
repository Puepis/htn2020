const Sequelize = require("sequelize-cockroachdb");

const dbhost = process.env.DB_HOST;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const db = process.env.DB_NAME;

// Connect to CockroachDB through Sequelize.
var sequelize = new Sequelize(db, username, password, {
  host: dbhost,
  dialect: "postgres",
  port: 26257,
  logging: false,
  dialectOptions: {
    ssl: {
      ca: process.env.CK_CERT,
    },
  },
});

// Define the User model for the "users" table.
module.exports.User = sequelize.define("users", {
  prompt: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gh_token: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  pin: {
    type: Sequelize.INTEGER,
  },
});
