var express = require('express'),
	stylus = require('stylus'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile (str, path) {
	return stylus(str).set('filename', path);
}

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser());
app.use(stylus.middleware(
	{
		src: __dirname + '/public',
		compile: compile
	}
));

app.get('/partials/:partialPath', function(request, response) {
	response.render('partials/' + request.params.partialPath);
});

//serve all files from /public directory
app.use(express.static(__dirname + '/public'));

app.get('*', function(request, response) {
	response.render('index', {
		mongoMessage: mongoMessage
	});
});


var port = 3030;
app.listen(port);

console.log('Listening on port ' + port + '...');

mongoose.connect('mongodb://127.0.0.1/multivision');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error ...'));

db.once('open', function callback() {
	console.log('multivision db opened');
});

var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message.findOne().exec(function(err, messageDoc){
	mongoMessage = messageDoc.message;
});





