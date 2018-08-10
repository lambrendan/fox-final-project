/* File Header --------------------------------------------------------------------------------------------
 * Filename:  file.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: File that contains the function to read JSON objects from a file. These JSON objects contain 
 * the actions for a specified user.
 */ 

var fs = require('fs')
var users = require("./users");
var favorites = require("./favorites.js");
var bookmarks = require("./bookmarks.js");
let dontUseCache = false;

/* Function to read from a file 
 * @param filename - Name of the file to be read 
 * @return JSON object containing the information from the file
 */
function readAFile( filename ) {
    var obj = JSON.parse(fs.readFileSync( filename ).toString());
    return obj;
}

/* Function that parses a JSON object and performs the indicated
 * actions
 * @param jsonObject - Object to be parsed
 * @param userMap - Map containing all of the user and their information
 */
function parseJSON ( jsonObject, userMap ) {
    for( var index = 0; index < jsonObject.users.length; index++ ) {
        if( !jsonObject.users[index].hasOwnProperty("email") ) {
            var randomObj = users.continuousSignup( userMap );
            email = randomObj.email;
            password = randomObj.password;
        }
        else {
            if( !jsonObject.users[index].hasOwnProperty("password")) {
                email = jsonObject.users[index].email
                password = users.generateRandomPassword();
                users.signup( email, password, undefined, undefined, undefined, undefined, userMap )
                .then(function(res){
                    var userObj = { 'password': password, 'videoMap': {} };
                    users.addUserToMap( userMap, email, userObj, dontUseCache )
                    users.successfulSignup( email, password );
                })
                .catch(function(err) {
                    console.log(err.response);
                    console.log("It didn't work! This is your new info:");
                    var obj = users.continuousSignup( userMap );
                    email = obj.email;
                    password = obj.password;
                });
            }
            else {
                email = jsonObject.users[index].email;
                password = jsonObject.users[index].password;
                users.signin( email, password, userMap );
            }
        }
        if( jsonObject.users[index].hasOwnProperty("favorites")) {
            var showCode = [];
            for( var favoritesIndex = 0; favoritesIndex < jsonObject.users[index].favorites.length; favoritesIndex++) {
                showCode.push(jsonObject.users[index].favorites[favoritesIndex]);
            }
            var numFavs = showCode.length;
            if( !jsonObject.users[index].hasOwnProperty("numFavorites")) {
                favorites.createSetFavorites( email, password, showCode, userMap)
            }
            else {
                if( numFavs > jsonObject.users[index].numFavorites) {
                    throw "You entered too many favorites"
                }
                favorites.createSetFavorites( email, password, showCode, userMap );
                var numFavoritesLeft = jsonObject.users[index].numFavorites - numFavs;
                if( numFavoritesLeft > 0 ) {
                    //TODO WHEN KADE COMES BACK
                    favorites.createRandomFavorites( numFavoritesLeft, email, password, userMap );
                }
            }
        }
        if( jsonObject.users[index].hasOwnProperty("bookmarks")) {
            var bookmarkObject = [];
            for( var bookmarkIndex = 0; bookmarkIndex < jsonObject.users[index].bookmarks.length; bookmarkIndex++) {
                bookmarkObject.push( jsonObject.users[index].bookmarks[bookmarkIndex]);
                //console.log( "Index: " + bookmarkIndex + "Object: " + fileObj.users[index].bookmarks[bookmarkIndex] )
            }
            var numBookmrks = bookmarkObject.length;
            
            if( !jsonObject.users[index].hasOwnProperty("numBookmarks")) {
                bookmarks.createSetBookmarks( email, password, bookmarkObject, userMap );
            }
            else {
                if( numBookmrks > jsonObject.users[index].numBookmarks ) {
                    throw "You entered too many bookmarks";
                }
                bookmarks.createSetBookmarks( email, password, bookmarkObject, userMap );
                var numBookmarksLeft = jsonObject.users[index].numBookmarks - numBookmrks;
                if ( numBookmarksLeft > 0 ) {
                    //TODO WHEN KADE COMES BACK
                    bookmarks.createRandomBookmark( numBookmarksLeft, email, password, userMap)
                }
            }
        }
    }
}

module.exports = {
    readAFile,
    parseJSON
}
