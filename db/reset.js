import { drizzle } from "drizzle-orm/node-postgres"
import { sql } from 'drizzle-orm'

import pg from "pg";
const { Client } = pg;

const reset = async () => {
  const client = new Client({
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "sdc",
  });
  await client.connect();
  const db = drizzle(client);

  await db.execute(sql`drop table reviews cascade`)
  console.log('dropped reviews')
  await db.execute(sql`drop table reviews_photos cascade`)
  console.log('dropped reviews_photos')
  await db.execute(sql`drop table characteristics cascade`)
  console.log('dropped characteristics')
  await db.execute(sql`drop table characteristic_reviews cascade`)
  console.log('dropped characteristic_reviews')
  console.log('done')

  process.exit()
}

reset()