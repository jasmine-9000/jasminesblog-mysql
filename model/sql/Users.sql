CREATE DATABASE IF NOT EXISTS MyPosts;
USE MyPosts;

CREATE TABLE IF NOT EXISTS Users 
	(UserID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	Username varchar(250) NOT NULL,
    Email varchar(250) NOT NULL,
    Website varchar(250), 
    IPADDRESS varchar(250)
    );