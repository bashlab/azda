/**
* Editor: Tony Ngan
* This file requires azda.js, abstract out the game object
*/

/// <Readme>
/// Create a new game by calling `var game = azda.Game(opts);`
/// The following object properties are defined inside opts
/// <property> <type><required|optional:default>
///
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
  var roundResult = [];
  var tk=0; // tk is the ticker for each game
  var mode = opts.mode || 'classic';
  var time = opts.time || 1; // repeat the game and choose the best result to submit

  // Public stuff
  /**
  * start <function> : start the game
  */
  this.start = function(){
    this.status = STATE_TYPE.Play;
    worker.postMessage({'cmd':'startTimer'});
    setContentByDocId("inp", this.sequence.seq.split('').map(function(v){return '<div class="char">'+v+'</div>'}).join(''));
  };
  /**
  * reset <function> : reset the game
  */
  this.reset = function(opts){
    worker.postMessage({'cmd':'resetTimer'});
    this.ackNextChar = 0;
    this.status = STATE_TYPE.Menu;
    if(opts!==undefined){
      this.currentTry = 1; // reset
      roundResult = [];
      if(opts.online!==undefined) this.online = opts.online;
      if(opts.retry!==undefined) this.retry = opts.retry;
      if(opts.alias!==undefined){
        postAjaxRequest('/getSeq',JSON.stringify({mode:opts.alias}),function(res){
          jsondata = JSON.parse(res);
          oThis.sequence = jsondata;
          setContentByDocId("count",i18n.title);
          setContentByDocId("inp",jsondata.seq);
        },function(res){
          console.log(res);
        });
      } else {
        setContentByDocId("count",i18n.title);
        setContentByDocId("inp",this.sequence.seq);
      }
    } else{
      setContentByDocId("count",i18n.title);
      setContentByDocId("inp",this.sequence.seq);
    }
  };
  /**
  * end <function> : end the game
  */
  this.end = function(){
    this.status = STATE_TYPE.End;
    roundResult.push(tk);
    var max = roundResult.sort()[0];
    // Todo: Render the round result (No need to consider 1 trial case)
    if(this.retry !== 1){
      setContentByDocId('round','<p>Round '+this.currentTry+': '+azda.cal(tk)+'</p>',false,true);
      setContentByDocId('best','Fastest: ' + azda.cal(max));
    }
    worker.postMessage({'cmd':'endTimer'});
    if(this.retry!=this.currentTry){
      // Still on-going match/practice
      this.currentTry++;
      this.reset();
    } else {
      if(this.online){
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
      } else {
        // In practice mode
        setContentByDocId("inp",i18n.practice,true);
      }
    }
  };
  /**
  * endProcess <function> : after end the game
  */
  this.endProcess = function(){
    var name = id$("name");
    setContentByDocId('round','');
    setContentByDocId('best','');
    // Decision to find maximum round result
    var max = roundResult.sort()[0];
    if(name!==null){
      var nameVal = name.value;
      if(nameVal.length<=0) return;
      // Submit a post to backend
      postAjaxRequest('/submit',JSON.stringify({name:nameVal,ticker:max,sequence:oThis.sequence.seqId}),function(res){
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
  /**
  * retry <int> : // retry time and choose the best result to submit
  */
  this.retry = 1;
  /**
  * currentTry <int>
  */
  this.currentTry = 1;
  /**
  * online <boolean> : // send record if online is true and vice versa
  */
  this.online = true;

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
    //
    oThis.pad = new azda.GamePad();
  })(_bindTimer,mode);

};
