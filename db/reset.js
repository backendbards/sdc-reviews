import { sql } from 'drizzle-orm'

import { connect } from './client.js'
const db = await connect()

const reset = async () => {

  await db.execute(sql`drop table reviews cascade`)
  console.log('dropped reviews')
  await db.execute(sql`drop table reviews_photos cascade`)
  console.log('dropped reviews_photos')
  await db.execute(sql`drop table characteristics cascade`)
  console.log('dropped characteristics')
  await db.execute(sql`drop table characteristic_reviews cascade`)
  console.log('dropped characteristic_reviews')
  console.log('done')

  process.exit()
}

reset()