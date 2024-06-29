CREATE TABLE IF NOT EXISTS "characteristic_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"characteristic_id" integer,
	"review_id" integer,
	"value" integer
);

CREATE TABLE IF NOT EXISTS "characteristics" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"name" text
);

CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"rating" integer,
	"date" timestamp with time zone DEFAULT now(),
	"summary" text,
	"body" text,
	"recommend" boolean DEFAULT FALSE,
	"reported" boolean DEFAULT FALSE,
	"reviewer_name" text,
	"reviewer_email" text,
	"response" text,
	"helpfulness" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "reviews_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_id" integer,
	"url" text
);

 ALTER TABLE "characteristic_reviews" ADD CONSTRAINT "characteristic_reviews_characteristic_id_characteristics_id_fk" FOREIGN KEY ("characteristic_id") REFERENCES "public"."characteristics"("id") ON DELETE cascade ON UPDATE no action;

 ALTER TABLE "characteristic_reviews" ADD CONSTRAINT "characteristic_reviews_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;

 ALTER TABLE "reviews_photos" ADD CONSTRAINT "reviews_photos_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;

SELECT setval(pg_get_serial_sequence('reviews', 'id'), COALESCE(MAX(id), 1)) FROM reviews;

SELECT setval(pg_get_serial_sequence('reviews_photos', 'id'), COALESCE(MAX(id), 1)) FROM reviews_photos;