
-- 
drop database if exists `roomat`;

create database if not exists `roomat`;


use `roomat`;


create table `users` (
    id int auto_increment,
    name varchar(34) not null,
    passcode varchar(200) not null,
    email varchar(90),
    user_type enum('ADMIN','REGULAR') default 'REGULAR',
    primary key(id)
);


create table `rooms` (
    id int auto_increment,
    name varchar(34) not null,
    lat varchar(20),
    lng varchar(20),
    building varchar(30),
    city varchar(30),
    type enum('EMPTY', 'STACKED') default 'EMPTY',
    primary key(id)
);


create table `attendance_bookings` (
    id int auto_increment,
    ref varchar(90),
    user_id int,
    room_id int,
    from_time datetime,
    to_time datetime,
    went_in_at datetime,
    left_at datetime,
    foreign key(user_id) references users(id) on delete set null,
    foreign key(room_id) references rooms(id) on delete set null,
    primary key(id)
);
