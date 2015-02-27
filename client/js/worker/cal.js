/*
 * Web Worker Timer
 */
var self = this;

(function(){
var ticker = (function(){ // Ticker Singleton
  var tk = 0; // Private member
  return {
    inc  : function(){ return ++tk; },
    get  : function(){ return tk; },
    clear: function(){ tk = 0; }
  };
})();

var timer = (function(){
  var intvFunc;
  return {
    start: function (){
      cal(ticker.get());
      intvFunc = intvFunc != null ? intvFunc : setInterval(function(){
        cal(ticker.inc());
      }, 10);
    },
    end: function (){
      clearInterval(intvFunc);
      intvFunc = null;
    },
    reset: function (){
      ticker.clear();
    }
  };
})();

function cal(tk){

  var ms=tk%100;
  var s=((tk-ms)/100)%60;
  var mn=Math.floor(((tk-ms)/100)/60);
  self.postMessage({'tick':ticker.get(),'value':(mn<10?"0"+mn:mn)+":"+(s<10?"0"+s:s)+":"+(ms<10?"0"+ms:ms)});
}

// export function
self.startTimer = timer.start;
self.endTimer   = timer.end;
self.resetTimer = timer.reset;
})();

self.onmessage = function(e) {
  if(e.data && e.data.cmd && typeof self[e.data.cmd] === 'function'){
    self[e.data.cmd]();
  }
};
