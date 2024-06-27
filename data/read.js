import { performance } from 'perf_hooks'

import { sql, eq } from 'drizzle-orm'
import * as schema from '../db/schema.js'

const { reviews, reviewsPhotos } = schema

import { connect } from '../db/client.js'
const db = await connect()


const read = async () => {

  const start = performance.now()

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

  const end = performance.now()

  // console.log(JSON.stringify(result, null, 2))
  console.log(result)
  console.log(`time: ${end - start}ms`)

  process.exit()
  return true
}

read()