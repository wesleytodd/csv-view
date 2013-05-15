var http = require('http'),
	fs = require('fs'),
	csv = require('csv'),
	connect = require('connect'),
	Router = require('browserver-router');

var router = Router({
	'/upload' : function(req, res) {
		var json = [];

		csv()
			.from
			.stream(fs.createReadStream(req.files['csv'].path))
			.on('record', function(row, index) {
				json.push(row);
			})
			.on('end', function() {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(json));
			});

	}
});

var app = connect()

	.use(connect.favicon())
	.use(connect.static('public'))
	.use(connect.directory('public'))
	.use(connect.bodyParser())
	.use(router);

http.createServer(app).listen(1234);
