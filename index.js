var http = require('http'),
	fs = require('fs'),
	csv = require('csv'),
	connect = require('connect'),
	Router = require('browserver-router');

var router = Router({
	'/upload' : function(req, res) {
		var json = {},
			first = true;
		fs.readFile(req.files['csv'].path, function(err, content) {
			csv()
			.from('' + content)
			.on('record', function(row, index) {
				if (first) {
					json.headers = row;
					json.data = [];
					first = false;
				} else {
					json.data.push(row);
				}
			}).on('end', function() {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(json));
			});
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
