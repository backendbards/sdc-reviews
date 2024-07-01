explain analyze with ratings_counts as
(
  select rating, count(rating)
 from reviews
 where product_id = 33
 group by product_id, rating
), ratings as (
select json_build_object(1, coalesce((select count from ratings_counts where rating = 1), 0), 2, coalesce((select count from ratings_counts where rating = 2), 0), 3, coalesce((select count from ratings_counts where rating = 3), 0), 4, coalesce((select count from ratings_counts where rating = 4), 0), 5, coalesce((select count from ratings_counts where rating = 5), 0)) as ratings limit 1
), characteristic_avgs as
(
  select
    name,
    characteristic_id as id,
    avg(value) as value
  from characteristic_reviews
  join characteristics
    on characteristic_id = characteristics.id
  where product_id = 1
  group by characteristic_id, name
), recommends_true as
(
  select count(id), recommend
  from reviews
  where product_id = 2 and recommend = true
  group by recommend
),
recommends_false as
(
  select count(id), recommend
  from reviews
  where product_id = 2 and recommend = false
  group by recommend
)
select json_build_object('ratings', (select * from ratings), 'characteristics', (select json_object_agg(name, json_build_object('id', id, 'value', value)) from characteristic_avgs), 'recommended', (select json_build_object('false', recommends_false.count, 'true', recommends_true.count) as recommend from recommends_true, recommends_false))
-- select count from ratings_counts where rating = 2;