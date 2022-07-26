CREATE DATABASE IF NOT EXISTS sql3509839;/* freesqldatabase only lets you use one database. */ 
USE sql3509839;
CREATE TABLE IF NOT EXISTS Posts ( PostID int AUTO_INCREMENT NOT NULL PRIMARY KEY, PostTitle MEDIUMTEXT NOT NULL,PostSubtitle MEDIUMTEXT,PostMainBody LONGTEXT,PostConclusion MEDIUMTEXT,PostCommentCount INT,DateAdded DATETIME );
CREATE TABLE IF NOT EXISTS Users ( UserID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,Username varchar(250) NOT NULL,Email varchar(250) NOT NULL,Website varchar(250), IPADDRESS varchar(250)); 
CREATE TABLE IF NOT EXISTS Replies( ReplyID INT AUTO_INCREMENT NOT NULL PRIMARY KEY, OriginCommentID INT,InnerText VARCHAR(2500),AuthorID INT NOT NULL, Likes INT,Dislikes INT,DateAdded DATETIME );
CREATE TABLE IF NOT EXISTS Comments( CommentID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,OriginPostID INT NOT NULL,InnerText VARCHAR(2500),AuthorID INT NOT NULL,Likes INT,Dislikes INT,RepliesCount INT,DateAdded DATETIME, CONSTRAINT FK_CommentOriginPostID FOREIGN KEY (OriginPostId ) REFERENCES Posts(PostID) ON DELETE CASCADE, CONSTRAINT FK_CommentUserID FOREIGN KEY (AuthorID) REFERENCES Users(UserID));
