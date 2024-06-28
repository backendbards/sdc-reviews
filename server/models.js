import { performance } from 'perf_hooks'

import sql from '../db/client.js'

export const getReviews = async (req, res) => {
  const product_id = req.query['product_id']
  if (!product_id) {
    res.sendStatus(404)
  } else {
    try {
    const limit = Number(req.query['count']) || 5
    const page = Number(req.query['page']) || 1
    const offset = (page - 1) * limit
    const sort = req.query['sort']
    const orderBy = sort === 'newest' ? 'date desc' : sort === 'helpful' ? 'helpfulness desc' : 'id asc'

    const start = performance.now()

    const results = await sql`
      select
        reviews.id as id,
        product_id,
        rating,
        date,
        summary,
        body,
        recommend,
        reviewer_name,
        response,
        helpfulness,
        coalesce(array_agg(json_build_object('id', reviews_photos.id, 'url', url)) filter (where reviews_photos.id is not null), '{}') as photos
      from reviews
      left join reviews_photos on reviews.id = reviews_photos.review_id
      where product_id = ${product_id}
      group by reviews.id
      order by ${orderBy}
      limit ${limit}
      offset ${offset}
      `

    const end = performance.now()

    console.log(`${end - start}ms`)

    res.json({
      product: product_id,
      page,
      count: limit,
      results
    })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
}

export const getMeta = async (req, res) => {
  const product_id = req.query['product_id']
  if (!product_id) {
    res.sendStatus(404)
  } else {
    try {

      const start = performance.now()

      const counts = Array.from({length: 5}, (v, i) => sql`
        select
          count(reviews.id)
        from reviews
        where rating = ${i + 1} and product_id = ${product_id}
      `)

      const recommended = sql`
        with recommends_true as (
          select
            count(id),
            recommend
          from reviews
          where product_id = 2 and recommend = true
          group by recommend
        ),
        recommends_false as (
          select
            count(id),
            recommend
          from reviews
          where product_id = 2 and recommend = false
          group by recommend
        )
        select
          json_build_object('false', recommends_false.count, 'true', recommends_true.count) as recommended
        from recommends_true, recommends_false`

      const characteristics = sql`
        with characteristic_avgs as (
          select
            name,
            characteristic_id as id,
            avg(value) as value
          from characteristic_reviews
          join characteristics on characteristic_id = characteristics.id
          where product_id = 1
          group by characteristic_id, name
        )
        select
          json_object_agg(name, json_build_object('id', id, 'value', value)) as chars
        from characteristic_avgs`

      const responses = await Promise.all([...counts, recommended, characteristics])

      const end = performance.now()
      console.log(`${end - start}ms`)

      res.json({
        product_id,
        ratings: {
          1: responses[0][0].count,
          2: responses[1][0].count,
          3: responses[2][0].count,
          4: responses[3][0].count,
          5: responses[4][0].count,
        },
        recommended: responses[5][0].recommended,
        characteristics: responses[6][0].chars
      })
    } catch (err) {
      console.error(err)
      res.sendStatus(500)
    }

  }
}