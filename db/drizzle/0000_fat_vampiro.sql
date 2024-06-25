CREATE TABLE IF NOT EXISTS "reviews" (
	"id" integer,
	"rating" integer,
	"summary" text,
	"recommend" boolean,
	"response" text,
	"body" text,
	"date" timestamp with time zone,
	"reviewer_name" text,
	"reviewer_email" text,
	"helpfulness" integer,
	"reported" boolean
);
