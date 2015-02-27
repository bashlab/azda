(function(){
  'use strict';
  var worker = new Worker('js/worker/cal.js'); //HTML5 Web worker
  var mp=0,tk=0;
  var STATE_TYPE = {Menu:0, Play:1, End:2};
  var gameState = STATE_TYPE.Menu;
  var seq; // Need to fetch from server
  var jsondata;
  var postAjaxRequest = azdart.postAjaxRequest;
  var setContentByDocId = azdart.setContentByDocId;

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

  worker.onmessage = function(e) {
    tk = e.data.tick;
    setContentByDocId("count",e.data.value);
  };
  worker.onerror = function(e) {
    console.log('Error',e);
  };

  function resetGame(){
    worker.postMessage({'cmd':'resetTimer'});
    mp = 0;
    gameState = STATE_TYPE.Menu;
    setContentByDocId("count",i18n.title);
    setContentByDocId("inp",seq);
  }

  function startGame(){
    gameState = STATE_TYPE.Play;
    worker.postMessage({'cmd':'startTimer'});
  }

  function endGame(){
    gameState = STATE_TYPE.End;
    setContentByDocId("inp","<input placeholder=\""+i18n.namePlaceholder+"\" class=\"textfield\" id=\"name\" type=\"text\" />");
  }

  function submitResult(){
    // Submit a post to backend
    postAjaxRequest('/submit',JSON.stringify({name:document.getElementById("name").value,ticker:tk,sequence:jsondata.seqId}),function(res){
      setContentByDocId("inp",jsondata.seq);
      resetGame();
    },function(res){
      resetGame();
    });
  }

  window.onkeydown=function(e){
    // Game Logic
    var inp=String.fromCharCode(e.keyCode?e.keyCode:e.which).toLowerCase();
    if(gameState===STATE_TYPE.End){
      if(e.keyCode===13) submitResult(); // #ENTER key
    } else {
      if(e.keyCode===32){ // #SPACE key
        resetGame(); //Fast key for restart the game (using #space)
      } else {
        if(gameState===STATE_TYPE.Menu) startGame();
        if(seq[mp]===inp){
          setContentByDocId("inp",'<span class=\"finished\">'+seq.substring(0,mp+1)+'</span>'+seq.substring(mp+1));
          if(mp++===seq.length-1) endGame();
        }
      }
    }
  };
})();
