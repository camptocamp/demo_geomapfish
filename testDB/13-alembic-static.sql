BEGIN;

CREATE TABLE main_static.alembic_version (
    version_num VARCHAR(32) NOT NULL
);

-- Running upgrade  -> 3f89a7d71a5e

ALTER TABLE main_static.shorturl ALTER COLUMN url TYPE VARCHAR;

INSERT INTO main_static.alembic_version (version_num) VALUES ('3f89a7d71a5e');

-- Running upgrade 3f89a7d71a5e -> 1da396a88908

CREATE TABLE main_static."user" (
    type VARCHAR(10) NOT NULL, 
    id SERIAL NOT NULL, 
    username VARCHAR NOT NULL, 
    password VARCHAR NOT NULL, 
    email VARCHAR NOT NULL, 
    is_password_changed BOOLEAN, 
    role_name VARCHAR, 
    PRIMARY KEY (id), 
    UNIQUE (username)
);

INSERT INTO main_static.user (type, username, password, email, is_password_changed, role_name) (SELECT u.type, u.username, u.password, u.email, u.is_password_changed, r.name FROM main.user AS u LEFT OUTER JOIN main.role AS r ON (r.id = u.role_id) );

DROP TABLE main."user";

UPDATE main_static.alembic_version SET version_num='1da396a88908' WHERE main_static.alembic_version.version_num = '3f89a7d71a5e';

-- Running upgrade 1da396a88908 -> 5472fbc19f39

ALTER TABLE main_static."user" ADD COLUMN temp_password VARCHAR;

UPDATE main_static.alembic_version SET version_num='5472fbc19f39' WHERE main_static.alembic_version.version_num = '1da396a88908';

COMMIT;

