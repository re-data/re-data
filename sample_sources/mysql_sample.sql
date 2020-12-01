-- mysql -u root -p

use sample;
create table testing ( c1 int, c2 int );
INSERT INTO testing (c1, c2) values (1, 2)
INSERT INTO testing (c1, c2) values (1, 3)

create table testing_time ( c1 int, c2 int, c3 VARCHAR(255), created_on datetime not null default now());
insert into testing_time (c1, c2, c3) values (1, 1, 'ala');
insert into testing_time (c1, c2, c3) values (1, 2, 'ala');
insert into testing_time (c1, c2, c3) values (1, 3, 'ala');
insert into testing_time (c1, c2, c3) values (4, 3, 'alabb');