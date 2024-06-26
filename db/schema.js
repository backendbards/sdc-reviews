import { serial, integer, text, boolean, bigint, timestamp, pgTable } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id'),
  rating: integer('rating'),
  // date: bigint('date', { mode: 'bigint' }),
  date: timestamp('date', { mode: 'date', withTimezone: true }).defaultNow(),
  summary: text('summary'),
  body: text('body'),
  recommend: boolean('recommend'),
  reported: boolean('reported'),
  reviewer_name: text('reviewer_name'),
  reviewer_email: text('reviewer_email'),
  response: text('response'),
  helpfulness: integer('helpfulness'),
})

export const reviewsPhotos = pgTable('reviews_photos', {
  id: serial('id').primaryKey(),
  review_id: integer('review_id').references(() => reviews.id, { onDelete: 'cascade' }),
  url: text('url'),
})

export const characteristicReviews = pgTable('characteristic_reviews', {
  id: serial('id').primaryKey(),
  characteristic_id: integer('characteristic_id').references(() => characteristics.id, { onDelete: 'cascade' }),
  review_id: integer('review_id').references(() => reviews.id, { onDelete: 'cascade' }),
  value: integer('value'),
})

export const characteristics = pgTable('characteristics', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id'),
  name: text('name'),
})

export const reviewsRelations = relations(reviews, ({ many }) => ({
  photos: many(reviewsPhotos),
  characteristicReviews: many(characteristicReviews)
}))

export const reviewsPhotosRelations = relations(reviewsPhotos, ({ one }) => ({
  review_id: one(reviews, {
    fields: [reviewsPhotos.review_id],
    references: [reviews.id],
  })
}))

export const characteristicsRelations = relations(characteristics, ({ many }) => ({
  characteristicReviews: many(characteristicReviews)
}))

export const characteristicReviewsRelations = relations(characteristicReviews, ({ one }) => ({
  review_id: one(reviews, {
    fields: [characteristicReviews.review_id],
    references: [reviews.id]
  }),
  characteristic_id: one(characteristics, {
    fields: [characteristicReviews.characteristic_id],
    references: [characteristics.id]
  })
}))