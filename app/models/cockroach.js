const Sequelize = require("sequelize-cockroachdb");
const DataTypes = Sequelize.DataTypes;

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
    type: DataTypes.STRING,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gh_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pin: {
    type: DataTypes.INTEGER,
  },
});

module.exports.userToJSON = (user) => {
  return {
    prompt: user.name,
    email: user.email,
    gh_token: user.gh_token,
  };
};

module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;
