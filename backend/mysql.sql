-- drop database gitshare;
create database gitshare;
use gitshare;


create table user(
userid BIGINT PRIMARY KEY auto_increment,
username VARCHAR(50) NOT NULL UNIQUE,
password varchar(255),
email VARCHAR(100) NOT NULL UNIQUE,
role ENUM('0','1') NOT NULL default '0',
create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE repo(
repoid BIGINT PRIMARY KEY auto_increment,
reponame VARCHAR(100),
description TEXT,
isprivate BOOLEAN DEFAULT FALSE,
language VARCHAR(50),
stars INT DEFAULT 0,
ownerid BIGINT NOT NULL,
create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(ownerid) REFERENCES user(userid) ON DELETE CASCADE);

CREATE TABLE file(
fileid BIGINT PRIMARY KEY auto_increment, 
repoid BIGINT,
version BIGINT default 0,
FOREIGN KEY(repoid) REFERENCES repo(repoid) ON DELETE CASCADE);

CREATE TABLE version(
id BIGINT PRIMARY KEY auto_increment, 
fileid BIGINT, 
filename VARCHAR(255), 
path VARCHAR(500), 
size BIGINT, 
filetype VARCHAR(100), 
editor BIGINT, 
created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
version INT,
message TEXT, 
isrubbish BOOLEAN NOT NULL DEFAULT FALSE,
FOREIGN KEY (editor) REFERENCES user(userid),
FOREIGN KEY (fileid) REFERENCES file(fileid) ON DELETE CASCADE, 
UNIQUE KEY(fileid,version));

create table interest(
userid BIGINT,
interestid BIGINT,
primary key(userid,interestid),
FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE,
FOREIGN KEY (interestid)  REFERENCES user(userid));

-- select * from user;
select * from interest;