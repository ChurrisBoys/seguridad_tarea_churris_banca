CREATE TABLE `Users` (
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `telnum` varchar(8) NOT NULL,
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



INSERT INTO churrisbanca_social.Users (username, password, email, telnum) VALUES
   ('brandon.moraumana','$2b$10$qvtuYui/.4lb4YQEnEvoMeD.5kOx914tw5YP3.Qi.Fzys4i8zhXrm',
   'brandon.moraumana@ucr.ac.cr', '88881111'),
   ('emilia.viquez','$2b$10$trsKjsBFp4s09tu02kFh1.jzaCO/zFIl/5C6mIzMOhbYKsjt0MRou',
   'emilia.viquez@ucr.ac.cr', '88882222'),
   ('esteban.leonrodriguez','$2b$10$madp3MZ/1dAEmwDM64GFfuD//q6XIYrT6iHieXcB24Bicfef5VTfe',
   'esteban.leonrodriguez@ucr.ac.cr', '88883333'),
   ('carlos.sanchezblanco','$2b$10$zLqCMGrnij5crxP1kgJqV.RBOycXRi4ce6fcroh9uktzwru9NP2ea',
   'carlos.sanchezblanco@ucr.ac.cr', '88884444'),
   ('maria.andres','$2b$10$O7QW73d0wkWYj7yVuG9b6..gU3saqdYNYif5HmkOIDWNlInrqyz6u',
   'maria.andres@ucr.ac.cr', '88885555'),
   ('randall.lopezvarela','$2b$10$lxY40r2I8Etvkeg/YVURdOxemCMSFOPVLRSQ0wkGgXLGriSTg0P4u',
   'randall.lopezvarela@ucr.ac.cr', '88886666'),
   ('gerardo.camposbadilla','$2b$10$RaO0ZWFOFhGLcLHO6zFG2eac2kAsY5h2S082/vyTCWefblXU82mGu',
   'gerardo.camposbadilla@ucr.ac.cr', '88887777'),
   ('carlos.ramirezmasis','$2b$10$9RINg5HZuzb7fSoygz0WxO24.gG2JBg4z3HdCnwOVz.sVqEUkS.6m',
   'carlos.ramirezmasis@ucr.ac.cr', '88889999'),
   ('cristian.ortegahurtado','$2b$10$vBOuok9NXjXJXDzNVp2RCOtAWM7ph.eeXPp2KFgC3Eak4R.Q4ISoy',
   'cristian.ortegahurtado@ucr.ac.cr', '88880000'),
   ('david.sanchezlopez','$2b$10$V8c7E1jtrG6ZmeQoA.pa8ugGa3S7ZOeyQZuitpJtwBu5eqEdn/2mG',
   'david.sanchezlopez@ucr.ac.cr', '77771111'),
   ('andre.villegas','$2b$10$NA35xwaQd1f5Nz/Y9xmGQuQx2c3L7cO2L13DFzesCXqybAxqxJZr2',
   'andre.villegas@ucr.ac.cr', '77772222'),
   ('andrey.menaespinoza','$2b$10$BSr7NnP2l4UdlxLwtyWZWeuLUWW6Y.3Q9CwA919r2w4kTOOijQr3C',
   'andrey.menaespinoza@ucr.ac.cr', '77773333'),
   ('jason.murillo','$2b$10$ETz7sURsR6i1LcaLHDn2UOL0GC5g9WViE7FAPrreGKY8ayzwIpkpO',
   'jason.murillo@ucr.ac.cr', '77774444'),
   ('yordi.robles','$2b$10$pfIgAgd9.ywXKZOvgROOc.R.ROvzSENO5Un99Lg9xWxyo9O8//QCW',
   'yordi.robles@ucr.ac.cr', '77775555'),
   ('genesis.herreraknyght','$2b$10$hNRAAcpmaN7ztbwJQO/A0uPB5wG.zPiYeWraQlmhOr/2fUsfFjqDa',
   'genesis.herreraknyght@ucr.ac.cr', '77776666'),
   ('sebastian.rodrigueztencio','$2b$10$67EedrhVd/FMTuUrbwQgieTHJ8AwmIEND7BqkJ961nlGZ/RicMZie',
   'sebastian.rodrigueztencio@ucr.ac.cr', '77778888'),
   ('jeremy.espinozamadrigal','$2b$10$cV5DS5bKL2o4JQ/rxkPQB.KmSbOar02aEhcM.o0yM6AFAZ8TIv6ym',
   'jeremy.espinozamadrigal@ucr.ac.cr', '77779999'),
   ('richard.garita','$2b$10$YNkb9mQtsWYKus4Vf5hDROaHUpliqk24CZ7SOI4wzGBdnnXrZvhAq',
   'richard.garita@ucr.ac.cr', '66661111'),
   ('dylan.tenorio','$2b$10$SL1UcVQgV7/gy5bgLlVEpO10ISjFVIYvRVNctldFZnnl4IMLtNxaq',
   'dylan.tenorio@ucr.ac.cr', '66662222'),
   ('eithel.vega','$2b$10$utU95XoNaDRCtysEDuf2heI/1.Z7j5K0cUQTCLWYUnKlz1feBf/E2',
   'eithel.vega@ucr.ac.cr', '66663333');

INSERT INTO churrisbanca_social.Posts (username,description) VALUES
	 ('carlos.sanchezblanco','oal'),
	 ('carlos.sanchezblanco','post1'),
	 ('carlos.sanchezblanco','post2'),
	 ('carlos.sanchezblanco','post3'),
	 ('carlos.sanchezblanco','xao');
INSERT INTO churrisbanca_social.Likes (username,post_id,post_creator,liked) VALUES
	 ('esteban.leonrodriguez',1,'carlos.sanchezblanco',1),
	 ('esteban.leonrodriguez',2,'carlos.sanchezblanco',0),
	 ('carlos.sanchezblanco',1,'carlos.sanchezblanco',1);
INSERT INTO churrisbanca_social.Follows(user1, user2) VALUES
   ('esteban.leonrodriguez', 'emilia.viquez'),
   ('emilia.viquez', 'esteban.leonrodriguez'),
   ('emilia.viquez', 'carlos.sanchezblanco'),
   ('carlos.sanchezblanco', 'emilia.viquez'),
   ('emilia.viquez', 'brandon.moraumana');


TRUNCATE TABLE Users;


Drop TABLE churrisbanca_social.Users; 
Drop TABLE churrisbanca_social.Likes; 
Drop TABLE churrisbanca_social.Posts;
Drop TABLE churrisbanca_social.Follows;


