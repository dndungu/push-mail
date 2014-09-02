"use strict";

var settings = require("./settings.json");

var nodemailer = require("nodemailer");
var mysql      = require('mysql');

var smtpTransport = nodemailer.createTransport("SMTP",{
	service: settings.smtp.service,
	auth: {
		user: settings.smtp.user,
		pass: settings.smtp.password
	}
});

var options = {
	from: settings.smtp.from
};

var connection = mysql.createConnection({
	host: settings.mysql.host,
	user: settings.mysql.user,
	password : settings.mysql.password,
});

connection.connect(function(error) {
	error && console.log(error);
});

setInterval(function(){
	var query = 'SELECT * FROM `mail` WHERE `locked` = 0 AND `relayTime` IS NULL AND `schedule` < LIMIT 1' + ((new Date()).getTime()/1000);
	connection.query(query, function(error, rows){
		if(error)
			return console.log(error);
		if(!rows.length)
			return console.log('no scheduled mail, exiting');
		connection.query('UPDATE `mail` SET locked = 1 WHERE `mailID` = ?', rows[0].mailID);
		for(var i in rows){
			var row = rows[i];
			options.to = row.to;
			options.subject = row.subject;
			options.html = row.html;
			options.text = row.text;
			smtpTransport.sendMail(options, function(error, response){
				if(error)
					console.log(error);
				else
					connection.query('UPDATE `mail` SET ?', {relayTime: ((new Date()).getTime()/1000)}, function(){});
			});
		}
	});

}, 500);
