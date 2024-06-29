import { Router } from 'express'

import { getReviews, addReview, getMeta } from './queries.js'

const router = Router()

router.get('/reviews', getReviews)
router.post('/reviews', addReview)
router.get('/reviews/meta', getMeta)

export default router