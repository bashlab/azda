var sound = sound || {};

(function(sound, undefined){
  'use strict';

  // HTML5 Audio support flag
  var support = sound.support = typeof window.Audio !== 'undefined';
  var noop = function(){};

  // Audio assets' meta data
  var assets = sound.assets = sound.assets || {};
  assets.keypress = {
    url: 'asset/keypress.mp3'
  };

  // Preload audio assets once
  sound.preload = !support ? noop : function(){
    for(var key in assets){
      var url = assets[key].url;
      if(url) new Audio(url);
    }
  };

  // Create audio asset
  sound.create = !support ? noop : function(name){
    var obj = assets[name] || {},
        url = obj.url,
        a = url ? new Audio(url) : null;
    return a;
  };

  // Create audio asset and immediate play once
  sound.playOnce = !support ? noop : function(name){
    var a = sound.create(name);
    if(a) a.play();
    return a;
  };

})(sound);