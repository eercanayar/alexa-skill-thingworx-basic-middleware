require('dotenv').config()

var express = require('express');
var app = express();

var session = require('cookie-session')

var bodyParser = require('body-parser');

app.set('trust proxy', 1)
app.set('port', (process.env.PORT || 5000));

app.use(session({ secret: process.env.SESS_SECRET, cookie: { maxAge: 2592000 }}))

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function(request, response) {
	response.send("Hello!");
});

app.get('/policy', function(request, response) {
	response.send("Policy will be here.");
});

app.get('/auth', function(request, response) {
	
	var sess = request.session;
	
	sess.state = request.query.state;
	sess.client_id = request.query.client_id;
	sess.redirect_uri = request.query.redirect_uri;
	
	var renderHtml = `
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<body style="padding: 2rem;">
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

	<!-- Optional theme -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

	<!-- Latest compiled and minified JavaScript -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

	<h3>Link Thingworx with Amazon Alexa</h3>
	
	<form method="post" action="generateAuth">
	<div class="form-group">
	  <label for="thingworxServer">Thingworx Server IP:port :</label>
	  <input type="text" class="form-control" id="thingworxServer" name="thingworxServer">
	</div>
	<div class="form-group">
	  <label for="thingName">Thing Name :</label>
	  <input type="text" class="form-control" id="thingName" name="thingName">
	</div>
	<div class="form-group">
	  <label for="appkey">appkey :</label>
	  <input type="text" class="form-control" id="appkey" name="appkey">
	</div>
	<input type="submit" class="btn btn-info" value="Submit & Save">
	</form>
	</body>`;
	response.send(renderHtml);
});

app.post('/generateAuth', function(request, response) {
	var sess = request.session;
	
	var thingworxServer = request.body.thingworxServer;
	var thingName = request.body.thingName;
	var appkey = request.body.appkey;
	
	var redirect_alexa = decodeURI(sess.redirect_uri)+
				"#access_token="+thingworxServer+","+thingName+","+appkey+
				"&state="+sess.state+
				"&client_id="+sess.client_id+
				"&response_type=Bearer";
				
				console.log(redirect_alexa);
				response.redirect(redirect_alexa);
				
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


