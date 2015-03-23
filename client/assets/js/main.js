(function(){
  'use strict';
  var postAjaxRequest = azda.postAjaxRequest;
  var setContentByDocId = azda.setContentByDocId;
  var STATE_TYPE = azda.STATE_TYPE;
  var KEY = azda.KEY;

  var sugarPanel = new azda.SugarPanel({
    renderID: "wrapper"
  });
  var game = new azda.Game({});
  var pad = game.pad;

  // Preload audio assets
  sound.preload();

  // Use to follow JSLint, cannot create function inside a loop
  function padHandler(){
    return function(e){
      setContentByDocId('round','');
      setContentByDocId('best','');
      var _id = e.target.id;
      pad.processButtonClick(_id,function(_cfg){
        game.reset(_cfg);
      });
    };
  }

  sugarPanel.addSugarOnClickHandler("leaderboard",function(callback){
    postAjaxRequest('/getRecord',JSON.stringify({sequence:game.sequence.seqId}),function(res){
      var jsondata = JSON.parse(res);
      var renderHTML = "";
      if(jsondata){
        for(var i=0,j=jsondata,k=j.length;i<k;++i){
          renderHTML += sugarPanel.template.leaderboard.getHTML(i+1,j[i]);
        }
      }
      callback(renderHTML);
    },function(res){
    });
  });

  sugarPanel.addSugarOnClickHandler("modeboard",function(callback){
    callback(pad.renderHTML); // pre-processing, see azda.GamePad
    var buttons = document.getElementsByClassName("select-button");
    for(var i=0, j=buttons.length;i<j;++i){
      buttons[i].onclick = padHandler();
    }
  });

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
