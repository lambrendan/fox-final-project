/* File Header --------------------------------------------------------------------------------------------
 * Filename:  api.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: File that contains all of the API endpoints for the PEATT Web API.
 */ 

const express = require('express');
const api = express.Router();
const favorites = require( "../services/favorites.js");
const bookmarks = require( "../services/bookmarks.js");
const users = require("../services/users.js");
const list = require("../services/list.js");
const file = require("../services/file.js");
const got = require('got');

let userMap = users.createUserMap(false);

/* API route to parse a JSON object
 * @body - JSON object to be parsed
 */
api.post('/parseJSON', (req, res) => {
    file.parseJSON({ 
        users: JSON.parse(req.body.users),
    }, userMap);
    res.send({
        success: true,
    })
});

/* API route to sign-up a user on the Fox website
 * @body email - Email of the new user
 * @body password - Password for the new user
 */ 
api.post('/signup', (req, res) => {
    let email, password;
    if (!req.body.email) {
        let obj = users.continuousSignup(userMap);
        email = obj.email;
        password = obj.password;
    } else {
        email = req.body.email;
        req.body.password ? password = req.body.password : password = users.generateRandomPassword();
        users.signup(email, password, undefined, undefined, undefined, undefined, userMap)
            .then(response => {
                users.addUserToMap(userMap, email, { 
                    password, 
                    videoMap: {},
                });
                users.successfulSignup(email, password);
                res.json({ 
                    success: true, 
                    email, 
                    password,
                } );
            })
            .catch(err => res.send(err));
    }
});

/* API route to sign-in into an account from the Fox website
 * @body email - Email of the new user
 * @body password - Password for the new user
 */ 
api.post('/signin', (req, res) => {
    let email, password;
    if (!req.body.email) {
        let obj = users.continuousSignup(userMap);
        email = obj.email;
        password = obj.password;
    } else {
        email = req.body.email;
        if (req.body.password) {
            password = req.body.password
            users.signin(email, password, userMap)
                .then(response => res.json({
                    email, 
                    password, 
                    "accessToken": response.body.accessToken, 
                    "userID": response.body.profileId,
                }))
                .catch(err => res.json({ 
                    success: false, 
                    message: "Could not sign-into your account. Try again!"
                }));
        } else {
            password = users.generateRandomPassword();
            users.signup(email, password, undefined, undefined, undefined, undefined, userMap)
            .then(res => {
                let userObj = { 
                    password, 
                    videoMap: {},
                };
                users.addUserToMap(userMap, email, userObj)
                users.successfulSignup(email, password);
                users.signin(email, password, userMap)
                .then(response => res.json({
                    email, 
                    password, 
                    accessToken: response.body.accessToken, 
                    userID: response.body.profileId
                }))
                .catch(err => res.json({ 
                    success: false, 
                    message: "Could not sign-into your account. Try again!"
                })) 
            })
            .catch(err => {
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
api.post('/delete', (req, res) => {
    if (!req.body.email || !req.body.password) throw "Please specify the email and password for the account that you want to delete"
    users.deleteUser(req.body.email, req.body.password, userMap);
    res.json({ 
        success: true, 
        message: "User has been deleted"
    });
});


/* API route to favorite a show 
 * @body email - Email of the new user
 * @body password - Password for the new user
 * @param showCode - Show to be favorited
 */ 
api.post('/favorite/:showCode', (req, res) => {
    favorites.createSetFavorites(req.body.email, req.body.password, [{
        showCode: req.params.showCode,
    }], userMap);
    res.json({
        email: req.body.email, 
        show: req.params.showCode
    });
});

api.get('/favorite/random', (req,res) => { 
    list.getSeriesList()
    .then( response => {
        var seriesIndex = users.generateRandomIndex( response.body.member.length);
        res.json({ "showCode": response.body.member[seriesIndex].showCode })
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
api.post('/bookmarks/:video', (req, res) => {
    bookmarks.createSetBookmarks(req.body.email, req.body.password, [{
        uID: req.params.video, 
        watched: req.body.watch,
    }], userMap);
    res.json({
        email: req.body.email, 
        video: req.params.video,
    });
});

api.get('/bookmark/random', ( req, res ) => {
    console.log(req.query.page);
    return got.get( "https://api-staging.fox.com/fbc-content/v1_5/video?itemsPerPage=200&videoType=fullEpisode&premiumPackage=&page=" + req.query.page.toString(), { 
        headers: {
            'apikey': 'DEFAULT' 
        }, 
        json: true 
    })
    .then( response => {
        var randomIndex = users.generateRandomIndex( response.body.member.length );
        var isWatched = users.generateRandomIndex( 2 );
        if( isWatched === 0 ) {
            res.json({ "uID":response.body.member[randomIndex].uID, "watched": true})
        }
        else {
            res.json({ "uID":response.body.member[randomIndex].uID })
        }
    })
    .catch( error => {
        console.log(error);
        res.json({ success: false, err: error, message: "Couldn't grab the list"})
    })
})


/* API route to get a list of all shows 
 */ 
api.get('/shows', (req, res) => {
    list.getSeriesList()
        .then(response => {
            res.append('Access-Control-Allow-Origin', ['*']);
            res.json({ 
                showList: response.body.member,
            })
        })
        .catch( error => {
            res.json({ success: false, message: "Couldn't get the list"})
        })
})

api.get('/videos', (req, res) => {
    return got.get( "https://api-staging.fox.com/fbc-content/v1_5/video?itemsPerPage=200&videoType=fullEpisode&premiumPackage=&page=" + req.query.page.toString(), { 
        headers: {
            apikey: 'DEFAULT',
        }, 
        json: true,
    })
        .then(response => {
            let videoObj = [];
            for (showIndex = 0; showIndex < response.body.member.length; showIndex++) {
                videoObj.push({
                    uID: response.body.member[showIndex].uID, 
                    images: response.body.member[showIndex].images
                });
            }
            res.json({ 
                videoList: videoObj, 
                maxPages: Math.ceil((response.body.totalItems / response.body.itemsPerPage)) 
            });
        })
        .catch(error => res.json({ 
            success: false, 
            message: "The page you entered doesn't exist"
        }))
})

module.exports = api;
