
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

/***
 Trace - a detailed logging module.
 ***/

//Trace supports colored output to quickly
//distinguish types of logged messages.
require('colors');

/**
 * @brief resizes a string to fit a specific length.
 *
 * This method will pad a string with the specified
 * character until it is the specified length.
 * If the string is too long, it will be trimmed to
 * the specified length.
 *
 * @param str String to pad or trim (resize).
 * @param len Length to resize string to.
 * @param pad Character to pad the string with if necessary.
 *
 * @return The string resized as specified.
 */
function str_resize(str,len,pad)
{
    // Default padding character is a space
    pad = pad || ' ';
    if (len > str.length)
    {
        // Add as many characters as needed to meet the
        // length requirement
        str += Array(len + 1 - str.length).join(pad)
    }
    else
    {
        // Trim the string
        str = str.substring(0,len);
    }

    return str;
}

/**
 * @brief formats the given message by adding the file
 *        and line number from which the trace was called.
 *
 * @param message The message to be formatted.
 *
 * @return The message prefixed by the mentioned information.
 */
function format_message(message)
{
    // Read the appropriate line from a stack trace
    var line = new Error().stack.split('\n')[3];
    // Trim out the important data from the line (file and line number)
    line = line.substring(line.lastIndexOf('/')+1,line.lastIndexOf(':'));
    // Return the message formatted with the information
    return str_resize('<' + line + '>',15) + ' - ' + message;
}


/**
 * @brief This function implements a trace log
 *        for output of error messages.
 *
 * @param message The input message to trace.
 */
ERROR  = function(message)
{
    console.log(('ERROR  : ' + format_message(message)).red);
}
/**
 * @brief This function implements a trace log
 *        for output of severe error messages.
 *
 * @param message The input message to trace.
 */
SEVERE = function(message)
{
    console.log(('SEVERE : ' + format_message(message)).magenta);
}
/**
 * @brief This function implements a trace log
 *        for output of warning messages.
 *
 * @param message The input message to trace.
 */
WARN   = function(message)
{
    console.log(('WARN   : ' + format_message(message)).yellow);
}
/**
 * @brief This function implements a trace log
 *        for output of info messages.
 *
 * @param message The input message to trace.
 */
INFO   = function(message)
{
    console.log(('INFO   : ' + format_message(message)).blue);
}
/**
 * @brief This function implements a trace log
 *        for output of system messages.
 *
 * @param message The input message to trace.
 */
SYSTEM = function(message)
{
    console.log(('SYSTEM : ' + format_message(message)).cyan);
}
/**
 * @brief This function implements a trace log
 *        for output of note messages.
 *
 * @param message The input message to trace.
 */
NOTE   = function(message)
{
    console.log(('NOTE   : ' + format_message(message)).green);
}
/**
 * @brief This function implements a trace log
 *        for output of todo messages.
 *
 * @param message The input message to trace.
 */
TODO   = function(message)
{
    console.log(('TODO   : ' + format_message(message)).underline.white);
}
/**
 * @brief This function implements a trace log
 *        for output of xxx todo messages.
 *
 * @param message The input message to trace.
 */
XXX    = function(message)
{
    console.log(('XXX    : ' + format_message(message)).underline.magenta);
}
/**
 * @brief This function implements a trace log
 *        for output of text messages.
 *
 * @param message The input message to trace.
 */
TEXT   = function(message)
{
    console.log(('TEXT   : ' + format_message(message)));
}

