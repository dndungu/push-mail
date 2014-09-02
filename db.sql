CREATE TABLE IF NOT EXISTS `mail` (
  `mailID` int(16) NOT NULL AUTO_INCREMENT,
  `mailer` int(4) NOT NULL,
  `to` varchar(255) NOT NULL,
  `subject` varchar(64) NOT NULL,
  `text` text NOT NULL,
  `html` text NOT NULL,
  `locked` tinyint(4) NOT NULL DEFAULT '0',
  `schedule` int(10) NOT NULL,
  `relayTime` int(10) DEFAULT NULL,
  `creationTime` int(10) NOT NULL,
  `inTrash` enum('Yes','No') NOT NULL DEFAULT 'No',
  PRIMARY KEY (`mailID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
