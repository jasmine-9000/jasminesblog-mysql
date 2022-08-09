CREATE DATABASE IF NOT EXISTS MyPosts; # if MyPosts doesn't exist, create a database for it. 
USE MyPosts;

CREATE TABLE IF NOT EXISTS Posts
	( PostID int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	PostTitle MEDIUMTEXT NOT NULL,
    PostSubtitle MEDIUMTEXT,
    PostMainBody LONGTEXT,
    PostConclusion MEDIUMTEXT,
    PostCommentCount INT,
    DateAdded DATETIME DEFAULT CURRENT_TIMESTAMP, # Available as of MySQL 5.6.5
	DateModified DATETIME ON UPDATE CURRENT_TIMESTAMP # Available as of MySQL 5.6.5
    );
CREATE TABLE Users 
	(UserID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	Username varchar(250) NOT NULL,
    Email varchar(250) NOT NULL,
    Website varchar(250), 
    IPADDRESS varchar(250)
    ); 
CREATE TABLE Replies
	( ReplyID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    OriginCommentID INT,	
    InnerText VARCHAR(2500),
    AuthorID INT NOT NULL,
    Likes INT,
    Dislikes INT,
    DateAdded DATETIME DEFAULT CURRENT_TIMESTAMP, # Available as of MySQL 5.6.5
	DateModified DATETIME ON UPDATE CURRENT_TIMESTAMP # Available as of MySQL 5.6.5
    );
CREATE TABLE Comments
	( CommentID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
		OriginPostID INT,
        InnerText VARCHAR(2500),
        AuthorID INT NOT NULL,
        Likes INT,
        Dislikes INT,
        RepliesCount INT,
        DateAdded DATETIME DEFAULT CURRENT_TIMESTAMP, # Available as of MySQL 5.6.5
		DateModified DATETIME ON UPDATE CURRENT_TIMESTAMP, # Available as of MySQL 5.6.5
        CONSTRAINT FK_CommentOriginPostID FOREIGN KEY (OriginPostId ) REFERENCES Posts(PostID) ON DELETE CASCADE,
        CONSTRAINT FK_CommentUserID FOREIGN KEY (AuthorID) REFERENCES Users(UserID);
			);

    
