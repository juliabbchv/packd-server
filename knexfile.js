import "dotenv/config";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    database: process.env.DB_NAME || "packd",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "rootroot",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    charset: "utf8",
    multipleStatements: true,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./migrations",
    extension: "js",
  },
  seeds: {
    directory: "./seeds",
    extension: "js",
  },
};
