(function(){
  'use strict';
  var worker = new Worker('js/worker/cal.js'); //HTML5 Web worker
  var mp=0,tk=0;
  var STATE_TYPE = {Menu:0, Play:1, End:2};
  var KEY = {Backspace:8, Enter: 13, Shift: 16, Ctrl: 17, Alt: 18, Esc: 27, Space:32};
  var seq; // Need to fetch from server
  var mapping;
  var jsondata;
  var postAjaxRequest = azda.postAjaxRequest;
  var setContentByDocId = azda.setContentByDocId;
  var i18n = azda.i18n;
  var state = STATE_TYPE.Menu;

  postAjaxRequest('/getSeq',null,function(res){
    jsondata = JSON.parse(res);
    seq = jsondata.seq;
    mapping = jsondata.mapping;
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

  // Bind timer message handler
  worker.onmessage = function(e) {
    tk = e.data.tick;
    setContentByDocId("count",e.data.value);
  };
  worker.onerror = function(e) {
    console.log('Error',e);
  };

  // Preload audio assets
  sound.preload();

  function resetGame(){
    worker.postMessage({'cmd':'resetTimer'});
    mp = 0;
    state = STATE_TYPE.Menu;
    setContentByDocId("count",i18n.title);
    setContentByDocId("inp",seq);
  }

  function startGame(){
    state = STATE_TYPE.Play;
    worker.postMessage({'cmd':'startTimer'});
  }

  function endGame(){
    state = STATE_TYPE.End;
    setContentByDocId("inp","<input placeholder=\""+i18n.namePlaceholder+"\" class=\"textfield\" id=\"name\" type=\"text\" autofocus />");
    document.getElementById('name').focus();
    worker.postMessage({'cmd':'endTimer'});
  }

  function submitResult(){
    var name = document.getElementById("name").value;
    if(name.length<=0) return;
    // Submit a post to backend
    postAjaxRequest('/submit',JSON.stringify({name:name,ticker:tk,sequence:jsondata.seqId}),function(res){
      setContentByDocId("inp",jsondata.seq);
      resetGame();
    },function(res){
      resetGame();
    });
  }

  // Keydown handler
  window.onkeydown=function(e){
    // Game Logic
    var inp=String.fromCharCode(e.keyCode?e.keyCode:e.which).toLowerCase();
    if(e.keyCode!==KEY.Shift&&e.keyCode!==KEY.Ctrl&&e.keyCode!==KEY.Alt) sound.playOnce('keypress');
    if(state===STATE_TYPE.End){
      if(e.keyCode===KEY.Enter) submitResult();
    } else {
      e.preventDefault();
      if(e.keyCode===KEY.Space){
        resetGame(); //Fast key for restart the game
      } else {
        if(state===STATE_TYPE.Menu) startGame();
        if(mapping[mp]===inp){
          setContentByDocId("inp",'<span class=\"finished\">'+seq.substring(0,mp+1)+'</span>'+seq.substring(mp+1));
          if(mp++===mapping.length-1) endGame();
        }
      }
    }
  };
})();
