
// 'URLmini' - is a rest api service for url minification
//
// Copyright (C) 2014 Christopher Kelley <tsukumokun(at)icloud.com>
//
// This work is licensed under the
// Creative Commons Attribution-NoDerivatives 4.0 International
// License. To view a copy of this license, visit
// http://creativecommons.org/licenses/by-nc-nd/4.0/deed.en_US.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

// Include support files
require('./support/trace.js');

//////////////////////////////////////////////////
///// GET SYSTEM INFORMATION
SYSTEM('Aquiring system information');
//////////////////////////////////////////////////
var ip     = require('ip'),
    addr   = ip.address().split('.');

INFO('Local IPv4: ' + ip.address());

//////////////////////////////////////////////////
///// SERVER CONNECTION
SYSTEM('Setting up server');
//////////////////////////////////////////////////
var
    app     = require('express')(),
    server  = require('http').createServer(app),
    port    = 3000

SYSTEM('Setup to listen on port ' + port);
server.listen(port,function(){
    SYSTEM('Server listening on port ' + port);
});

//////////////////////////////////////////////////
///// SERVER REDIRECTS
SYSTEM('Setting up redirects');
//////////////////////////////////////////////////

// Create a list of all files needed.
// For security reasons only include files
// that should be accessible through http.
var files =
{   '/favicon.ico'      :'/resources/favicon.ico',
    '/background.jpg'   :'/resources/background.ico',
    '/app.css'          :'/css/app.css',

    '/jquery.js'        :'/js/jquery.js',
    '/backstretch.jq.js':'/js/backstretch.jq.js',

    '/main.html'        :'/html/main.html',
    '/main.css'         :'/css/main.css',
    '/made.html'        :'/html/made.html',
    '/made.css'         :'/css/made.css'
};

// For every file in the list create an alias
for (var file in files){
    INFO('Creating alias for ' + file);
    var callback = function(req,res)
    {
        res.sendfile(__dirname + files[file]);
    }
    app.get(file,callback);
}

/**
 * @brief logs the given ip based on its level.
 *
 * @param ip Address of the remote client.
 */
function log_ip(remote){
    // Attempt to notify if there is a request
    // from a strange ip.

    // Obtain address of remote ip and split it
    var pieces = remote.split('.');
    // If the class A section does not match
    if (pieces[0] != addr[0])
    {
        SEVERE('Request from different class A: ' + remote);
    }
    // If the class B section does not match
    else if (pieces[1] != addr[1])
    {
        WARNING('Request from different class B: ' + remote);
    }
    // If the class C section does not match
    else if (pieces[2] != addr[2])
    {
        INFO('Request from different class C: ' + remote);
    }
    // Other wise it must be fine so just print it
    else
    {
        TEXT('Request from local ip: ' + remote);
    }
}

// Setup index functionality
SYSTEM('Setup index functionality');
app.get('/',function(req,res){

    log_ip(req.connection.remoteAddress);

    // If a make is requested.
    if (req.query.make)
    {
        make(req.query.make,res);
    }
    // Otherwise send the index file.
    else
    {
        res.sendfile(__dirname + '/html/index.html');
    }
});

// Setup redirects functionality
SYSTEM('Setup redirects functionality');
app.use(function(req, res, next){
    log_ip(req.connection.remoteAddress);
    go(req.originalUrl.substring(1),res);
});

// Variables used to store the urls
var
    map  = { },
    uid = 3000;

/**
 * @brief Checks if the passed string represents
 *        a valid url.
 *
 * @param {String} str String to check.
 */
function _is_url(str) {
    return /^((https?|ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(str);
}

/**
 * @brief Makes a minified url and redirects
 *        the page to a display for this url.
 *
 * @param {String} req The requested url to minify.
 * @param {Object} res The response object to send the
 *                     page on minify.
 */
function make(req,res)
{
    // Checks if the passed url to request is valid
    if (! _is_url(req))
    {
        res.redirect('/?error=badurl');

        return;
    }
    // Given the url was valid make the alias and
    // send the appropriate page

    // Create a unique id and encode it to base 36
    var id = (uid++).toString(36);
    INFO('URL created with id: ' + id + ' for ' + req);

    map[id] = req;
    res.redirect('/?made=' + id);

}

/**
 * @brief Redirects the page to the mapped value.
 *
 * @param {String} req The requested url to minify.
 * @param {Object} res The response object to send the
 *                     page for redirect.
 */
function go(req,res)
{
    INFO('Searching map for id: ' + req);
    res.redirect(map[req]);
}
