CREATE DATABASE IF NOT EXISTS MyPosts;
USE MyPosts;

CREATE TABLE IF NOT EXISTS Posts
	( PostID int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	PostTitle MEDIUMTEXT NOT NULL,
    PostSubtitle MEDIUMTEXT,
    PostMainBody LONGTEXT,
    PostConclusion MEDIUMTEXT,
    PostCommentCount INT,
    DateAdded DATETIME DEFAULT CURRENT_TIMESTAMP, /* Available as of MySQL 5.6.5 */
	DateModified DATETIME ON UPDATE CURRENT_TIMESTAMP # Available as of MySQL 5.6.5
    );