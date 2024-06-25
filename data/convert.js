import * as fs from 'fs'
import * as readline from 'readline'
import csv from 'csv-parser'

import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";

import { reviews } from '../db/schema.js'

import pg from "pg";
const { Client } = pg;

const convert = async () => {
  const client = new Client({
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "sdc",
  });
  await client.connect();
  const db = drizzle(client);

  const results = []

  const fsStream = fs.createReadStream('./reviews.csv')
  const csvStream = csv()

  fsStream
    .pipe(csvStream)
    .on('data', async (data) => {
      if (results.length >= 5) {
        fsStream.unpipe(csvStream)
        csvStream.end()
        fsStream.destroy()
      } else {
        data.date = new Date(Number(data.date))
        results.push(data)
        console.log(data)
        await db.insert(reviews).values(data)
      }
    })
    .on('end', () => console.log('done'))

    return
}

convert()
