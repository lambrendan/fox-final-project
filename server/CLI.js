/* File Header --------------------------------------------------------------------------------------------
 * Filename:  CLI.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: Main function that parses command-line arguments to perform the indicated actions on 
 * the Fox website. 
 */ 

var users = require("./users");
var args = require('args');
var favorites = require("./favorites.js");
var bookmarks = require("./bookmarks.js");
var list = require("./list.js")
var file = require("./file.js")

let userMap = {};

args
    .option('bookmarksNum', "Enter the number of videos to bookmark")
    .option('favoritesNum', "Enter the number of series to favorite")
    .option('bookmark', "Enter either the showCode or uID")
    .option('favorite', "Enter a show to favorite")
    .option('password', "Enter the password")
    .option('email', "Enter your email")
    .option('birthdate', 'Enter your birthdate')
    .option('gender', "Enter your gender")
    .option('firstName', "Enter your first name")
    .option('lastName', "Enter your last name")
    .option('delete', "Enter the username")
    .option('signin', "Sign into your account")
    .option('signup', "Signup for an account")
    .option('getFavorites', "Gets a user's favorites")
    .option('getBookmarks', "Get a user's bookmarks")
    .option('noCache', "Specify whether to include a cache" )
    .option('deleteCache', "")
    .option('file', "")
    .option('getInfo', "")

const flags = args.parse(process.argv);

userMap = users.createUserMap(flags.noCache)

var email;
var password;


if( flags.file ) {
    var fileObj = file.readAFile( flags.file );
    file.parseJson(fileObj);
} 
else {
    if( flags.email ) {
        email = flags.email;
        if ( flags.signup ) {
            if( flags.password ) {
                password = flags.password;
                if ( flags.firstName && flags.lastName && flags.birthdate && flags.gender ) {
                    users.signup( flags.email, flags.password, flags.firstName, flags.lastName, flags.birthdate, flags.gender, userMap )
                    .then(function(res) {
                        var userObj = { 'password': password, 'videoMap': {} };
                        users.addUserToMap( userMap, email, userObj)
                        users.successfulSignup( email, password ); 
                        console.log(res.body);
                    })
                    .catch( function(err) {
                        console.log(err);
                        console.log("It didn't work! This is your new info:");
                        var obj = users.continuousSignup( userMap );
                        email = obj.email;
                        password = obj.password;
                    });
                }
                else {
                    users.signup( flags.email, flags.password, undefined, undefined, undefined, undefined, userMap)
                    .then(function(res) {
                        var userObj = { 'password': password, 'videoMap': {} };
                        users.addUserToMap( userMap, email, userObj)
                        users.successfulSignup( email, password );
                    })
                    .catch( function(err) {
                        console.log(err.response);
                        console.log("It didn't work! This is your new info:");
                        var obj = users.continuousSignup( userMap );
                        email = obj.email;
                        password = obj.password;
                    });
                }
            }
            else {
                password = users.generateRandomPassword();
                if ( flags.firstName && flags.lastName && flags.birthdate && flags.gender ) {
                    users.signup( flags.email, password, flags.firstName, flags.lastName, flags.birthdate, flags.gender, userMap )
                    .then(function(res) {
                        var userObj = { 'password': password, 'videoMap': {} };
                        users.addUserToMap( userMap, email, userObj)
                        users.successfulSignup( email, password );
                    })
                    .catch( function(err) {
                        console.log(err.response);
                        console.log("It didn't work! This is your new info:");
                        var obj = users.continuousSignup( userMap );
                        email = obj.email;
                        password = obj.password;
                    });
                }
                else {
                    users.signup( flags.email, password, undefined, undefined, undefined, undefined, userMap )
                    .then(function(res) {
                        var userObj = { 'password': password, 'videoMap': {} };
                        users.addUserToMap( userMap, email, userObj)
                        users.successfulSignup( email, password );
                    })
                    .catch( function(err) {
                        console.log(err.response);
                        console.log("It didn't work! This is your new info:");
                        var obj = users.continuousSignup( userMap );
                        email = obj.email;
                        password = obj.password;
                    });
                }
            }
        }
        else if( flags.signin ) {
            if ( !flags.email ) {
                email = users.generateRandomEmail();
                password = users.generateRandomPassword();
                users.signup( email, password, undefined, undefined, undefined, undefined, userMap )
                .then(function(res) {
                    var userObj = { 'password': password, 'videoMap': {} };
                    users.addUserToMap( userMap, email, userObj)
                    users.successfulSignup( email, password );
                    //return res;
                })
                .catch( function(err) {
                    console.log(err.response.body);
                    console.log("It didn't work! This is your new info:");
                    var obj = users.continuousSignup( userMap );
                    email = obj.email;
                    password = obj.password;
                });
            }
        
            //Email entered but no password entered
            else if( flags.email && !flags.password ) {
                email = flags.email;
                if (userMap.hasOwnProperty(email) ) {
                    password = userMap[email].password;     
                    users.signin( email, password, userMap );   
                }
                else {
                    password = users.generateRandomPassword();
                    users.signup( email, password, undefined, undefined, undefined, undefined, userMap )
                    .then(function(res) {
                        var userObj = { 'password': password, 'videoMap': {} };
                        users.addUserToMap( userMap, email, userObj)
                        users.successfulSignup( email, password );
                        return res;
                    })
                    .catch( function(err) {
                        console.log(err.response.body);
                        console.log("It didn't work! This is your new info:");
                        var obj = users.continuousSignup( userMap );
                        email = obj.email;
                        password = obj.password;
                    });
                }
            } 
        
            //Email and password entered 
            else if ( flags.email && flags.password ) {
                email = flags.email;
                password = flags.password;
            }
            users.signin( email, password, userMap );
        }
        else if ( flags.delete ) {
            if( !flags.email || !flags.password ) {
                throw "Please specify the email and password for the account that you want to delete"
            }
            users.deleteUser( flags.email, flags.password, userMap );
        }
        else if( flags.getInfo ) {
            if( !flags.password ) {
                console.log("You need to pass in an email and password to get this information")
            }
            else {
                var infoObject = { email: flags.email , password: flags.password, accessToken: "", bookmarks: [], favorites: [] };
                var password = flags.password;
                favorites.grabUserFavorites(email, password, userMap )
                .then( res=> {
                    infoObject.accessToken = userMap[email].myToken;
                    infoObject.favorites = res.body;
                    bookmarks.grabUserBookmarks( email, password, userMap )
                    .then( res => {
                        infoObject.bookmarks = res.body;
                        console.log( infoObject );
                    })
                    .catch( err => {
                        console.log(err)
                    })
                })
                .catch( err => {
                    console.log(err);
                })
            }
        }
        else {
            email = flags.email;
            //console.log(userMap);
            //console.log( userMap.hasOwnProperty(email));
            if( !flags.password ) {
                if( userMap.hasOwnProperty(email) ) {
                    password = userMap[email].password;
                    users.signin( email, password, userMap );
                }
                else {
                    password = users.generateRandomPassword();
                    users.signup( email, password, undefined, undefined, undefined, undefined, userMap )
                    .then(function(res){
                        var userObj = { 'password': password, 'videoMap': {} };
                        users.addUserToMap( userMap, email, userObj)
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
            }
            else {
                password = flags.password;
                users.signup(email, password, undefined, undefined, undefined, undefined, userMap )
                .then( function(res) {
                    var userObj = { 'password': password, 'videoMap': {} };
                    users.addUserToMap( userMap, email, userObj)
                    users.successfulSignup( email, password );
                })
                .catch(function(err){
                    console.log( "Couldn't sign-up! Trying to sign-in now");
                    users.signin( email, password, userMap );
                })
            }
        }
    }
    else {
        var userObject = users.continuousSignup( userMap );
        email = userObject.email;
        password = userObject.password;
    }
    if( flags.bookmark ) {
        var bookmarkObject = []
        if( typeof( flags.bookmark ) == "string" ) {
            bookmarkObject.push( JSON.parse( flags.bookmark) );
        }
        else {
            for( var index = 0; index < flags.bookmark.length; index++ ) {
                bookmarkObject.push(JSON.parse( flags.bookmark[index]));
            }
        }
        var numBookmarks = bookmarkObject.length;
        if( !flags.bookmarksNum ) {
            bookmarks.createSetBookmarks( email, password, bookmarkObject, userMap )
        }
        else {
            if( numBookmarks > flags.bookmarksNum ) {
                throw "You entered too many favorite flags"
            }
            bookmarks.createSetBookmarks( email, password, bookmarkObject, userMap );
            var numBookmarksLeft = flags.bookmarksNum - numBookmarks;
            if( numBookmarks > 0 ) {
                bookmarks.createRandomBookmark( numBookmarksLeft, email, password, userMap );
            }
        }
    }
    else {
        if( flags.bookmarksNum ) {
            bookmarks.createRandomBookmark( flags.bookmarksNum, email, password, userMap );
        }
    }

    if( flags.favorite ) { 
        var showCode = [];
        if( typeof( flags.favorite ) == "string" ) {
            showCode.push(JSON.parse( flags.favorite ))
        }
        else {
            for( var index = 0; index < flags.favorite.length; index ++ ) {
                showCode.push(JSON.parse(flags.favorite[index]));
            }
        }
        var numFavorites = showCode.length; 
        if( !flags.favoritesNum ) {
            favorites.createSetFavorites( email, password, showCode, userMap )
        }
        else {
            if( numFavorites > flags.favoritesNum ) {
                throw "You entered too many favorite flags"
            }
            favorites.createSetFavorites( email, password, showCode, userMap );
            var numFavsLeft = flags.favoritesNum - numFavorites;
            if( numFavsLeft > 0 ) {
                favorites.createRandomFavorites( numFavsLeft, email, password, userMap );
            }
        }
    }
    else {
        if( flags.favoritesNum ) {
            favorites.createRandomFavorites( flags.favoritesNum, email, password, userMap );
        }
    }

    if( flags.getFavorites ) {
        favorites.grabUserFavorites(email, password, userMap )
    }
    if( flags.getBookmarks ) {
        bookmarks.grabUserBookmarks( email, password, userMap );
    }

}


   