import { Router } from 'express'

import { getReviews, getMeta } from './models.js'

const router = Router()

router.get('/reviews', getReviews)
router.get('/reviews/meta', getMeta)

export default router