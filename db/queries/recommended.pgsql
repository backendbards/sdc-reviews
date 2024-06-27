with recommends_true as
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
select json_build_object('false', recommends_false.count, 'true', recommends_true.count) as recommend from recommends_true, recommends_false;