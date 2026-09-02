const { Pool } = require("pg");
require("dotenv").config();

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:alone15@localhost:5432/atlas";

const pool = new Pool({ connectionString });

module.exports = { pool };
