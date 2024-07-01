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
    // console.log(orderBy)

    // const start = performance.now()

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

    // const end = performance.now()

    // console.log(`${end - start}ms`)

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

export const getBeta = async (req, res) => {
  const product_id = req.query['product_id']
  if (!product_id) {
    res.sendStatus(404)
  } else {
    try {

      // const start = performance.now()

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

      // const end = performance.now()
      // console.log(`${end - start}ms`)

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

export const getMeta = async (req, res) => {
  const product_id = req.query['product_id']
  if (!product_id) {
    res.sendStatus(404)
  } else {
    try {

      // const start = performance.now()

      const results = await sql`
        with ratings_counts as
      (
        select rating, count(rating)
      from reviews
      where product_id = ${product_id}
      group by product_id, rating
      ), ratings as (
      select json_build_object(1, coalesce((select count from ratings_counts where rating = 1), 0), 2, coalesce((select count from ratings_counts where rating = 2), 0), 3, coalesce((select count from ratings_counts where rating = 3), 0), 4, coalesce((select count from ratings_counts where rating = 4), 0), 5, coalesce((select count from ratings_counts where rating = 5), 0)) as ratings limit 1
      ), characteristic_avgs as
      (
        select
          name,
          characteristic_id as id,
          avg(value) as value
        from characteristic_reviews
        join characteristics
          on characteristic_id = characteristics.id
        where product_id = ${product_id}
        group by characteristic_id, name
      ), recommends_true as
      (
        select count(id), recommend
        from reviews
        where product_id = ${product_id} and recommend = true
        group by recommend
      ),
      recommends_false as
      (
        select count(id), recommend
        from reviews
        where product_id = ${product_id} and recommend = false
        group by recommend
      )
      select json_build_object('ratings', (select * from ratings), 'characteristics', (select json_object_agg(name, json_build_object('id', id, 'value', value)) from characteristic_avgs), 'recommended', (select json_build_object('false', recommends_false.count, 'true', recommends_true.count) as recommend from recommends_true, recommends_false)) as results
      `

      // const end = performance.now()
      // console.log(`${end - start}ms`)

      res.json({
        product_id,
        ...results[0].results
      })
    } catch (err) {
      console.error(err)
      res.sendStatus(500)
    }

  }
}

export const addReview = async (req, res) => {
  try {

    const photos = req.body.photos.map(photo => `((select id from new_review), '${photo}')`).join(', ');
    const characteristics = Object.entries(req.body.characteristics).map(c => `((select id from new_review), ${c[0]}, ${c[1]})`)

    const query = sql`
      with new_review as (
        insert into reviews
        (
          product_id,
          rating,
          summary,
          body,
          reviewer_name,
          reviewer_email
        ) values (
          ${req.body.product_id},
          ${req.body.rating},
          ${req.body.summary},
          ${req.body.body},
          ${req.body.reviewer_name},
          ${req.body.reviewer_email}
        )
        returning id
      ),
      characteristics as
      (
        insert into characteristic_reviews
        (review_id, characteristic_id, value)
        values
        ${sql.unsafe(characteristics)}
      )
      ${req.body.photos.length > 0 ? sql`
        insert into
          reviews_photos
          (review_id, url)
        values
        ${sql.unsafe(photos)}
      ` : sql`select TRUE`}
    `

    const result = await query

    // console.log(result)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }

}

export const setHelpful = async (req, res) => {
  if (!req.params.review_id) {
    res.sendStatus(404)
  }
  try {
    const result = await sql`
      update reviews
      set
        helpfulness = helpfulness + 1
      where
        id = ${req.params.review_id}
    `

    res.json(result)
  } catch(err) {
    console.error(err)
    res.sendStatus(500)
  }
}

export const setReported = async (req, res) => {
  if (!req.params.review_id) {
    res.sendStatus(404)
  }
  try {
    const result = await sql`
      update reviews
      set
        reported = true
      where
        id = ${req.params.review_id}
    `

    res.json(result)
  } catch(err) {
    console.error(err)
    res.sendStatus(500)
  }
}