// import { reviews, reviewsPhotos } from '../db/schema.js'
import * as schema from '../db/schema.js'
import { sql, eq, and, asc, desc, count } from 'drizzle-orm'

import { connect } from '../db/client.js'
const db = await connect(schema)
const { reviews } = schema

export const getReviews = async (req, res) => {
  const product_id = req.query['product_id']
  if (!product_id) {
    res.sendStatus(404)
  } else {
    const limit = Number(req.query['count']) || 5
    const page = Number(req.query['page']) || 1
    const offset = (page - 1) * limit
    const sort = req.query['sort']
    const orderBy = sort === 'newest' ? desc(reviews.date) : sort === 'helpful' ? desc(reviews.helpfulness) : asc(reviews.id)
    // const results = await db.select({
    //   id: reviews.id,
    //   product_id: reviews.product_id,
    //   rating: reviews.rating,
    //   date: reviews.date,
    //   summary: reviews.summary,
    //   body: reviews.body,
    //   recommend: reviews.recommend,
    //   reported: reviews.reported,
    //   reviewer_name: reviews.reviewer_name,
    //   reviewer_email: reviews.reviewer_email,
    //   response: reviews.response,
    //   helpfulness: reviews.helpfulness,
    //   photos: sql`coalesce(array_agg(json_build_object('id', reviews_photos.id, 'url', url)) filter (where reviews_photos.id is not null), '{}')`
    // })
    // .from(reviews)
    // .leftJoin(reviewsPhotos, eq(reviews.id, reviewsPhotos.review_id))
    // .groupBy(reviews.id)
    // .where(eq(reviews.product_id, product_id))
    // .limit(count)

    const results = await db.query.reviews.findMany({
      columns: {
        reviewer_email: false,
        reported: false,
      },
      with: {
        photos: {
          columns: {
            review_id: false
          }
        }
      },
      where: and(eq(reviews.reported, false), eq(reviews.product_id, product_id)),
      limit,
      offset,
      orderBy
    })

    res.json({
      product: product_id,
      page,
      count: limit,
      results
    })
  }
}

export const getMeta = async (req, res) => {
  const product_id = req.query['product_id']
  if (!product_id) {
    res.sendStatus(404)
  } else {

    const counts = Array.from({length: 5}, (v, i) => db.select({rating: count(reviews.id)}).from(reviews).where(and(eq(reviews.rating, i + 1), eq(reviews.product_id, product_id))))
    const count3 = db.select({rating: count(reviews.id)}).from(reviews).where(and(eq(reviews.rating, 3), eq(reviews.product_id, product_id)))
    const count4 = db.select({rating: count(reviews.id)}).from(reviews).where(and(eq(reviews.rating, 4), eq(reviews.product_id, product_id)))

    const recommended = db.execute(sql`with recommends_true as (select count(id), recommend from reviews where product_id = 2 and recommend = true group by recommend), recommends_false as (select count(id), recommend from reviews where product_id = 2 and recommend = false group by recommend) select json_build_object('false', recommends_false.count, 'true', recommends_true.count) as recommended from recommends_true, recommends_false;`)

    const characteristics = db.execute(sql`with characteristic_avgs as (select name, characteristic_id as id, avg(value) as value from characteristic_reviews join characteristics on characteristic_id = characteristics.id where product_id = 1 group by characteristic_id, name) select json_object_agg(name, json_build_object('id', id, 'value', value)) as chars from characteristic_avgs`)

    const responses = await Promise.all([...counts, recommended, characteristics])

    console.log(responses[5])
    res.json({
      product_id,
      ratings: {
        1: responses[0][0].rating,
        2: responses[1][0].rating,
        3: responses[2][0].rating,
        4: responses[3][0].rating,
        5: responses[4][0].rating,
      },
      recommended: responses[5].rows[0].recommended,
      characteristics: responses[6].rows[0].chars
    })
  }
}