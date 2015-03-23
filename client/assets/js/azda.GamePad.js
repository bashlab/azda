/*
* Editor: Tony Ngan
* This static file requires azda.js, describe the game logic
*/
/*jshint multistr: true */

azda.GamePad = function(){

  var oThis = this;

  this.bases = {
    'match':{
      online: true
    },
    'practice':{
      online: false  //no need to send out the result
    },
  };

  this.trials = {
    'one':{
      retry: 1
    },
    'triple':{
      retry: 3
    },
  };

  this.modes = {
    'asc':{
      alias: 'classic',
    },
    'desc':{
      alias: 'reverse',
    },
  };

  /*
  * template <object>
  */
  this.template = {
    idClassSet: {
      baseMatchButton : 'base-match',
      basePracticeButton : 'base-practice',
      timeOneButton: 'time-one',
      timeTripleButton: 'time-triple',
      modeAscButton: 'mode-asc',
      modeDescButton: 'mode-desc',
      baseMatchButtonClass: 'fa fa-shield fa-2x',
      basePracticeButtonClass: 'fa fa-male fa-2x',
      timeOneButtonClass: 'fa fa-minus fa-2x',
      timeTripleButtonClass: 'fa fa-bars fa-2x',
      modeAscButtonClass: 'fa fa-sort-alpha-asc fa-2x',
      modeDescButtonClass: 'fa fa-sort-alpha-desc fa-2x',
      commonButtonClass: 'select-button',
      hotKeyClass: 'hot-key'
    },

    rawHTML: "\
    <ul class=\"slides\">\
      <input type=\"radio\" name=\"radio-btn\" id=\"screen-1\" checked />\
      <li class=\"slide-container\">\
        <div class=\"slide\">\
          <div class=\"sb-row\">\
            <div id=\"base-match\" class=\"%commonButtonClass%\"><i class=\"%baseMatchButtonClass%\"></i><div class=\"%hotKeyClass%\">Match</div></div>\
            <div id=\"base-practice\" class=\"%commonButtonClass%\"><i class=\"%basePracticeButtonClass%\"></i><div class=\"%hotKeyClass%\">Practice</div></div>\
          </div>\
        </div>\
      </li>\
      <input type=\"radio\" name=\"radio-btn\" id=\"screen-2\" />\
      <li class=\"slide-container\">\
        <div class=\"slide\">\
          <div class=\"sb-row\">\
            <div id=\"time-one\" class=\"%commonButtonClass%\"><i class=\"%timeOneButtonClass%\"></i><div class=\"%hotKeyClass%\">Once</div></div>\
            <div id=\"time-triple\" class=\"%commonButtonClass%\"><i class=\"%timeTripleButtonClass%\"></i><div class=\"%hotKeyClass%\">Triple</div></div>\
          </div>\
        </div>\
      </li>\
      <input type=\"radio\" name=\"radio-btn\" id=\"screen-3\" />\
      <li class=\"slide-container\">\
        <div class=\"slide\">\
          <div class=\"sb-row\">\
            <div id=\"mode-asc\" class=\"%commonButtonClass%\"><i class=\"%modeAscButtonClass%\"></i><div class=\"%hotKeyClass%\">Classic</div></div>\
            <div id=\"mode-desc\" class=\"%commonButtonClass%\"><i class=\"%modeDescButtonClass%\"></i><div class=\"%hotKeyClass%\">Reverse</div></div>\
          </div>\
        </div>\
      </li>\
      \
      <li class=\"nav-dots\">\
        <label for=\"screen-1\" class=\"nav-dot\" id=\"screen-dot-1\"></label>\
        <label for=\"screen-2\" class=\"nav-dot\" id=\"screen-dot-2\"></label>\
        <label for=\"screen-3\" class=\"nav-dot\" id=\"screen-dot-3\"></label>\
      </li>\
    </ul>",

    build: function(){
      var _h = this.rawHTML;
      var _s = this.idClassSet;
      for(var _key in _s) {
        if (_s.hasOwnProperty(_key)) _h = _h.replace(new RegExp('%'+_key+'%','g'),_s[_key]); // doesn't check down the prototype chain
        }
        return _h;
      },
    };

  this.renderHTML = "";

  this.getConfig = function(bid,tid,mid){
    var _cfg = {};
    if(bid!==undefined) _cfg.online = oThis.bases[bid].online;
    if(tid!==undefined) _cfg.retry = oThis.trials[tid].retry;
    if(mid!==undefined) _cfg.alias = oThis.modes[mid].alias;
    return _cfg;
  };

  this.processButtonClick = function(id,callback){
    if(id===null) return;
    // change the class
    //
    var generic = id.split('-');
    var bid,tid,mid;
    switch(generic[0]){
      case 'base':{
        bid = generic[1];
        break;
      }
      case 'time':{
        tid = generic[1];
        break;
      }
      case 'mode':{
        mid = generic[1];
        break;
      }
      default:
        break;
      }
      callback(oThis.getConfig(bid,tid,mid));
  };

  var _preprocess = function(){
    oThis.renderHTML = oThis.template.build();
  };

  // Initialization
  (function(){
    _preprocess();
  })(_preprocess);

};
