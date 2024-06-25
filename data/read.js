import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from '../db/schema.js'

import pg from "pg";
const { Client } = pg;

const read = async () => {
  const client = new Client({
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "sdc",
  });
  await client.connect();
  const db = drizzle(client, { schema });

  const reviews = await db.query.reviews.findMany()
  console.log(reviews)
  console.log(typeof reviews[0].date)
  return
}

read()
