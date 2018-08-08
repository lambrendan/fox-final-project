var users = require("./users");
var args = require('args');
var favorites = require("./favorites.js");
var bookmarks = require("./bookmarks.js");

var at = "@fox.com";
var numSequence = "0123456789"
var charSequence = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

/* Function to generate a random email 
 * @return Randomly generated email
 */
function generateRandomEmail() {
    var randomLength = Math.random() * 15;
    var email = "foxuser";
    for ( var i = 0; i < randomLength; i++ ) {
        var index = Math.floor( Math.random() * numSequence.length );
        email += charSequence.charAt(index);
    }
    email += at;
    return email;
}
 
/* Function to generate a random password
 * @return Randomly generated password
 */ 
function generateRandomPassword() {
    var randomLength = Math.random() * (charSequence.length - 6 ) + 6;
    var password = "";
    for ( var i = 0; i < randomLength; i++ ) {
        var index = Math.floor( Math.random() * charSequence.length );
        password += charSequence.charAt(index);
    }
    return password;
}

/* Function to find an unused email and sign-up the profile to Fox with 
 * a random password
 */  
function continuousSignup() {
    email = generateRandomEmail();
    password = generateRandomPassword();
    users.signup( email, password, "testUser", "testUser", "1990-01-01", "f")
    .then( function(res) {
        console.log("This is your email: " + email );
        console.log("This is your password: " + password );
        console.log( "You've successfully created a new user!" );

    })
    .catch (function(err) {
        continuousSignup();
    })
}

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
    .option('noCache', "" )
    .option('deleteCache', "")

const flags = args.parse(process.argv);

users.createUserMap(flags.noCache)

if( flags.signup ) {
    var email;
    var password;
    if( !flags.email || !flags.password || !flags.firstName || !flags.lastName || !flags.birthdate || !flags.gender ) {
        continuousSignup();
    }
    else {
        users.signup( flags.email, flags.password, flags.firstName, flags.lastName, flags.birthdate, flags.gender )
        .then(function(res) {
            console.log(res.body);
        })
        .catch( function(err) {
            console.log("It didn't work! This is your new info:");
            continuousSignup();
        });;
    }
}

if( !flags.signup && !flags.signin && !flags.delete ) {
    if( !flags.email ) {
        continuousSignup();
    }
    else if( flags.email || !flags.password ) {
        if( users.userMap[flags.email] ) {
            users.signin( flags.email, userMap[flags.email].password)
        }
        else {
            var password = generateRandomPassword();
            users.signup( flags.email, password, "testUser", "testUser", "1990-01-01", "f" )
            .then(function(res){
                console.log(res);
            })
            .catch(function(err){
                console.log(err);
            });
        }
    }
    else if ( flags.email || flags.password ) {
        users.signup(flags.email, flags.password, "testUser", "testUser", "1990-01-01", "f")
        .then( function(res) {
            console.log(res);
        })
        .catch(function(err){
            users.signin( flags.email, flags.password );
        })
    }
}

if( flags.signin ) {
    //No password or email entered
    var email;
    var password;
    if ( !flags.email ) {
        email = generateRandomEmail();
        password = generateRandomPassword();
        users.signup( email, password, "testUser", "testUser", "1990-01-01", "f")
        .then(function(res) {
            console.log(res.body)
            return res;
        })
        .catch( function(err) {
            console.log(err.response.body);
            return err;
        });
    }

    //Email entered but no password entered
    else if( flags.email && !flags.password ) {
        email = flags.email;
        password = generateRandomPassword();
        users.signup( email, password, "testUser", "testUser", "1990-01-01", "f")
        .then(function(res) {
            console.log(res.body)
            return res;
        })
        .catch( function(err) {
            console.log(err.response.body);
            return err;
        });
    } 

    //Email and password entered 
    else if ( flags.email && flags.password ) {
        email = flags.email;
        password = flags.password;
    }
    users.signin( email, password);

    if( flags.bookmark ) {
        var bookmarkObject = []
        var numBookmarks = flags.bookmark.length;
        if( typeof( flags.bookmark ) == "string" ) {
            bookmarkObject.push( JSON.parse( flags.bookmark) );
        }
        else {
            for( var index = 0; index < flags.bookmark.length; index++ ) {
                bookmarkObject.push(JSON.parse( flags.bookmark[index]));
            }
        }
        if( !flags.bookmarksNum ) {
            users.createSetBookmarks( email, password, bookmarkObject )
        }
        else {
            if( numBookmarks > flags.bookmarksNum ) {
                throw "You entered too many favorite flags"
            }
            users.createSetBookmarks( email, password, bookmarkObject );
            var numBookmarksLeft = flags.bookmarksNum - numBookmarks;
            if( numBookmarks > 0 ) {
                users.createRandomBookmark( numBookmarksLeft, email, password );
            }
        }
    }
    else {
        if( flags.bookmarksNum ) {
            users.createRandomBookmark( flags.bookmarksNum, email, password );
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
        var numFavorites = flags.favorite.length;  
        if( !flags.favoritesNum ) {
            users.createSetFavorites( email, password, showCode )
        }
        else {
            if( numFavorites > flags.favoritesNum ) {
                throw "You entered too many favorite flags"
            }
            users.createSetFavorites( email, password, showCode );
            var numFavsLeft = flags.favoritesNum - numFavorites;
            if( numFavsLeft > 0 ) {
                users.createRandomFavorites( numFavsLeft, email, password);
            }
        }
    }
    else {
        if( flags.favoritesNum ) {
            users.createRandomFavorites( flags.favoritesNum, email, password );
        }
    }
    if( flags.getFavorites ) {
        users.grabUserFavorites(email, password );
    }
    if( flags.getBookmarks ) {
        users.grabUserBookmarks( email, password );
    }
}

if( flags.delete ) {
    if( !flags.email ) {
        throw "Please specify the email for the account that you want to delete"
    }
    users.deleteUser( flags.email );
}