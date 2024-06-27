import 'dotenv/config'

import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg";
const { Client } = pg;

const connect = async (schema = {}) => {
  const client = new Client({ connectionString: process.env.DB_URL });
  await client.connect();
  return drizzle(client, { schema });
}

export { connect }