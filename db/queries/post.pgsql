-- SELECT
--   column_name,
--   data_type,
--   character_maximum_length,
--   is_nullable,
--   column_default
-- FROM
--   information_schema.columns
-- WHERE
--   table_name = 'reviews';

-- SELECT last_value FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'reviews_id_seq';
-- SELECT setval(pg_get_serial_sequence('reviews', 'id'), COALESCE(MAX(id), 1)) FROM reviews;



-- insert into reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) values (1, 3, 'good', 'very good', TRUE, 'jason', 'jason') returning id;

select * from reviews order by id desc limit 1;

-- SELECT setval(pg_get_serial_sequence('reviews_photos', 'id'), COALESCE(MAX(id), 1)) FROM reviews_photos;