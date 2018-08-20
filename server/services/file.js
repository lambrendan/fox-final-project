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
            }
        }
        let oldEmail = email;
        let oldPassword = password;
        let prevIndex = index;
        let promise = [];
        if( jsonObject.users[index].hasOwnProperty("favorites")) {
            var showCode = [];
            for( var favoritesIndex = 0; favoritesIndex < jsonObject.users[index].favorites.length; favoritesIndex++) {
                showCode.push(jsonObject.users[index].favorites[favoritesIndex]);
            }
            promise.push(favorites.createSetFavorites( email, password, showCode, userMap));
        }
        if( jsonObject.users[index].hasOwnProperty("bookmarks")) {
            var bookmarkObject = [];
            for( var bookmarkIndex = 0; bookmarkIndex < jsonObject.users[index].bookmarks.length; bookmarkIndex++) {
                bookmarkObject.push( jsonObject.users[index].bookmarks[bookmarkIndex]);
            }
            promise.push(bookmarks.createSetBookmarks( email, password, bookmarkObject, userMap ));
        }
        Promise.all(promise)

        // Promise.all([ users.signin(email, password, userMap), prevIndex, oldEmail, oldPassword])
        // .then( res=> {
        //     if( jsonObject.users[res[1]].hasOwnProperty("favorites")) {
        //         var showCode = [];
        //         for( var favoritesIndex = 0; favoritesIndex < jsonObject.users[res[1]].favorites.length; favoritesIndex++) {
        //             showCode.push(jsonObject.users[res[1]].favorites[favoritesIndex]);
        //         }
        //         favorites.createSetFavorites( email, password, showCode, userMap)
        //     }
        //     if( jsonObject.users[res[1]].hasOwnProperty("bookmarks")) {
        //         var bookmarkObject = [];
        //         for( var bookmarkIndex = 0; bookmarkIndex < jsonObject.users[res[1]].bookmarks.length; bookmarkIndex++) {
        //             bookmarkObject.push( jsonObject.users[res[1]].bookmarks[bookmarkIndex]);
        //         }
        //         bookmarks.createSetBookmarks( email, password, bookmarkObject, userMap );
        //     }
        // })
        // .catch( err=> {
        //     console.log(err);
        // })   
    }
}

module.exports = {
    readAFile,
    parseJSON
}
