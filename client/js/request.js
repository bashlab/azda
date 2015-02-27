var azdart = {
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
  setContentByDocId: function(id,renderHTML,isAppend){
    document.getElementById(id).innerHTML = renderHTML;
  }
};
