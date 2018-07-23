/* File Header --------------------------------------------------------------------------------------------
 * Filename:  api.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: File that contains all of the API Calls to sign-up, sign-in, and delete users. It also 
 * containers helper functions to generate random passwords and users. 
 */ 

var express = require('express');
var api = express.Router();
var favorites = require( "./favorites.js");
var bookmarks = require( "./bookmarks.js");
var users = require("./users.js");

let userMap =  {};
userMap = users.createUserMap( false );

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
                res.json({ success: false, message:"Couldn't signup the user"});
            });
    }
});

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

api.post('/delete', function(req, res) {
    if( !req.body.email || !req.body.password ) {
        throw "Please specify the email and password for the account that you want to delete"
    }
    users.deleteUser( req.body.email, req.body.password, userMap );
    res.json({ success: true, message: "User has been deleted"})
});

api.post('/favorite/:showCode', function( req, res) {
    var showObj = [{"showCode": req.params.showCode}];
    favorites.createSetFavorites( req.body.email, req.body.password, showObj, userMap )
    res.json({ success: true, "email": req.body.email, "show": req.params.showCode})
});

api.post('/bookmarks/:video', function( req, res) {
    var bookmarkObj = [{"uID": req.params.video, "watched": req.body.watch}]
    bookmarks.createSetBookmarks( req.body.email, req.body.password, bookmarkObj, userMap )
    .then(function(res){
        res.json({ success: true, "email": req.body.email, "video": res.body })
    })
    .catch( function(err){
        res.json({ succcess: false, message: "Couldn't bookmark the video"})
    })
    
});

module.exports = api;
