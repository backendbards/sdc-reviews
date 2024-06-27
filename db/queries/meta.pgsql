with ratings_counts as
(
  select rating, count(rating)
 from reviews
 where product_id = 2
 group by product_id, rating
)
select * from ratings_counts;