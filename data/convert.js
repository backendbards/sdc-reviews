import 'dotenv/config.js'

import * as fs from 'fs'
import { rm } from 'fs/promises'
import * as readline from 'readline'
import * as path from 'path'
import csv from 'csv-parser'

import sql from '../db/client.js'

const etl = async () => {


  console.log('starting')

  await sql`truncate characteristic_reviews cascade`
  console.log('characteristic_reviews emptied')
  await sql`truncate reviews_photos cascade`
  console.log('reviews_photos emptied')
  await sql`truncate characteristics cascade`
  console.log('characteristics emptied')
  await sql`truncate reviews cascade`
  console.log('reviews emptied')

  await rewriteReviews()
  await sql`copy reviews from '/tmp/sdcdata/reviews_adj.csv' delimiter ',' csv header`
  console.log('reviews copied')

  await sql`copy reviews_photos from '/tmp/sdcdata/reviews_photos.csv' delimiter ',' csv header`
  console.log('reviews_photos copied')

  await sql`copy characteristics from '/tmp/sdcdata/characteristics.csv' delimiter ',' csv header`
  console.log('characteristics copied')

  await sql`copy characteristic_reviews from '/tmp/sdcdata/characteristic_reviews.csv' delimiter ',' csv header`
  console.log('characteristics_reviews copied')

  console.log('all done')
  process.exit()
  return true
}

const rewriteReviews = async () => {
  const file = '/tmp/sdcdata/reviews.csv'
  const outFile = '/tmp/sdcdata/reviews_adj.csv'

  try {
    await rm(outFile)
  } catch (err) {
    console.log('no existing file')
  }

  const fsStream = fs.createReadStream(file)
  const csvStream = csv()

  const headers = ['id', 'product_id', 'rating', 'date', 'summary', 'body', 'recommend', 'reported', 'reviewer_name', 'reviewer_email', 'response','helpfulness']

  const writeStream = fs.createWriteStream(outFile)
  writeStream.write(headers.join(',') + '\n')

  return new Promise((resolve, reject) => {
    console.log('reading')
    fsStream
    .pipe(csvStream)
    .on('data', async (data) => {
      fsStream.pause()
      if (data.response === 'null') data.response = null
      data.date = new Date(Number(data.date)).toISOString()
      writeStream.write(Object.values(data).join(',') + '\n')
      fsStream.resume()
    })
    .on('end', async () => {
      console.log('done reading')
      resolve()
      })
  })
}

etl()
