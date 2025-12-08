// src/db.js
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "truesales",
  user: "postgres",
  password: "1234",  
  max: 10,
  idleTimeoutMillis: 30000
});

export default pool;
