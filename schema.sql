drop table if exists User;
drop table if exists Quote;

create table User(
	username varchar(30) primary key,
	password varchar(30) not null,
	admin boolean not null
);

create table Quote(
	id varchar(50) primary key,
	create_by varchar(30) not null,
	quote text not null,
	date integer not null
);


create table UpdateQuotes(
	ip varchar(30) primary key,
	mustUpdate boolean
)
