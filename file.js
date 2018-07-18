var users = require("./users");
var got = require('got');
var favorite = require("./favorites")
var bookmarks = require("./bookmarks")
var fs = require('fs')


function readAFile( filename ) {
    var obj = JSON.parse(fs.readFileSync( filename ).toString());
    return obj;
}

/*
console.log(obj.users[0].hasOwnProperty("favorites"));
console.log(obj.users[0].hasOwnProperty("favorites"));
console.log(obj.users[0].hasOwnProperty("favorites"));
console.log(obj.users[0].hasOwnProperty("favorites"));
*/

module.exports = {
    readAFile
}
