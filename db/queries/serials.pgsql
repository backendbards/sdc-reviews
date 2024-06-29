SELECT setval(pg_get_serial_sequence('reviews', 'id'), COALESCE(MAX(id), 1)) FROM reviews;

SELECT setval(pg_get_serial_sequence('reviews_photos', 'id'), COALESCE(MAX(id), 1)) FROM reviews_photos;

SELECT setval(pg_get_serial_sequence('characteristic_reviews', 'id'), COALESCE(MAX(id), 1)) FROM characteristic_reviews;