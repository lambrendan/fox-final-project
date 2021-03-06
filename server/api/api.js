/* File Header --------------------------------------------------------------------------------------------
 * Filename:  api.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: File that contains all of the API endpoints for the PEATT Web API.
 */ 

var express = require('express');
var api = express.Router();
var favorites = require( "../services/favorites.js");
var bookmarks = require( "../services/bookmarks.js");
var users = require("../services/users.js");
var list = require("../services/list.js");
var file = require("../services/file.js")
var got = require('got');

let dontUseCache = false;
let userMap = users.createUserMap( false );

/* API route to parse a JSON object
 * @body - JSON object to be parsed
 */
api.post('/parseJSON', function(req, res) { 
    var obj = { users: JSON.parse(req.body.users) }
    file.parseJSON(obj, userMap);
    Promise.all([favorites.grabUserFavorites( obj.users[0].email, obj.users[0].password, userMap ), bookmarks.grabUserBookmarks( obj.users[0].email, obj.users[0].password, userMap )])
    .then( response => {
        res.json({ success: true, email: obj.users[0].email, password: obj.users[0].password, favorites: response[0].body, bookmarks: response[1].body })
    })
    .catch( error => {
        res.json({ success: false, message: "Something went wrong"})
    })
    
});

/* API route to randomly generate a user
 */
api.get('/random/signup', function(req, res){
    let email = users.generateRandomEmail();
    let password = users.generateRandomPassword();
    res.send({ "email": email, "password": password })
})

/* API route to sign-up a user on the Fox website
 * @body email - Email of the new user
 * @body password - Password for the new user
 */ 
api.post('/signup', function(req, res) {
    var email;
    var password;
    if( !req.body.email ) {
        var obj = users.continuousSignup( userMap );
        email = obj.email;
        password = obj.password;
    }
    else {
        email = req.body.email;
        if( req.body.password ) { 
            password = req.body.password;
        }
        else {
            password = users.generateRandomPassword();
        }
        users.signup( email, password, undefined, undefined, undefined, undefined, userMap )
            .then(function(response){
                var userObj = { 'password': password, 'videoMap': {} };
                users.addUserToMap( userMap, email, userObj, dontUseCache)
                users.successfulSignup( email, password );
                res.json({ success: true, "email": email, "password": password } );
            })
            .catch(function(err) {
                res.send(err);
                res.json({ success: false, error: err });
            });
    }
});

/* API route to sign-in into an account from the Fox website
 * @body email - Email of the new user
 * @body password - Password for the new user
 */ 
api.post('/signin', function(req, res) {
    var email;
    var password;
    if( !req.body.email ) {
        var obj = users.continuousSignup( userMap );
        email = obj.email;
        password = obj.password;
    }
    else {
        email = req.body.email;
        if( req.body.password ) {
            password = req.body.password
            users.signin( email, password, userMap )
            .then( function(response) {
                res.json({ success: true, "email": email, "password": password, "accessToken": response.body.accessToken, "userID": response.body.profileId }) 
            })
            .catch( function(err ) {
                res.json({ success: false, message: "Could not sign-into your account. Try again!"})
            }) 
        }
        else {
            password = users.generateRandomPassword();
            users.signup( email, password, undefined, undefined, undefined, undefined, userMap )
            .then(function(res) {
                var userObj = { 'password': password, 'videoMap': {} };
                users.addUserToMap( userMap, email, userObj, dontUseCache)
                users.successfulSignup( email, password );
                users.signin( email, password, userMap )
                .then( function(response) {
                    res.json({success: true, "email": email, "password": password, "accessToken": response.body.accessToken, "userID": response.body.profileId}) 
                })
                .catch( function(err ) {
                    res.json({ success: false, message: "Could not sign-into your account. Try again!"})
                }) 
            })
            .catch( function(err) {
                console.log(err.response.body);
                return;
            });
        }
    }
});

/* API route to delete a user on the Fox website
 * @body email - Email of the new user
 * @body password - Password for the new user
 */ 
api.post('/delete', function(req, res) {
    if( !req.body.email || !req.body.password ) {
        throw "Please specify the email and password for the account that you want to delete"
    }
    users.deleteUser( req.body.email, req.body.password, userMap );
    res.json({ success: true, message: "User has been deleted"})
});


/* API route to favorite a show 
 * @body email - Email of the new user
 * @body password - Password for the new user
 * @param showCode - Show to be favorited
 */ 
api.post('/favorite/:showCode', function( req, res) {
    var showObj = [{"showCode": req.params.showCode}];
    favorites.createSetFavorites( req.body.email, req.body.password, showObj, userMap )
    res.json({"email": req.body.email, "show": req.params.showCode});
});

/* API route to randomly get a show to favorite
 */
api.get('/favorite/random', (req,res) => { 
    list.getSeriesList()
    .then( response => {
        var seriesIndex = users.generateRandomIndex( response.body.member.length);
        res.json({ success: true, "showCode": response.body.member[seriesIndex].showCode })
    })
    .catch( error => {
        res.json({ success: false, message: "Couldn't get the list"})
    })
})

/* API route to bookmark a show 
 * @body email - Email of the new user
 * @body password - Password for the new user
 * @param video - Video to be bookmarkd
 */ 
api.post('/bookmarks/:video', function( req, res) {
    var bookmarkObj = [{"uID": req.params.video, "watched": req.body.watch}]
    bookmarks.createSetBookmarks( req.body.email, req.body.password, bookmarkObj, userMap )
    res.json({"email": req.body.email, "video": req.params.video })
});


/* API route to get a random video to bookmark
 */
api.get('/bookmark/random', ( req, res ) => {
    return got.get( "https://api-staging.fox.com/fbc-content/v1_5/video?itemsPerPage=100&videoType=fullEpisode&premiumPackage=&page=" + req.query.page.toString(), { 
        headers: {
            'apikey': 'DEFAULT' 
        }, 
        json: true 
    })
    .then( response => {
        var randomIndex = users.generateRandomIndex( response.body.member.length );
        var isWatched = users.generateRandomIndex( 2 );
        if( isWatched === 0 ) {
            res.json({ success: true, "uID":response.body.member[randomIndex].uID, "watched": true})
        }
        else {
            res.json({ success: true, "uID":response.body.member[randomIndex].uID })
        }
        
    })
    .catch( error => {
        console.log(error);
        res.json({ success: false, err: error, message: "Couldn't grab the list"})
    })
})


/* API route to get a list of all shows 
 */ 
api.get('/shows', function( req, res) {
    list.getSeriesList()
    .then( response => {
        //res.append('Access-Control-Allow-Origin', ['*'])
        res.json({ success: true, showList: response.body.member})
    })
    .catch( error => {
        res.json({ success: false, message: "Couldn't get the list"})
    })
})

/* API route to get a list of all videos
 */
api.get('/videos', function( req, res) {
    return got.get( "https://api-staging.fox.com/fbc-content/v1_5/video?itemsPerPage=100&videoType=fullEpisode&premiumPackage=&page=" + req.query.page.toString(), { 
        headers: {
            'apikey': 'DEFAULT' 
        }, 
        json: true 
    })
    .then( response => {
        var videoObj = [];
        for( showIndex = 0; showIndex < response.body.member.length; showIndex++ ) {
            var tempObj = { "uID" : response.body.member[showIndex].uID, "images":response.body.member[showIndex].images}
            videoObj.push(tempObj);
        }
        var maxPages = Math.ceil((response.body.totalItems / response.body.itemsPerPage ));
        res.json({ success: true, videoList: videoObj, maxPages: maxPages })
    })
    .catch( error => {
        res.json({ success: false, message: "The page you entered doesn't exist"})
    })
})

module.exports = api;
