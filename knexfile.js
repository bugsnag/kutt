const env = require("./production-server/env").default;

module.exports = {
  production: {
    client: "postgresql",
    connection: {
      host: env.DB_HOST,
      port: parseInt(env.DB_PORT, 10),
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      ssl: env.DB_SSL,
    },
    migrations: {
      directory: "./production-server/migrations",
      loadExtensions: [".js"]
    },
  },
};