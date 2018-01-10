export function setCookie(objName, objValue, objHours) {
  var str = objName + "=" + escape(objValue);
  if (objHours > 0) { //为0时不设定过期时间，浏览器关闭时cookie自动消失 
    var date = new Date();
    var ms = objHours * 3600 * 1000;
    date.setTime(date.getTime() + ms);
    str += "; expires=" + date.toGMTString();
  }
  document.cookie = str;
  //alert("添加cookie成功"); 
}

export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  }
  return "";
}

//清除cookie    
export function clearCookie(name) {
  setCookie(name, "", -1);
}

//数组转下划线字符串    
export function arrayToStrUnderInterval(array) {
  let str = "";
  array.forEach(element => {
    if (str.length > 0) {
      str = str + "_";
    }
    str = str + element.toString();
  });
  return str
}
