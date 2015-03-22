var azda = {
  postAjaxRequest: function(url,data,successCallBack,failCallBack){
    var xmlhttp;
    // code for IE7+, Firefox, Chrome, Opera, Safari // code for IE6, IE5
    xmlhttp= window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function()
    {
      var response = xmlhttp.responseText;
      xmlhttp.readyState===4 && xmlhttp.status===200 ? successCallBack(response) : failCallBack(response);
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
  setContentByDocId: function(id,renderHTML,isFocus){
    var queryElm = document.getElementById(id);
    var _isFocus = isFocus || false;
    queryElm.innerHTML = renderHTML;
    if(_isFocus){
      var focusElm=queryElm.querySelector('[autofocus]');
      focusElm && focusElm.focus();
    }
  },
  STATE_TYPE : {Menu:0, Play:1, End:2},
  KEY : {Backspace:8, Enter: 13, Shift: 16, Ctrl: 17, Alt: 18, Esc: 27, Space:32}
};
