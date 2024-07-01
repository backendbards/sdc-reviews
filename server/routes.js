import { Router } from 'express'

import { getReviews, addReview, getMeta, setHelpful, setReported, getBeta } from './queries.js'

const router = Router()

router.get('/reviews', getReviews)
router.post('/reviews', addReview)
router.get('/reviews/meta', getMeta)
router.get('/reviews/beta', getBeta)
router.put('/reviews/:review_id/helpful', setHelpful)
router.put('/reviews/:review_id/report', setReported)

export default router