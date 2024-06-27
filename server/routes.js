import { Router } from 'express'

import { reviews } from '../db/schema.js'
import { eq } from 'drizzle-orm'

import { connect } from '../db/client.js'
const db = await connect()

const router = Router()

router.get('/reviews', async (req, res) => {
  const product_id = req.query['product_id']
  if (!product_id) {
    res.sendStatus(404)
  } else {
    console.log(req.query['count'])
    const count = req.query['count'] || 5
    const results = await db.select().from(reviews).where(eq(reviews.product_id, product_id)).limit(count)
    res.send(results)
  }
})

export default router