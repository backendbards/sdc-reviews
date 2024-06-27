with characteristic_avgs as
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
)
select json_object_agg(name, json_build_object('id', id, 'value', value)) as chars from characteristic_avgs;