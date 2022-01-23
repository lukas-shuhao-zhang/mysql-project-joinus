var express = require('express');
var app = express();
var faker = require('@faker-js/faker');
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'join_us'
	});


app.get("/", function(req, res){
	var q = 'SELECT COUNT(*) AS count, COUNT(IF(DATEDIFF(NOW(),created_at) < 7,1,NULL)) last_week FROM users';
	connection.query(q, function(error, result){
		if (error) throw error;
		var count = result[0].count;
		var last_week = result[0].last_week;
		res.render('home', {data: count, last_week_num: last_week});
	})
});

app.post('/register', function(req,res){
	var person = {
		email: req.body.email
	};
	connection.query('INSERT INTO users SET ?', person, function(error, result){
		if (error) throw error;
		res.redirect('/')
	})
})


app.listen(3000, function(){
	console.log('Server running on 3000!')
});