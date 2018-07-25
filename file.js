/* File Header --------------------------------------------------------------------------------------------
 * Filename:  file.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: File that contains the function to read JSON objects from a file. These JSON objects contain 
 * the actions for a specified user.
 */ 

var fs = require('fs')

/* Function to read from a file 
 * @param filename - Name of the file to be read 
 * @return JSON object containing the information from the file
 */
function readAFile( filename ) {
    var obj = JSON.parse(fs.readFileSync( filename ).toString());
    return obj;
}

module.exports = {
    readAFile
}
