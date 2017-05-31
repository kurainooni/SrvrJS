var http = require('http');
var fs = require('fs');
var qrystr = require('querystring');
var logger = require("./log.js");
var loggErr = require("./log.js");

var defaultFile = "index.html";
//var process = require("process");

//loggErr.logFileName="error_log-"+loggErr.timesInfo()+".txt";

var message_string = "";


/**
 * returns request URL
 * @param query
 * @param url
 * @returns {*}
 */
function removeQueries(query, url) {

    if (query === "undefined") {
        return url;
    }

    else {
        var retURL = url.split("?");
        return retURL[0];
    }

}

function startServer(name, listenIp, listenPort, contentDir) {
    if (typeof (contentDir) === "undefined") contentDir = "htdocs"; // setting htdocs as default fallback folder
    message_string = "Starting Server: " + name + " on port " + listenPort + " at " + logger.timestamp() + "\r\nWith IP: " + listenIp;
    logger.log(message_string);
    console.log(message_string);
    var server = http.createServer(function (request, response) {

    //console.log(request.headers['user-agent']);


// Get client IP address from request object ----------------------
        var getClientAddress = function (req) {
            return (req.headers['x-forwarded-for'] || '').split(',')[0]
                || req.connection.remoteAddress;
        };

        var getUAString = function (req) {
            return req.headers['user-agent'];
        };

        var req_ip = getClientAddress(request);
        message_string = "IP - " + req_ip + " - Requested File: " + request.url + " On Server " + server.name;
        logger.log(message_string);
        console.log(message_string);
        var gqry; // get queries
        gqry = request.url.slice(1).split("?");
        if (gqry.length >= 2) {
            gqry = gqry[gqry.length - 1];
        }
        else {
            gqry = null;
        }
        !(gqry == null) ? console.log("GET: " + gqry) : null;

        var req_url = request.url;
        req_url = removeQueries(gqry, req_url);
        req_url = req_url.slice(1).split("/");
        var url_last_index = req_url.length - 1;
        if (req_url[url_last_index].split(".").length <= 1) { // checks if url is a directory, assuming '.' as file extension seperator

            req_url[++url_last_index] = "index.html"; // default to defaultFile if url is a directory
            message_string = "Assuming File name '" + req_url[url_last_index] + "'";
            logger.log(message_string);
            console.log(message_string);
        }
        var full_url = req_url.join("/");
        try {
            var res = fs.readFileSync(contentDir + "/" + full_url/*, {'encoding':'utf8','flag':'rs'}*/);
//            var fd = fs.openSync( contentDir+"/"+full_url,"rs");
            response.writeHead(200/*, {"Content-Type": "text/html"}*/);
            response.write(res);
        }
        catch (error) {
            message_string = error.message;
            loggErr.log(message_string);
            console.log(message_string);
//            console.log();
            response.writeHead(404, {"Content-Type": "text/html"});
//        response.write("File not Found (404)")
            try {
                response.writeHead(404, {"Content-Type": "text/html"});
                var e_res = fs.readFileSync(contentDir + "/e404.html", {'encoding': 'utf8', 'flag': 'rs'});
                response.write(e_res);
            }
            catch (error) {
                message_string = error.message;
                loggErr.log(message_string);
//                console.log(message_string);
                response.writeHead(404, {"Content-Type": "text/html"});
                response.write("<title>File not Found (404)</title>404 - File not Found")
            }
        }


//    response.write("Text<br>",'utf8');
        response.end("\n\r");
    });

    server.name = name;
    server.listen(listenPort, listenIp);

    process.on("exit", function () {
        console.log("Shutting down " + server.name);
    });
}

/**
 *	Usage examples:
	startServer("Server Name", "IP address/localhost", "Port", "Server Path")
 */
//var serverIP6 = startServer("Izanagi", '::1', 8080, 'test');
//var serverIP4 = startServer("Izanami", '127.0.0.1', 8080, 'test');

//console.log(logger.logFileName);
