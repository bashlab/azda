function cal(tk){

  var ms=tk%100;
  var s=((tk-ms)/100)%60;
  var mn=Math.floor(((tk-ms)/100)/60);
  self.postMessage({'value':(mn<10?"0"+mn:mn)+":"+(s<10?"0"+s:s)+":"+(ms<10?"0"+ms:ms)});
}

self.onmessage = function(e) {
  cal(e.data.value);
};
