/*
* Editor: Tony Ngan
* This file requires azda.js and using font-awesome
*/

azda.SugarPanel = function(opts){

  // Customization when create a new object
  var oThis = this;
  var setContentByDocId = azda.setContentByDocId;
  var id$ = azda.id$;
  var renderID = opts.renderID;

  // Public stuff
  /*
  * show <function> : css trick to show the sugarpanel
  */
  this.show = function(){
    if(this.isClosed) {
      this.template.getPanel().style.visibility = 'visible';
      this.isClosed = false;
    }
  };
  /*
  * hide <function> : css trick to hide the sugarpanel
  */
  this.hide = function(){
    if(!this.isClosed) {
      this.template.getPanel().style.visibility = 'hidden';
      this.isClosed = true;
    }
  };
  /*
  * isClosed <boolean> : determine whether it is closed
  */
  this.isClosed = true;
  /*
  * renderBody <function> : render the panel body externally
  */
  this.renderBody = function(body){
    setContentByDocId(this.template.idClassSet.panelBody,body);
  };
  /*
  * template <object>
  */
  this.template = {
    idClassSet: {
      panel: "sugarpanel",
      panelHeadClass: "panelhead",
      panelBody: "sugarpanelbody",
      panelBodyClass: "panelbody",
      panelHeadIcon : "panelheadicon",
      panelHeadTitle: "panelheadtitle"
    },
    rawHTML: "<div class=\"panel\" id=\"%panel%\"><div class=\"%panelHeadClass%\"><i id=\"%panelHeadIcon%\"></i><p id=\"%panelHeadTitle%\"></p></div><div class=\"%panelBodyClass%\" id=\"%panelBody%\"></div></div>",
    build: function(){
      var _h = this.rawHTML;
      var _s = this.idClassSet;
      for(var _key in _s) {
        if (_s.hasOwnProperty(_key)) _h = _h.replace("%"+_key+"%",_s[_key]); // doesn't check down the prototype chain
      }
      return _h;
    },
    getPanel: function(){
      return id$(this.idClassSet.panel);
    },
    getPanelBody: function(){
      return id$(this.idClassSet.panelBody);
    }
  };
  /*
  * sugarCfg <object> : configuration of different sugars
  * - leaderBoard: display the record
  * - modeBoard: change game bases and modes
  */
  this.sugarCfg = {
    leaderboard: {
      iconClass: "fa fa-trophy leaderboardIcon",
      headTitle: "Leaderboard",
    },
    modeboard: {
      iconClass: "fa fa-gamepad modeboardIcon",
      headTitle: "Game modes",
    }
  };
  /*
  * openSugar <function> : open the panel by calling the key in sugarCfg
  */
  this.openSugar = function(boardKey,body){
    var _cfg = this.sugarCfg[boardKey];
    var _body = body || "";
    var _idClass = this.template.idClassSet;
    if(_cfg){
      id$(_idClass.panelHeadIcon).className = _cfg.iconClass;
      setContentByDocId(_idClass.panelHeadTitle,_cfg.headTitle);
      this.renderBody(body);
      this.show();
    }
  };
  /*
  * createSugarOnClickHandler <function> : add the onclick handler for opening the sugar panel
  */
  this.addSugarOnClickHandler = function(boardKey,renderBody){
    id$(boardKey).onclick = function(event){
      event.stopPropagation();
      if(typeof(renderBody)==='function'){
        renderBody(function(_body){
          oThis.openSugar(boardKey,_body);
        });
      } else if(typeof(renderBody)==='string'){
        oThis.openSugar(boardKey,renderBody);
      } else {
        oThis.openSugar(boardKey,"");
      }
    };
  };

  // Private stuff
  /*
  * _render <function> : render template in the beginning
  */
  var _render = function(id){
    setContentByDocId(id,oThis.template.build(),false,true);
  };
  /*
  * _endPropagate <function> : click the main panel would not close itself
  */
  var _endPropagate = function(){
    oThis.template.getPanel().onclick = function(event){
      event.stopPropagation();
    };
  };

  // Initialization
  (function(){
    _render(renderID);
    _endPropagate();
  })(_render,_endPropagate);
};
