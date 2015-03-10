(function(){
  'use strict';
  var postAjaxRequest = azda.postAjaxRequest;
  var setContentByDocId = azda.setContentByDocId;
  var i18n = azda.i18n;
  var id$ = azda.id$; // id query
  var STATE_TYPE = azda.STATE_TYPE;
  var KEY = azda.KEY;
  var jsondata;

  var sugarPanel = new azda.SugarPanel({
    renderID: "wrapper"
  });

  var game = new azda.Game({
    // base, mode is defined here
  });

  // Preload audio assets
  sound.preload();

  document.documentElement.onclick = function(event){
    // Click empty space to close the panel
    sugarPanel.hide();
  };

  sugarPanel.addSugarOnClickHandler("leaderboard",function(callback){
    postAjaxRequest('/getRecord',JSON.stringify({sequence:game.sequence.seqId}),function(res){
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
      callback(renderHTML);
    },function(res){
    });
  });

  sugarPanel.addSugarOnClickHandler("modeboard","");

  // Keydown handler
  window.onkeydown=function(e){
    // Game Logic
    var _seqObj = game.sequence;
    var inp = String.fromCharCode(e.keyCode?e.keyCode:e.which).toLowerCase();
    if(e.keyCode!==KEY.Shift&&e.keyCode!==KEY.Ctrl&&e.keyCode!==KEY.Alt) sound.playOnce('keypress');
    if(game.status===STATE_TYPE.End){
      if(e.keyCode===KEY.Enter) game.endProcess();
    } else {
      e.preventDefault();
      if(e.keyCode===KEY.Space){
        game.reset(); //Fast key for restart the game
      } else if (e.keyCode === KEY.Esc){
        sugarPanel.hide();
      }
      else {
        if(game.status===STATE_TYPE.Menu) game.start();
        if(_seqObj.mapping[game.ackNextChar]===inp){
          setContentByDocId("inp",'<span class=\"finished\">'+_seqObj.seq.substring(0,game.ackNextChar+1)+'</span>'+_seqObj.seq.substring(game.ackNextChar+1));
          if(game.ackNextChar++===_seqObj.mapping.length-1) game.end();
        }
      }
    }
  };
})();
