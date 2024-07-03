create index if not exists reviews_productid on reviews(product_id);

create index reviewsphotos_reviewid on reviews_photos(review_id);

create index if not exists characteristicreviews_characteristicid on characteristic_reviews(characteristic_id);

create index if not exists characteristics_productid on characteristics(product_id);

-- drop index reviews_productid;

-- drop index reviewsphotos_reviewid;

-- drop index characteristicreviews_characteristicid;

-- drop index characteristics_productid;