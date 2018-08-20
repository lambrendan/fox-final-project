/* File Header --------------------------------------------------------------------------------------------
 * Filename:  bookmarks.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: File that contains the functions to either bookmark certain videos or bookmark random videos
 * for a specified user
 */  

var users = require('./users.js')
var lists = require("./list.js")
var got = require('got')

/* Function to get a user's bookmarks
 * @param userID - Profile ID of the user
 * @param myToken - Authorization token for the account 
 * @return Promise that gets the bookmarks
 */
function getBookmarks( userID, myToken ) {
    const newAuthHeaders = Object.assign({}, users.authHeaders);
    newAuthHeaders.Authorization = `Bearer ${myToken}`;
    return got.get('https://api-staging.fox.com/profiles/v3/' + userID + '/bookmarks', {
        headers: newAuthHeaders,
        json: true
    });
}

/* Function to bookmark a video for the specified user
 * @param userID - Profile ID of the user
 * @param myToken - Authorization token for the account 
 * @param video - Video to be bookmarked
 * @param seconds - Number of seconds of the video that has been watched
 * @return Promise that posts a bookmark
 */
function bookMarkVideo(userID, myToken, video, seconds ) {
    var bookmarksBody = {
        "uID": "",
        "bookmark": ""
    }
    const newAuthHeaders = Object.assign({}, users.authHeaders);
    const newVideo = Object.assign({}, bookmarksBody)
    newAuthHeaders.Authorization = `Bearer ${myToken}`;
    newVideo.uID = video;
    newVideo.bookmark = seconds;
    //console.log(newVideo);
    return got.post('http://foxprofile-staging.us-east-1.elasticbeanstalk.com/' + userID + '/bookmarks', {
        headers: newAuthHeaders,
        body: newVideo,
        json: true
    })
    .then( res=>{
        //console.log(res.body)
        return res;
    })
    .catch( err => {
        console.log(err);
        return err;
    })
}

/* Bookmark a specified number of random videos  
 * @param numBookmarks - number of videos to bookmark
 * @param email - email of the specified user
 * @param password - password of the specified user
 */
function createRandomBookmark( numBookmarks, email, password, userMap ) {
    Promise.all([users.signin( email, password, userMap ), lists.getAllShowsList()]).then(function(res) {    
        var promises = [];
        var token = res[0].body.accessToken;
        var userID = res[0].body.profileId;
        var uIDWatched;
        var watched;

        var isWatched = users.generateRandomIndex( 2 );
     
        for (var i = 0; i < numBookmarks; i++) {
            //USED FOR THE GET SHOWS INDEX - WATCHED 
            var randomIndex = users.generateRandomIndex( res[1].length );
            var showIndex = users.generateRandomIndex( res[1][randomIndex].body.member.length );
            uIDWatched = res[1][randomIndex].body.member[showIndex].uID;
            while( userMap[email].videoMap.hasOwnProperty(uIDWatched) ) {
                randomIndex = users.generateRandomIndex( res[1].length );
                showIndex = users.generateRandomIndex( res[1][randomIndex].body.member.length )
                uIDWatched = res[1][randomIndex].body.member[showIndex].uID
            }

            if( isWatched === 0 ) {
                watched = res[1][randomIndex].body.member[showIndex].durationInSeconds
            }
            else {
                watched = (res[1][randomIndex].body.member[showIndex].durationInSeconds) / 2;
            }
            userMap[email].videoMap[uIDWatched] = {"showIndex": showIndex, "pageIndex": randomIndex};
            promises.push(bookMarkVideo(userID, token, uIDWatched, watched ))
        };
        return Promise.all(promises)
    })
    .then(function(res) {
        //console.log(res)
    })
    .catch(function(err) {    
        console.log(err.body)
    })
}

/* Bookmark a specified video for the user
 * @param email - email of the specified user
 * @param password - password of the specified user
 * @param bookmark - video to be bookmarked
 */ 
function createSetBookmarks( email, password, bookmark, userMap ) {
    for ( var index = 0; index < bookmark.length; index++ ) {
        if (bookmark[index].hasOwnProperty('showCode')) {
            var isWatched = false;
            if ( bookmark[index].hasOwnProperty('watched') && bookmark[index].watched === true  ) {
                isWatched = true;
            }
            Promise.all([users.signin( email, password, userMap ), lists.getShowBySeriesList(bookmark[index].showCode)]).then(function(res) {    
                var token = res[0].body.accessToken;
                var userID = res[0].body.profileId;
                var watched;
                if( res[1].body.member === undefined || res[1].body.member.length === 0 ) {
                    console.log(" There is no videos for this show ");
                    return;
                }
                var showIndex = users.generateRandomIndex( res[1].body.member.length );
                if( isWatched === true ) {
                    watched = res[1].body.member[showIndex].durationInSeconds;
                } 
                else {
                    watched = (res[1].body.member[showIndex].durationInSeconds) / 2 
                }
                var uIDWatched = res[1].body.member[showIndex].uID;
                userMap[email].videoMap[uIDWatched] = {"showIndex": showIndex, "pageIndex": "ShowBySeriesList"};
                return bookMarkVideo( userID, token, uIDWatched, watched );
            })
            .then(function(res) {
                //console.log(res)
                //return res;
            })
            .catch(function(err) {    
                console.log(err)
            })       
        }
        else {
            var uid = bookmark[index].uID;
            //console.log( "indexOne" + index + " " + bookmark[index].uID );
            
            var isWatched = false;
            if( bookmark[index].hasOwnProperty('watched') && bookmark[index].watched === true ) {
                isWatched = true;
            }
            Promise.all([users.signin( email, password, userMap ), lists.getAllShowsList(), uid]).then(function(res) {   
                var token = res[0].body.accessToken;
                var userID = res[0].body.profileId;
                var showExists = false;
                var showIndex;
                var randomIndex;
                var checkBreak = false;
                for( randomIndex = 0; randomIndex < res[1].length; randomIndex++ ) {
                    for( showIndex = 0; showIndex < res[1][randomIndex].body.member.length; showIndex++ ) {
                        if( res[1][randomIndex].body.member[showIndex].uID === res[2] ) {
                            checkBreak = true;
                            showExists = true;
                            break;
                        }
                    }
                    if( checkBreak === true ) {
                        break;
                    }
                }

                if( showExists == false ) {
                    throw "That video doesn't exist";
                }
                var watched = res[1][randomIndex].body.member[showIndex].durationInSeconds;
                if( isWatched === true ) {
                    watched = res[1][randomIndex].body.member[showIndex].durationInSeconds;
                } 
                else {
                    watched = (res[1][randomIndex].body.member[showIndex].durationInSeconds) / 2 
                }
                //console.log( uid )
                userMap[email].videoMap[ res[2] ] = {"showIndex": showIndex, "pageIndex": randomIndex}
                return bookMarkVideo(userID, token, res[2], watched );
            })
            .then(function(res) {
                //console.log(res)
                //return res;
            })
            .catch(function(err) {    
                console.log(err)
            })
        }
    } 
}

/* Function that prints all of the specified user's bookmarks 
 * @param email - Email of the user to grab bookmarks from
 * @param password - Password of the user to grab bookmarks from
 */ 
function grabUserBookmarks( email, password, userMap ) {
    return users.signin( email, password, userMap )
        .then(function(res) {
            var token = res.body.accessToken;
            var userID = res.body.profileId;
            return getBookmarks( userID, token )
        })
        .then(function(res) {
            //console.log(res.body.list);
            return res;     
            
        })
        .catch(function(err) {
            console.log(err);
        })
        .catch( function(err) {
            console.log(err.body);
        });
}

module.exports = {
    createRandomBookmark,
    createSetBookmarks, 
    grabUserBookmarks
}