CREATE TABLE `Users` (
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`username`)
);

CREATE TABLE `Posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `publish_date` date DEFAULT curdate(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `image` blob DEFAULT NULL,
  PRIMARY KEY (`id`,`username`),
  KEY `Posts_username_FK` (`username`),
  CONSTRAINT `Posts_username_FK` FOREIGN KEY (`username`) REFERENCES `Users` (`username`),
  CONSTRAINT `Posts_CHECK` CHECK (`is_deleted` = 1 or `is_deleted` = 0)
);

CREATE TABLE `Likes` (
  `username` varchar(100) NOT NULL,
  `post_id` int(11) NOT NULL,
  `post_creator` varchar(100) NOT NULL,
  `liked` tinyint(1) NOT NULL,
  PRIMARY KEY (`username`,`post_id`,`post_creator`),
  KEY `Likes_post_FK` (`post_id`,`post_creator`),
  CONSTRAINT `Likes_post_FK` FOREIGN KEY (`post_id`, `post_creator`) REFERENCES `Posts` (`id`, `username`),
  CONSTRAINT `Likes_username_FK` FOREIGN KEY (`username`) REFERENCES `Users` (`username`),
  CONSTRAINT `Likes_CHECK` CHECK (`liked` = 1 or `liked` = 0)
) COMMENT='The binary field will represent ''1'' as the user liked this post, and ''0'' represents a dislike';

CREATE TABLE `Follows` (
  `user1` varchar(100) NOT NULL,
  `user2` varchar(100) NOT NULL,
  PRIMARY KEY (`user1`, `user2`),
  CONSTRAINT `user1_FK` FOREIGN KEY (`user1`) REFERENCES `Users`(`username`),
  CONSTRAINT `user2_FK` FOREIGN KEY (`user2`) REFERENCES `Users`(`username`),
  CONSTRAINT `user1_user2_different` CHECK (`user1` <> `user2`)
);



INSERT INTO churrisbanca_social.Users (username,password) VALUES
	 ('Alonso','$2a$10$IssUlhhFTLxbh.YiFQshGeeIhpVEZmvTlC7zB058lEiFQ8pv7QYb.'),
	 ('Carlos','$2a$10$h1NR0PuyyZvxN1SIS97sT.nwnt1inPYk.T9J0TDhxH/ewRdVa6YYC'),
	 ('Emilia','$2a$10$je7mgB/bF7nMwszes8iqnOYgy.NQcbqt6h/S9OPGtpBY6FUvF1PmG'),
	 ('Brandon','$2a$10$je7mgB/bF7nMwszes8iqnOYgy.NQcbqt6h/S9OPGtpBY6FUvF1PmG'),
   ('Carlitos','$2a$10$MSeHUpOM5X0eCHAHfV37WOtn1q7.HyGuRTTaJcANejIjggrF6hCnq'),
   ('Ernesto','$2a$10$8EmE72qDQfvJNZqe7qDO1.U7ZBSwkhToaf3cDPPbSz/cA6rXqBmDm'),
   ('Camilo','$2a$10$Ft3BqlzlWA7WVaHHDVfDu.2I9pQXn25cJjzuiJyQoo/gwOxbtPgU.');
INSERT INTO churrisbanca_social.Posts (username,description) VALUES
	 ('Carlos','oal'),
	 ('Carlos','post1'),
	 ('Carlos','post2'),
	 ('Carlos','post3'),
	 ('Carlos','xao');
INSERT INTO churrisbanca_social.Likes (username,post_id,post_creator,liked) VALUES
	 ('Alonso',1,'Carlos',1),
	 ('Alonso',2,'Carlos',0),
	 ('Carlos',1,'Carlos',1);
INSERT INTO churrisbanca_social.Follows(user1, user2) VALUES
   ('Alonso', 'Emilia'),
   ('Emilia', 'Alonso'),
   ('Emilia', 'Brandon');




TRUNCATE TABLE Users;


Drop TABLE churrisbanca_social.Users; 
Drop TABLE churrisbanca_social.Likes; 
Drop TABLE churrisbanca_social.Posts;


