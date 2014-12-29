(function(){
  'use strict';
  var worker = new Worker('js/worker/cal.js'); //HTML5 Web worker
  var mp=0,c=null;
  var ENDFLAG = false;
  var seq; // Need to fetch from server
  var jsondata;
  var postAjaxRequest = azdart.postAjaxRequest;
  var setContentByDocId = azdart.setContentByDocId;
  var ticker = new TickerSingleton();

  function TickerSingleton(){
    var tk = 0; // Private member in class
    this.inc = function(){
      tk++; // Privileged
    };
    this.get = function(){
      return tk;
    };
    this.clear = function(){
      tk = 0;
    };
  }

  postAjaxRequest('/getSeq',null,function(res){
    jsondata = JSON.parse(res);
    seq = jsondata.seq;
    setContentByDocId("inp",seq);
    setContentByDocId("count",i18n.title);
    document.getElementById("leaderboard").onclick = function(){
      // Do the click handler for leaderboard icon
      document.getElementById("sugarpanel").style.visibility = 'visible';
      postAjaxRequest('/getRecord',JSON.stringify({sequence:jsondata.seqId}),function(res){
        var jsondata = JSON.parse(res);
        setContentByDocId("sugarpanelbody",jsondata.renderHTML);
      },function(res){
      });
    };
    document.getElementById("close").onclick = function(){
      document.getElementById("sugarpanel").style.visibility = '';
    };
  },function(res){
  });

  function launchCounter() {
    worker.onmessage = function(e) {
      setContentByDocId("count",e.data.value);
    };
    worker.onerror = function(e) {
      console.log('Error',e);
    };
    worker.postMessage({'cmd':'cal','value': ticker.get()});
  }

  function resetGame(){
    ticker.clear();
    mp = 0;
    ENDFLAG = false;
    setContentByDocId("count",i18n.title);
    setContentByDocId("inp",seq);
    clearInterval(c);
    c = null;
  }

  function startGame(){
    c=setInterval(function(){
      ticker.inc();
      launchCounter();
    },10);
  }

  function endGame(){
    clearInterval(c);
    ENDFLAG = true;
    c = null;
    setContentByDocId("inp","<input placeholder=\""+i18n.namePlaceholder+"\" class=\"textfield\" id=\"name\" type=\"text\" />");
  }

  function submitResult(){
    // Submit a post to backend
    postAjaxRequest('/submit',JSON.stringify({name:document.getElementById("name").value,ticker:ticker.get(),sequence:jsondata.seqId}),function(res){
      setContentByDocId("inp",jsondata.seq);
      resetGame();
    },function(res){
      resetGame();
    });
  }

  window.onkeydown=function(e){
    // Game Logic
    var inp=String.fromCharCode(e.keyCode?e.keyCode:e.which).toLowerCase();
    if(ENDFLAG){
      if(e.keyCode===13) submitResult();
    } else {
      if(e.keyCode===32){
        resetGame(); //Fast key for restart the game (using #space)
      } else {
        if(c===null) startGame();
        if(seq[mp]===inp){
          setContentByDocId("inp",'<span class=\"finished\">'+seq.substring(0,mp+1)+'</span>'+seq.substring(mp+1));
          if(mp++===seq.length-1) endGame();
        }
      }
    }
  };
})();
