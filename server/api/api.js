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

let userMap =  {};
userMap = users.createUserMap( false );

/* API route to parse a JSON object
 * @body - JSON object to be parsed
 */
api.post('/parseJSON', function(req, res) {
    var obj = { users: JSON.parse(req.body.users) }
    file.parseJSON(obj, userMap);
    res.send({ success: true })
});

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
                users.addUserToMap( userMap, email, userObj)
                users.successfulSignup( email, password );
                res.json({ success: true, "email": email, "password": password } );
            })
            .catch(function(err) {
                res.send(err);
                //res.json({ success: false, message:"Couldn't signup the user"});
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
        if (userMap.hasOwnProperty(email) ) {
            password = userMap[email].password;       
        }
        else {
            password = users.generateRandomPassword();
            users.signup( email, password, undefined, undefined, undefined, undefined, userMap )
            .then(function(res) {
                var userObj = { 'password': password, 'videoMap': {} };
                users.addUserToMap( userMap, email, userObj)
                users.successfulSignup( email, password );
            })
            .catch( function(err) {
                console.log(err.response.body);
                return;
            });
        }
        users.signin( email, password, userMap )
        .then( function(response) {
            res.json({"email": email, "password": password, "accessToken": userMap[email].myToken, "userID": userMap[email].userID }) 
        })
        .catch( function(err ) {
            res.json({ success: false, message: "Could not sign-into your account. Try again!"})
        }) 
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
    res.json({ success: true, "email": req.body.email, "show": req.params.showCode});
    // .then( function( response ) {
    //     res.json({ success: true, "email": req.body.email, "show": req.params.showCode})
    // })
    // .catch( function(err){
    //     res.json({success: false, message: "Couldn't favorite the video"})
    // })
});

/* API route to bookmark a show 
 * @body email - Email of the new user
 * @body password - Password for the new user
 * @param video - Video to be bookmarkd
 */ 
api.post('/bookmarks/:video', function( req, res) {
    var bookmarkObj = [{"uID": req.params.video, "watched": req.body.watch}]
    bookmarks.createSetBookmarks( req.body.email, req.body.password, bookmarkObj, userMap )
    res.json({ success: true, "email": req.body.email, "video": response.body })
    // .then(function(response){
    //     res.json({ success: true, "email": req.body.email, "video": response.body })
    // })
    // .catch( function(err){
    //     res.json({ succcess: false, message: "Couldn't bookmark the video"})
    // })
    
});

/* API route to get a list of all shows 
 */ 
api.get('/shows', function( req, res) {
    list.getSeriesList()
    .then( response => {
        res.json({showList: response.body.member })
    })
    .catch( error => {
        res.json({ success: false, message: "Couldn't get the list"})
    })
})

/* API route to get a list of all videos
 */
// api.get('/videos', function( req, res) {
//     list.getAllShowsList()
//     .then( response => {
//         var videoObj = [];
//         for( var pageIndex = 0; pageIndex < response.length; pageIndex++) {
//             for( showIndex = 0; showIndex < response[pageIndex].body.member.length; showIndex++ ) {
//                 var tempObj = { "uID" : response[pageIndex].body.member[showIndex].uID}
//                 videoObj.push(tempObj);
//             }
//         }
//         res.json({ videoList: videoObj})
//     })
//     .catch( error => {
//         res.json({ success: false, message: "Couldn't grab the list of videos"})
//     })
// })

api.get('/videos', function( req, res) {
    return got.get( "https://api-staging.fox.com/fbc-content/v1_5/video?itemsPerPage=200&videoType=fullEpisode&premiumPackage=&page=" + req.query.page.toString(), { 
        headers: {
            'apikey': 'DEFAULT' 
        }, 
        json: true 
    })
    .then( response => {
        var videoObj = [];
        for( showIndex = 0; showIndex < response.body.member.length; showIndex++ ) {
            var tempObj = { "uID" : response.body.member[showIndex].uID}
            videoObj.push(tempObj);
        }
        var maxPages = Math.ceil((response.body.totalItems / response.body.itemsPerPage ));
        res.json({ videoList: videoObj, maxPages: maxPages })
    })
    .catch( error => {
        res.json({ success: false, message: "The page you entered doesn't exist"})
    })
})

module.exports = api;
