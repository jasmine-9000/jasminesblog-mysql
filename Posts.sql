CREATE DATABASE IF NOT EXISTS MyPosts; # if MyPosts doesn't exist, create a database for it. 
USE MyPosts;

CREATE TABLE Posts
	( PostID int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	PostTitle MEDIUMTEXT NOT NULL,
    PostSubtitle MEDIUMTEXT,
    PostMainBody LONGTEXT,
    PostConclusion MEDIUMTEXT,
    PostCommentCount INT,
    DateAdded DATETIME DEFAULT CURRENT_TIMESTAMP, # Available as of MySQL 5.6.5
	DateModified DATETIME ON UPDATE CURRENT_TIMESTAMP # Available as of MySQL 5.6.5
    );
    
CREATE TABLE Comments
	( CommentID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
		OriginPostID INT,
        InnerText VARCHAR(2500),
        Author VARCHAR(250),
        Likes INT,
        Dislikes INT,
        RepliesCount INT,
        DateAdded DATETIME DEFAULT CURRENT_TIMESTAMP, # Available as of MySQL 5.6.5
		DateModified DATETIME ON UPDATE CURRENT_TIMESTAMP # Available as of MySQL 5.6.5
			);
CREATE TABLE Replies
	( ReplyID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    OriginCommentID INT,	
    InnerText VARCHAR(2500),
    Author VARCHAR(250),
    Likes INT,
    Dislikes INT,
    DateAdded DATETIME DEFAULT CURRENT_TIMESTAMP, # Available as of MySQL 5.6.5
	DateModified DATETIME ON UPDATE CURRENT_TIMESTAMP # Available as of MySQL 5.6.5
    )