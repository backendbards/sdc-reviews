import http from 'k6/http'
import { sleep } from 'k6'

export const options = {
  vus: 500,
  duration: '30s'
}

export default () => {

  const randomID = Math.floor(Math.random() * 5000000) + 1

  http.get(`http://localhost:3000/reviews?product_id=${randomID}`, {timeout: '120s', tags: { name: 'base'}})
  // http.get(`http://18.144.41.253:3000/reviews?product_id=${randomID}`, {timeout: '120s', tags: { name: 'base'}})
  // http.get(`http://13.56.232.172/reviews?product_id=${randomID}`, {timeout: '120s', tags: { name: 'base'}})
  // http.get(`http://localhost:3000/reviews/meta?product_id=${randomID}`, {timeout: '120s', tags: { name: 'meta'}})
  // sleep(1)
}