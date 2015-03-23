var azda = {
  postAjaxRequest: function(url,data,successCallBack,failCallBack){
    var xmlhttp;
    // code for IE7+, Firefox, Chrome, Opera, Safari // code for IE6, IE5
    xmlhttp= window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function()
    {
      var response = xmlhttp.responseText;
      if(xmlhttp.readyState===4){
        var callback = xmlhttp.status===200 ? successCallBack(response) : failCallBack(response);
      }
    };
    xmlhttp.open("post",url,true);
    xmlhttp.setRequestHeader("Content-type","application/json");
    if(data!==null && data!==undefined){
      if(typeof(data)==="object") xmlhttp.send(JSON.stringify(data));
      else if(typeof(data)==="string") {
        try {
            JSON.parse(data); // Try to parse the string and see whether it can be parsed back to object
            xmlhttp.send(data);
        }
        catch(err) {
            xmlhttp.send("");
        }
      }
    }else{
      xmlhttp.send("");
    }
  },
  setContentByDocId: function(id,renderHTML,isFocus,isAppend){
    var queryElm = document.getElementById(id);
    var _isFocus = isFocus || false;
    var _isAppend = isAppend || false;
    if(_isAppend) queryElm.innerHTML += renderHTML;
    else queryElm.innerHTML = renderHTML;
    if(_isFocus){
      var focusElm=queryElm.querySelector('[autofocus]');
      focusElm && focusElm.focus();
    }
  },
  id$: function(id){
    return document.getElementById(id);
  },
  cssClass: function(el){
    var css = (el.getAttribute('class')||'').split(/\s+/);
    css.contains = function(className){
      return this.indexOf(className) >= 0;
    };
    css.add = function(className){
      if(!css.contains(className)){
        this.push(className);
        el.setAttribute('class', this.join(' '));
      }
    };
    css.remove = function(className){
      var idx = this.indexOf(className);
      if(idx >= 0) {
        this.splice(idx, 1);
        el.setAttribute('class', this.join(' '));
      }
    };
    css.toggle = function(className){
      this[this.contains(className) ? remove : add](className);
    };
    return css;
  },
  cal: function(tk){
    var ms=tk%100;
    var s=((tk-ms)/100)%60;
    var mn=Math.floor(((tk-ms)/100)/60);
    return (mn<10?"0"+mn:mn)+":"+(s<10?"0"+s:s)+":"+(ms<10?"0"+ms:ms);
  },
  /**
  * merge: a function to merge two object
  *  - the properties inside aobj will overlap those inside oobj
  */
  merge: function(oobj,aobj){
    for(var _key in aobj){
      oobj[_key] = aobj[_key];
    }
    return oobj;
  },
  STATE_TYPE : {Menu:0, Play:1, End:2},
  KEY : {Backspace:8, Enter: 13, Shift: 16, Ctrl: 17, Alt: 18, Esc: 27, Space:32}
};
