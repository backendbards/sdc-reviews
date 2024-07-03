import http from 'k6/http'
import { sleep } from 'k6'

export const options = {
  vus: 500,
  duration: '10s'
}

export default () => {

  const randomID = Math.floor(Math.random() * 5000000) + 1

  // http.get(`http://localhost:3000/reviews?product_id=${randomID}`, {timeout: '120s', tags: { name: 'base'}})
  http.get(`http://54.67.15.223/reviews?product_id=${randomID}`, {timeout: '120s', tags: { name: 'base'}})
  // http.get(`http://localhost:3000/reviews/meta?product_id=${randomID}`, {timeout: '120s', tags: { name: 'meta'}})
  // sleep(1)
}