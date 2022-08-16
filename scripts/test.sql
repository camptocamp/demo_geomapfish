
CREATE TABLE tests.testpoint (
    id serial PRIMARY KEY,
    name varchar,
    geom geometry(POINT, 21781)
);


CREATE TABLE tests.type (
    id serial PRIMARY KEY,
    name varchar
);


CREATE TABLE tests.testpoint_type (
  testpoint_id int REFERENCES tests.testpoint(id) ON UPDATE CASCADE ON DELETE CASCADE,
  type_id int REFERENCES tests.type(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT testpoint_type_pkey PRIMARY KEY (testpoint_id, type_id)
);
