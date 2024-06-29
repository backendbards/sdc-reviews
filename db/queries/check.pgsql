-- select * from reviews where product_id = 1 order by date desc limit 5;

select
  reviews.id as id,
  product_id,
  rating,
  date,
  summary,
  body,
  recommend,
  reviewer_name,
  response,
  helpfulness,
  coalesce(array_agg(json_build_object('id', reviews_photos.id, 'url', url)) filter (where reviews_photos.id is not null), '{}') as photos
from reviews
left join reviews_photos on reviews.id = reviews_photos.review_id
where product_id = 1
group by reviews.id
order by date desc
limit 5
offset 0;