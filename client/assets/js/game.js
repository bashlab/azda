(function(){
  'use strict';
  var postAjaxRequest = azda.postAjaxRequest;
  var setContentByDocId = azda.setContentByDocId;
  var STATE_TYPE = azda.STATE_TYPE;
  var KEY = azda.KEY;

  var worker = new Worker('assets/js/worker/cal.js'); //HTML5 Web worker
  var mp=0,tk=0;
  var seq; // Need to fetch from server
  var mapping;
  var jsondata;
  var i18n = azda.i18n;
  var state = STATE_TYPE.Menu;
  var sugarPanel = document.getElementById("sugarpanel");

  postAjaxRequest('/getSeq',null,function(res){
    jsondata = JSON.parse(res);
    seq = jsondata.seq;
    mapping = jsondata.mapping;
    setContentByDocId("inp",seq);
    setContentByDocId("count",i18n.title);
    document.getElementById("leaderboard").onclick = function(event){
      // Do the click handler for leaderboard icon
      sugarPanel.style.visibility = 'visible';
      event.stopPropagation();
      postAjaxRequest('/getRecord',JSON.stringify({sequence:jsondata.seqId}),function(res){
        var jsondata = JSON.parse(res);
        var renderHTML = "";
        if(jsondata){
          for(var i=0,j=jsondata,k=j.length;i<k;++i){
            var doc = j[i];
            var indic = "";
            if(i===0) indic = "lb-list-item-first";
            else if(i==k-1) indic = "lb-list-item-last";
            renderHTML += "<div class=\"ranking\"><p>"+(i+1)+"</p></div><li class=\"lb-list-item "+indic+"\">"+"<div class=\"lb-list-item-name\">"+doc.name+"</div><div class=\"lb-list-item-ticker\">"+doc.ticker+"</div></li>";
          }
        }
        setContentByDocId("sugarpanelbody",renderHTML);
      },function(res){
      });
    };
    document.documentElement.onclick = function(event){
      // Click empty space to close the panel
      sugarPanel.style.visibility = 'hidden';
    };
    sugarPanel.onclick = function(event){
      event.stopPropagation();
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
