/*
* Editor: Tony Ngan
* The core file defining the backend configuration (nodejs,mongodb)
* See package.json and use npm install to fetch the essential dependencies
*/
//var fs = require('fs');
var _mode = process.env.NODE_ENV;
var express = require('express');
//var https_options = {key: key,cert: cert};
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var compressor = require('node-minify');
var app = express();
var models = {
	Sequence : require('./models/Sequence')(mongoose),
	Leaderboard : require('./models/Leaderboard')(mongoose)
};

/*
* App Constant
* (Pending) Put them inside a config module
*/
var PORT = process.env.PORT || 5000;
var HOST = 'localhost';
/*
* App configuration
*/
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // Support using JSON rather than form data
app.use(express.static(__dirname + '/client'));

switch(_mode){
	case "production":{
		// Contact project administrator to get the credentials
		break;
	}
	default:{
		// Sample connection string, you can make your own in development environment
		mongoose.connect("mongodb://localhost:27017/azda");
	}
}

// Route definition
/*
* GET: /
*/
app.get('/',function(req,res){
	res.render('index');
});

app.post('/getSeq',function(req,res){
	models.Sequence.findSeqInfoByAlias(req.body,function(noErr,doc){
		res.setHeader("Content-Type", "application/json");
		var mapping = doc.mapping === 'default' ? doc.seq : doc.mapping;
		if(noErr===true) res.send("{\"seq\":\""+doc.seq+"\",\"seqId\":\""+doc.id+"\",\"mapping\":\""+mapping+"\"}");
	});
});

app.post('/getRecord',function(req,res){
	models.Leaderboard.getAllRecordBySeqId(req.body,function(noErr,docs){
		res.setHeader("Content-Type", "application/json");
		res.send(docs);
	});
});

app.post('/checkBreakRecord',function(req,res){
	models.Leaderboard.getBottommostRecordBySeqId(req.body,function(noErr,ticker){
		res.setHeader("Content-Type", "application/json");
		res.send("{\"ticker\":"+(noErr ? ticker : null)+"}");
	});
});

app.post('/submit',function(req,res){
	models.Leaderboard.processSubmit(req.body,function(noErr,msg){
		res.setHeader("Content-Type", "application/json");
		res.send("{\"success\":"+noErr+",\"msg\":\""+msg+"\"}");
	});
});

/*
* Start appliation
*/
app.listen(PORT, function(){
  console.log('azda is running at port:'+PORT);
});
