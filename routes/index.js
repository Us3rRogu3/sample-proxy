var express = require('express');
var http = require('http');
var httpProxy = require('http-proxy');
var request = require('request');
var router = express.Router();
var DOMParser = require('dom-parser');

var proxy = httpProxy.createProxyServer({});

var parser = new DOMParser();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });

});

router.get('/api/*', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    var url = req.params[0];
    console.log('asdasdsa' + url);
    request({method: 'GET', uri: url}, function(error, response, body){
        // console.log('error', error);
        // console.log('statuscode', response && response.statusCode);
        // console.log('body', body);
    }).on('data', function(data){
        // console.log('chunk is '+ data);
        data = data.toString().replace(/href="\//g, `href="${req.params[0]}/`);
        data = data.replace(/url\(\//g, `url(${req.params[0]}/`);
        data = data.replace(/'\//g, `'${req.params[0]}/`);
        data = data.replace(/src="\//g, `src="${req.params[0]}/`);
        var dom = parser.parseFromString(data);
        var x;
        x = dom.getElementsByTagName("a");
        for(var i =0; i<x.length; i++){
            console.log(x[i].attributes);
            for(var j = 0; j<x[i].attributes.length; j++){
                if(x[i].attributes[j].name == 'href'){
                    x[i].attributes[j].value = "/api/" + x[i].attributes[j].value;
                }
            }
        }
        console.log(dom);
        console.log("");
        console.log("");
        res.write(dom['rawHTML']);
    }).on('response', function(response){
        response.on('data', function(data){
            // console.log('response is ' + data);
            // res.end();
        });
    }).on('end', function(){
        res.end();
    });
});
// router.post('/api', function(req, res, next){
//     var options = {
//         host: req.body.url,
//         path: '/',
//         method: req.body.method
//     };
//     console.log(options);
//     var req2 = http.request(options, function(res2){
//         res2.setEncoding('utf8');
//         res.setHeader('HOST', req.body.url);
//         res2.on('data', function(chunk){
//             console.log('new chunk');
//             // console.log(chunk);
//             // chunk = chunk.replace(/"\//g, '"http://' + req.body.url + "/");
//             // chunk = chunk.replace(/\(\//g, '(http://' + req.body.url + "/");
//             console.log("post replace");
//             console.log(chunk);
//             console.log("     this is done");
//             res.write(chunk);
//         });
//         res2.on('close', function(){
//             console.log('closed');
//             // res.writeHead(res2.statusCode);
//             res.end("");
//         });
//         res2.on('end', function(){
//             console.log('ended');
//             // res.writeHead(res2.statusCode);
//             res.end("");
//         });
//     }).on('error', function(err){
//         console.log("error");
//         console.log(err);
//         res.writeHead(500);
//         res.end();
//     });
//     req2.end();
// });
//
// router.post('/api2', function(req, res, next){
//     console.log('jerrere');
//     proxy.web(req, res, {target: req.body.url, method: 'GET'});
//
//     //
//     // Listen for the `error` event on `proxy`.
//     proxy.on('error', function (err, req, res) {
//     res.writeHead(500, {
//       'Content-Type': 'text/plain'
//     });
//
//     res.end('Something went wrong. And we are reporting a custom error message.' + err);
//     });
//
//     //
//     // Listen for the `proxyRes` event on `proxy`.
//     //
//     proxy.on('proxyRes', function (proxyRes, req, res) {
//     console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
//     });
//
//     //
//     // Listen for the `open` event on `proxy`.
//     //
//     proxy.on('open', function (proxySocket) {
//     // listen for messages coming FROM the target here
//     proxySocket.on('data', function(data){
//       console.log(data);
//     });
//     });
//
//     //
//     // Listen for the `close` event on `proxy`.
//     //
//     proxy.on('close', function (res, socket, head) {
//     // view disconnected websocket connections
//     console.log('Client disconnected');
//     });
// });

module.exports = router;
