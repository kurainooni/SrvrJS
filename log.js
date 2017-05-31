var fs = require("fs");

/**
 * gibt einen timestamp aus
 * @returns {string}
 */
    exports.timestamp =function(){
        var date = new Date();
        var d = date.getDate();
        var month = date.getMonth();
        var milli = date.getMilliseconds();
//        console.log(milli);
        var y = date.getFullYear();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        return ""+y+"/"+num_padding_2(month+1)+"/"+num_padding_2(d)+" - "+num_padding_2(h)+":"+num_padding_2(m)+":"+num_padding_2(s)+":"+num_padding_3(milli);
    };

exports.timesInfo =function(){
        var date = new Date();
        var d = date.getDate();
        var month = date.getMonth();
        var y = date.getFullYear();
        return ""+y+num_padding_2(month+1)+num_padding_2(d);
    };

exports.logFileName="log-"+exports.timesInfo()+".txt";
exports.logDir="log/";


exports.log=function(text){
    var fd = fs.openSync(exports.logDir+exports.logFileName,"a+");
    fs.writeSync(fd,text+"\r\n");
    fs.closeSync(fd);
};

/**
 * padds number with leading zero if less than 10. returns number as string
 * @param number
 * @returns {string}
 */
function num_padding_2(number){
    var num_string = "";
    num_string += number<10?"0"+number:number;
    return num_string;
}

/**
 * padds number with leading zeroes if less than 100. returns number as string
 * @param number
 * @returns {string}
 */
function num_padding_3(number){
    var num_string = "";
    if (number<100){
        num_string = number<10?"00":"0";
    }
    num_string += number;
    return num_string;
}