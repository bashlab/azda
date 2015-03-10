/**
* Editor: Tony Ngan
* This file requires azda.js, abstract out the game object
*/

/// <Readme>
/// Create a new game by calling `var game = azda.Game(opts);`
/// The following object properties are defined inside opts
/// <property> <type><required|optional:default>
///
/// base (string)(required): define the game base
/// mode (string)(optional:'Classic'): define the game mode (aka. alias in collection:sequence)
///
azda.Game = function(opts){

  var worker = new Worker('assets/js/worker/cal.js'); //HTML5 Web worker

  // Customization when create a new object
  var oThis = this;
  var postAjaxRequest = azda.postAjaxRequest;
  var setContentByDocId = azda.setContentByDocId;
  var i18n = azda.i18n;
  var id$ = azda.id$; // id query
  var STATE_TYPE = azda.STATE_TYPE;
  var tk=0; // tk is the ticker for each game
  var base = opts.base;
  var mode = opts.mode || 'Classic';

  // Public stuff
  /**
  * start <function> : start the game
  */
  this.start = function(){
    this.status = STATE_TYPE.Play;
    worker.postMessage({'cmd':'startTimer'});
  };
  /**
  * reset <function> : reset the game
  */
  this.reset = function(){
    this.ackNextChar = 0;
    this.status = STATE_TYPE.Menu;
    worker.postMessage({'cmd':'resetTimer'});
    setContentByDocId("count",i18n.title);
    setContentByDocId("inp",this.sequence.seq);
  };
  /**
  * end <function> : end the game
  */
  this.end = function(){
    this.status = STATE_TYPE.End;
    worker.postMessage({'cmd':'endTimer'});
    postAjaxRequest('checkBreakRecord',JSON.stringify({sequence:this.sequence.seqId}),function(res){
      var jsondata = JSON.parse(res);
      var bottomTicker = jsondata.ticker;
      if(bottomTicker !== null){
        if(bottomTicker == -8 || tk<=bottomTicker){
          setContentByDocId("inp","<input placeholder=\""+i18n.namePlaceholder+"\" class=\"textfield\" id=\"name\" type=\"text\" autofocus />",true);
        } else {
          setContentByDocId("inp",i18n.gameOver,true);
        }
      } else {
        setContentByDocId("inp",i18n.submitError,true);
      }
    },function(res){
      worker.postMessage({'cmd':'endTimer'});
    });
  };
  /**
  * endProcess <function> : after end the game
  */
  this.endProcess = function(){
    var name = id$("name");
    if(name!==null){
      var nameVal = name.value;
      if(nameVal.length<=0) return;
      // Submit a post to backend
      postAjaxRequest('/submit',JSON.stringify({name:nameVal,ticker:tk,sequence:oThis.sequence.seqId}),function(res){
        setContentByDocId("inp",oThis.sequence.seq);
        oThis.reset();
      },function(res){
        oThis.reset();
      });
    } else {
      this.reset();
    }
  };
  /**
  * status <number> :
  */
  this.status = STATE_TYPE.Menu;
  /**
  * sequence <object> : contains the sequence information (id,seq,mapping)
  */
  this.sequence = {};
  /**
  * getSessionInfo <function> : maybe useful later
  */
  this.getSessionInfo = function(){
    return {};
  };
  /**
  * ackNextChar <int> : // ackNextChar is the pointer to acknowledge the next character should be typed
  */
  this.ackNextChar = 0;

  // Private stuff
  /**
  * _bindTimer <function> :
  */
  var _bindTimer = function(){
    worker.onmessage = function(e) {
      tk = e.data.tick;
      setContentByDocId("count",e.data.value);
    };
    worker.onerror = function(e) {
      console.log('Error',e);
    };
  };

  // Initialization
  /**
  * anonymous
  */
  (function(){
    // Bind the timer first
    _bindTimer();
    // Get the sequence from mongodb
    // Todo: as to get the sequence by alias, now is hard code in index.js
    postAjaxRequest('/getSeq',JSON.stringify({mode:mode}),function(res){
      jsondata = JSON.parse(res);
      oThis.sequence = jsondata;
      setContentByDocId("inp",jsondata.seq);
      setContentByDocId("count",i18n.title);
    },function(res){
      console.log(res);
    });
  })(_bindTimer,mode);

};
