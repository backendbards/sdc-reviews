import http from 'k6/http'

export const options = {
  vus: 300,
  duration: '10s'
}

export default () => {
  http.get('http://localhost:3000/reviews?product_id=2')
}