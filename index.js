/*
* Editor: Tony Ngan
* The core file defining the backend configuration (nodejs,mongodb)
* See package.json and use npm install to fetch the essential dependencies
*/
//var fs = require('fs');
var express = require('express');
//var https_options = {key: key,cert: cert};
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var compressor = require('node-minify');
var app = express();
var models = {
  Sequence : require('./models/Sequence')(mongoose),
  Encoding : require('./models/Encoding')(mongoose),
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
mongoose.connect("mongodb://<dbname>:<dbpass>@<dsidx>.mongolab.com:<port>/<appname>"); // Sample String

// Route definition
/*
* GET: /
*/
app.get('/',function(req,res){
  res.render('index');
});

app.post('/getSeq',function(req,res){
  models.Sequence.findSeqIdByAlias("Classic",function(noErr,id){
    res.setHeader("Content-Type", "application/json");
    if(noErr===true) res.send("{\"seq\":\"abcdefghijklmnopqrstuvwxyz\",\"seqId\":\""+id+"\"}");
  });
});

app.post('/getRecord',function(req,res){
  models.Leaderboard.getAllRecordBySeqId(req.body,function(noErr,docs){
    res.setHeader("Content-Type", "application/json");
    var renderHTML = "";
    for(var i=0,j=docs,k=j.length;i<k;++i){
      var doc = docs[i];
      var indic = "";
      if(i===0) indic = "lb-list-item-first";
      else if(i==k-1) indic = "lb-list-item-last";
      renderHTML += "<li class=\\\"lb-list-item "+indic+"\\\">"+"<div class=\\\"lb-list-item-name\\\">"+doc.name+"</div><div class=\\\"lb-list-item-ticker\\\">"+models.Leaderboard.parseTicker(doc.ticker)+"</div></li>";
    }
    renderHTML = "<ul>"+renderHTML+"</ul>";
    if(noErr===true) res.send("{\"renderHTML\":\""+renderHTML+"\"}");
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
