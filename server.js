var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');

app.get('/', function (req, res){
	res.sendFile(__dirname + '/index.html');
});

var clients = [];

io.on('connection', function(client){
	console.log('An user connected');
	if (client.name !== 'undefined'){
		clients.push(client.name);
		io.emit('connected clients', clients);
	}
	client.on('disconnect', function(){
		console.log(client.name + ' disconnected');
		io.emit('message', client.name + ' left');
		clients.splice(clients.indexOf(client.name),1);
		io.emit('connected clients', clients);
	}).on('registration', function(name){
		client.name = name;
		console.log('%s joined', name);
		io.emit('message', name + ' joined');
		clients.push(name);
		io.emit('connected clients', clients);
	}).on('chat message', function(data){
		console.log(data.name + ': ' + data.msg);
		io.emit('chat message', { name: data.name, msg: data.msg });
	});
});

http.listen(3000, function(){
	var host = http.address().adress;
	var port = http.address().port;
	console.log('Server listening at http://%s:%s', host, port);
});
