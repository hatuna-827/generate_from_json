"use strict"
console.log(q)
function GetScriptParams() {
    var src = location.href;
    var query = src.substring(src.indexOf('?') + 1)
    var parameters = query.split('&')
    var result = new Object()
    for (var i = 0; i < parameters.length; i++) {
        var element = parameters[i].split('=')
        var paramName = decodeURIComponent(element[0])
        var paramValue = decodeURIComponent(element[1])
        result[paramName] = paramValue
    }
    console.log(result)
    return result
}
