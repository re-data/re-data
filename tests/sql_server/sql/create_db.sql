use testing;
go

if not exists (select * from sysobjects where name='testingtable') create table testingtable (
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    value1 int,
    value2 int,
    op_type varchar(40)
)
go


insert into testingtable (value1, value2, op_type) values (1, 1, 'test');
insert into testingtable (value1, value2, op_type) values (1, 2, 'test2');
insert into testingtable (value1, value2, op_type) values (1, 2, 'test2');
insert into testingtable (value1, value2, op_type) values (1, 199, null);

go