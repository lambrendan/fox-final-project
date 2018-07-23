/* File Header --------------------------------------------------------------------------------------------
 * Filename: users.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: File that contains all of the API Calls to sign-up, sign-in, and delete users. It also 
 * containers helper functions to generate random passwords and users. 
 */ 

const got = require('got');
const fs = require('fs');
const key = require('./apikey.js');

// Variables -----------------------------------------------------------------------------------------------

// Map containing every user registered
let dontUseCache = false;

// Used for the email to create a user
var at = "@fox.com";
var numSequence = "0123456789"
var charSequence = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

// Header used in sign-up and sign-in
var generalHeader = {
    'Origin': 'https://delta-qa.fox.com',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US, en;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://delta-qa.fox.com/account/',
    'apikey': key.apikey,
    'Connection': 'keep-alive'
};

// Header used for delete, bookmark, and favorite
var authHeaders = {
    'Authorization': "",
    'Origin': 'https://delta-qa.fox.com',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US, en;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://delta-qa.fox.com/account/',
    'apikey': key.apikey,
    'Connection': 'keep-alive'
};

// Helper functions----------------------------------------------------------------------------------------

/* Body used for the sign-up function 
 * @param email - Email to be entered
 * @param password - Password for the user account
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param birthdate - User's date of birth
 * @param gender - User's gender
 * @return Json object containing signup body
 */
function signupBody( email, password, firstName, lastName, birthdate, gender ) {
    return {
        "password": password || "",
        "email": email || "",
        "firstName": firstName || "User",
        "lastName": lastName || "Test",
        "birthdate": birthdate || "1990-01-01",
        "gender": gender || "f",
        "newsLetter": true
    }  
};

/* Body used for the sign-in function 
 * @param email - Email of the account 
 * @param password - Corresponding password of the account
 * @return Json object containing signin body
 */
function signinBody( email, password ){
    return {
        "password": password || "asdfasdf",
        "email": email || "brendanthelam@gmail.com"
    }
};

/* Creates the userMap based on the input file
 * @param cache - Check to see whether or not to read the file
 * @return Boolean to see whether or not to create user map
 */
const createUserMap = (cache) => {
    dontUseCache = !!cache;
    if (!cache) {
        try {
            var userMap = JSON.parse(fs.readFileSync('./cache.json').toString());
            return userMap
        } catch (e) {
            console.log(e);
            userMap = {};
        }
    } else {
        cache = {};
    }
    return cache;
}

/* Adds a user to the user map and writes the usermap to the file
 * @param email - email of the user
 * @param userObject - The object containing user information to add to the user map
 */
const addUserToMap = (userMap, email, userObject) => {
    userMap[email] = userObject;
    if (!dontUseCache) {
        fs.writeFileSync('./cache.json', JSON.stringify(userMap, null, 2));
    }
}

/* Update user in the user map
 * 
 *  
 */
function updateUserInfo ( userMap, email, myToken, userID, body ) {
    userMap[email]['myToken'] = myToken;
    userMap[email]['body'] = body;
    userMap[email]['userID'] = userID;
    if (!dontUseCache) {
        fs.writeFileSync('./cache.json', JSON.stringify(userMap, null, 2));
    }
    userMap = createUserMap();
    return userMap;
}


/* Helper function to get a random index to get random shows/series 
 * @param size - size of the array 
 * @return a Random index 
 */
function generateRandomIndex( size ) {
    var returnIndex = Math.floor( Math.random() * size );
    return returnIndex;
}
function successfulSignup( email, password ) {
    console.log("This is your email: " + email );
    console.log("This is your password: " + password );
    console.log( "You've successfully created a new user!" );
}


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

// API Functions -------------------------------------------------------------------------------------

/* Function to sign-up a user
 * @param email - Email to be entered
 * @param password - Password for the user account
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param birthdate - User's date of birth
 * @param gender - User's gender
 */
function signup ( email, password, firstName, lastName, birthdate, gender, userMap ) {
    if ( userMap[email] ) {
         console.log( "User has already been created!")
    }
    return got.post('https://api-staging.fox.com/profiles/_latest/', {
        headers: generalHeader,
        body: signupBody( email, password, firstName, lastName, birthdate, gender ),
        json: true
    })
    
}

/* Function to delete a user from the database
 * @param email - Email of the account to be deleted
 */
function deleteUser( email, password, userMap ) { 
    signin( email, password, userMap )
        .then(function(res) {
            var myToken = res.body.accessToken;
            var userID = res.body.profileId;
            const newAuthHeaders = Object.assign({}, authHeaders);
            newAuthHeaders.Authorization = `Bearer ${myToken}`;
            return got.delete('https://api-staging.fox.com/profiles/_latest/'+ userID, {
                headers: newAuthHeaders,
                json: true
            })
        .then(function(res) {
            delete userMap[email];
            if (!dontUseCache) {
                fs.writeFileSync('./cache.json', JSON.stringify(userMap, null, 2));
            }
            console.log(res);
        }) 
        .catch( function(err) {
            console.log(err.response);
        })
    })
        .catch( function (err) {
            console.log(err.response);
        })
}

/* Function to sign a user into the fox website
 * @param email - Email of the account 
 * @param password - Corresponding password of the account
 * @return Promise object to post user's info to log-in to the account
 */

function signin ( email, password, userMap ) {
    // If the email exists in the userMap
    if( userMap.hasOwnProperty( email ) ){ 
        if( userMap[email].hasOwnProperty( "myToken" ) ) {
            return Promise.resolve(userMap[email])
            .then(function(res) {
                //console.log(res);
                userMap = updateUserInfo( userMap, email, res.body.accessToken,res.body.profileId, res.body )
                //console.log("Your token is: " + userMap[email].myToken )
                return res;
            })
            .catch( function (err ) {
                console.log( err);
            })
        }
        else {
            return got.post('https://api-staging.fox.com/profiles/_latest/login', {
                headers: generalHeader,
                body: signinBody(email, password),
                json: true
            })
            .then(function(res){
                //console.log(typeof(res));
                
                //var emailObject = { 'myToken': res.body.accessToken, 'userID': res.body.profileId, 'body': res.body, 'password': password, 'videoMap': {} }
                userMap = updateUserInfo( userMap, email, res.body.accessToken, res.body.profileId, res.body )
                //addUserToMap( email, emailObject );
                return res;
            }).catch( function(err) {
                console.log( err );
            });
        }
    }
    else {
        throw "This user does not exist"
    }
}


/* Function to find an unused email and sign-up the profile to Fox with 
 * a random password
 */  
function continuousSignup( userMap ) {
    email = generateRandomEmail();
    password = generateRandomPassword();
    return signup( email, password, undefined, undefined, undefined, undefined, userMap )
    .then( function(res) {
        var userObj = { 'password': password, 'videoMap': {} };
        addUserToMap( userMap, email, userObj)
        successfulSignup( email, password ); 
        return { "email": email, "password": password };
    })
    .catch (function(err) {
        continuousSignup();
    })
}

module.exports = { 
    successfulSignup,
    generalHeader,
    authHeaders,
    signupBody, 
    signinBody,
    generateRandomIndex,
    signup,
    createUserMap,
    addUserToMap,
    deleteUser,
    signin,
    generateRandomEmail,
    generateRandomPassword,
    continuousSignup
}