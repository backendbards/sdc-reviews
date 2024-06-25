import { integer, text, boolean, timestamp, pgTable } from 'drizzle-orm/pg-core'

export const reviews = pgTable('reviews', {
  id: integer('id'),
  rating: integer('rating'),
  summary: text('summary'),
  recommend: boolean('recommend'),
  response: text('response'),
  body: text('body'),
  date: timestamp('date', { mode: 'date', withTimezone: true }),
  reviewer_name: text('reviewer_name'),
  reviewer_email: text('reviewer_email'),
  helpfulness: integer('helpfulness'),
  reported: boolean('reported')
})