import 'dotenv/config.js'

import { drizzle } from 'drizzle-orm/node-postgres';
import { sql, eq } from 'drizzle-orm'
import * as schema from '../db/schema.js'
import pg from 'pg'
const { Client } = pg
const { reviews, reviewsPhotos } = schema

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

  const result = await db.select({
    id: reviews.id,
    product_id: reviews.product_id,
    rating: reviews.rating,
    date: reviews.date,
    summary: reviews.summary,
    body: reviews.body,
    recommend: reviews.recommend,
    reported: reviews.reported,
    reviewer_name: reviews.reviewer_name,
    reviewer_email: reviews.reviewer_email,
    response: reviews.response,
    helpfulness: reviews.helpfulness,
    photos: sql`coalesce(array_agg(json_build_object('id', reviews_photos.id, 'url', url)) filter (where reviews_photos.id is not null), '{}')`
  })
  .from(reviews)
  .leftJoin(reviewsPhotos, eq(reviews.id, reviewsPhotos.review_id))
  .groupBy(reviews.id)
  .limit(5)

  // console.log(JSON.stringify(result, null, 2))
  console.log(result)

  process.exit()
  return true
}

read()