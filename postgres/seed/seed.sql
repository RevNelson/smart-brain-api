BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Tim', 'tim@gmail.com', 5, '2018-01-01');
INSERT into login (hash, email) values ('$2a$10$KphNJkIcjD8oV4Wv0BbkAOtrxNoLQXAt9ULXLKQvPoL0/8N8vL3Y2', 'tim@gmail.com');
INSERT into users (name, email, entries, joined) values ('Michael', 'revnelson@gmail.com', 99, '2018-07-01');
INSERT into login (hash, email) values ('$2a$10$KphNJkIcjD8oV4Wv0BbkAOtrxNoLQXAt9ULXLKQvPoL0/8N8vL3Y2', 'revnelson@gmail.com');

COMMIT;