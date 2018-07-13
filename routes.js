
/* File Header ----------------------------------------------------------------------------------------
 * FILENAME:  routes.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: File that contains all of the API Calls to sign-up, sign-in, delete, favorite, and 
 * bookmark
 */ 

const got = require('got');
const fs = require('fs');
const key = require('./apikey.js');

// Variables -------------------------------------------------------------------------------------------

// Map containing every user registered
let userMap = {};
let useCache = false;

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

//Body used for favorite function
var favoritesBody = []

//Body used for bookmark function
var bookmarksBody = {
    "uID": "",
    "bookmark": ""
}

// Helper functions------------------------------------------------------------------------------------

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
        "password": password || "asdfasdf",
        "email": email || "brendanthelam@gmail.com",
        "firstName": firstName || "Brendan",
        "lastName": lastName || "Lam",
        "birthdate": birthdate || "1995-12-15",
        "gender": gender || "m",
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

/* Helper function to find the index in the show list of a video that has not been bookmarked yet
 * @param index - index to be checked
 * @return index in the show list array
 */

 /*
function checkSameVid( email, uID, pageIndex, showIndex, itemsPerPage ) {
    if( userMap[email].videoMap[uID] ) {
        return { "pageIndex": pageIndex, "showIndex": showIndex };
    }
    else {
        if( showIndex >= itemsPerPage ) {
            showIndex = 0;
            return checkSameVid( email, pageIndex + 1, showIndex )
        }
        else {
            return checkSameVid( email, pageIndex, showIndex + 1);
        }
    }
}*/


/* Creates the userMap based on the innput file
 * @param cache - Check to see whether or not to read the file
 * @return Boolean to see whether or not to create user map
 */
const createUserMap = (cache) => {
    useCache = !!cache;
    if (cache) {
        try {
            userMap = JSON.parse(fs.readFileSync('./cache.json').toString());
        } catch (e) {
            //console.log(e);
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
const addUserToMap = (email, userObject) => {
    userMap[email] = userObject;
    if (useCache) {
        fs.writeFileSync('./cache.json', JSON.stringify(userMap, null, 2));
    }
}

/* Helper function to get a random index to get random shows/series 
 * @param size - size of the array 
 * @return a Random index 
 */
function generateRandomIndex( size ) {
    var returnIndex = Math.floor( Math.random() * size );
    return returnIndex;
}

/* Helper function to iterate through the pages containing all of the video information
 * @return Promise with an array containing all of the videos
 */ 
function pageanate( url, results=[] ) {
    return got.get( url, { 
        headers: {
            'apikey': 'DEFAULT' 
        }, 
        json: true 
    })
        .then( function(res){
            results.push(res);
            //console.log(res);
            if(res.body.view.next) {
                return pageanate( res.body.view.next, results ) 
            }
            else {
                return results;
            }
        })
        .catch( function(err) {
            console.log(err);
        })
}

/* Helper function that gets a list of all the shows in the Fox database
 * @return Promise that gets all shows
 */
function getShowsList() {
    return got.get("https://stage.dpp.foxdcg.com/api/published/video?_fields=durationInSeconds,uID,videoType,&videoType=fullEpisode&itemsPerPage=200", {
        headers: {
            'apikey':'DEFAULT'
        }, 
        json: true
    });
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
function signup ( email, password, firstName, lastName, birthdate, gender ) {
    if ( userMap[email] ) {
         throw "User already exists"
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
function deleteUser( email ) { 
    if( userMap[email] ) {
        var userID = userMap[email].userID;
        var myToken = userMap[email].myToken;
    }
    const newAuthHeaders = Object.assign({}, authHeaders);
    newAuthHeaders.Authorization = `Bearer ${myToken}`;
    got.delete('https://api-staging.fox.com/profiles/_latest/'+ userID, {
        headers: newAuthHeaders,
        json: true
    })
    .then(function(res) {
        console.log(res);
    }) 
    .catch( function(err) {
        console.log(err);
    });
}

/* Function to sign a user into the fox website
 * @param email - Email of the account 
 * @param password - Corresponding password of the account
 * @return Promise object to post user's info to log-in to the account
 */

function signin ( email, password ) {
    // If the email exists in the userMap
    if( userMap[email] ) {
        return Promise.resolve(userMap[email])
    }
    return got.post('https://api-staging.fox.com/profiles/_latest/login', {
        headers: generalHeader,
        body: signinBody(email, password),
        json: true
    }).then(function(res){
        var emailObject = { 'myToken': res.body.accessToken, 'userID': res.body.profileId, 'body': res.body, 'videoMap': {} }
        addUserToMap( email, emailObject );
        //console.log(res);
        //console.log(userMap);
        return res;
    }).catch( function(err) {
        console.log( err );
    });
}

/* Function to get a user's favorite shows
 * @param userID - Profile ID of the user
 * @param myToken - Authorization token for the account 
 * @return Promise that gets the favorites
 */
function getFavorites( userID, myToken ) {
    const newAuthHeaders = Object.assign({}, authHeaders);
    newAuthHeaders.Authorization = `Bearer ${myToken}`;
    return got.get('https://api-staging.fox.com/profiles/_latest/' + userID + '/favorites', {
        headers: newAuthHeaders,
        json: true
    });
}
/* Function to get a user's bookmarks
 * @param userID - Profile ID of the user
 * @param myToken - Authorization token for the account 
 * @return Promise that gets the bookmarks
 */
function getBookmarks( userID, myToken ) {
    const newAuthHeaders = Object.assign({}, authHeaders);
    newAuthHeaders.Authorization = `Bearer ${myToken}`;
    return got.get('https://api-staging.fox.com/profiles/v3/' + userID + '/bookmarks', {
        headers: newAuthHeaders,
        json: true
    });
}

/* Function to favorite a show for the specified user
 * @param userID - Profile ID of the user
 * @param myToken - Authorization token for the account 
 * @param show - Show to be favorited
 * @return Promise that posts a favorite
 */
function favoriteShow( userID, myToken, show ) {
    const newAuthHeaders = Object.assign({}, authHeaders);
    newAuthHeaders.Authorization = `Bearer ${myToken}`;
    for ( var index = 0; index < show.length; index++ ) {
        favoritesBody.push({'showID': show[index]});
    }
    return got.post('https://api-staging.fox.com/profiles/_latest/' + userID + '/favorites', {
        headers: newAuthHeaders,
        body: favoritesBody,
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
    const newAuthHeaders = Object.assign({}, authHeaders);
    const newVideo = Object.assign({}, bookmarksBody)
    newAuthHeaders.Authorization = `Bearer ${myToken}`;
    newVideo.uID = video;
    newVideo.bookmark = seconds;
    return got.post('https://api-staging.fox.com/profiles/v3/' + userID + '/bookmarks', {
        headers: newAuthHeaders,
        body: newVideo,
        json: true
    });
}


/* Function that gets all the videos in the Fox database
 * @return Promise with an array containing all of the videos
 */
function getAllShowsList() {
    return getShowsList().then( function(res){
        return pageanate( res.body.view.first );
        
    })
    .catch( function(err) {
        console.log(err);
    });
}

/* Function that gets a list of all the series in the Fox database
 * @return Promise that gets all of the series
 */
function getSeriesList() {
    return got.get('https://stage.dpp.foxdcg.com/api/published/series?_fields=showCode&itemsPerPage=3000', {
        headers: {
            'apikey': 'DEFAULT'
        },
        json: true
    })
}

/* Function that gets a list of all the videos in a particular series in the Fox database
 * @return Promise that gets all of the videos
 */
function getShowBySeriesList( showCode ) {
    return got.get("https://stage.dpp.foxdcg.com/api/published/video?_fields=durationInSeconds,uID,videoType,&videoType=fullEpisode&itemsPerPage=1000" + "&showCode=" + showCode , {
        headers: {
            'apikey':'DEFAULT'
        }, 
        json: true
    });
}

/* Bookmark a specified number of random videos  
 * @param numBookmarks - number of videos to bookmark
 * @param email - email of the specified user
 * @param password - password of the specified user
 */
function createRandomBookmark( numBookmarks, email, password ) {
    Promise.all([signin( email, password ), getAllShowsList()]).then(function(res) {    
        var promises = [];
        var token = res[0].body.accessToken;
        var userID = res[0].body.profileId;
        var uIDWatched;
        var watched;

        var isWatched = generateRandomIndex( 2 );
        //if( userMap[email].videoMa).length >= res[1].body.member.length ) {
            //throw "You have bookmarked every video already!"
        //} 

        for (var i = 0; i < numBookmarks; i++) {
            //USED FOR THE GET SHOWS INDEX - WATCHED 
            var randomIndex = generateRandomIndex( res[1].length );
            var showIndex = generateRandomIndex( res[1][randomIndex].body.member.length );
            //var finalIndex = checkSameVid( email, showIndex );
            //if( finalIndex > res[1][randomIndex].body.member.length ) {
                //throw "Out of bounds!"
            //}
           
            uIDWatched = res[1][randomIndex].body.member[showIndex].uID;
            while( userMap[email].videoMap.hasOwnProperty(uIDWatched) ) {
                randomIndex = generateRandomIndex( res[1].length );
                showIndex = generateRandomIndex( res[1][randomIndex].body.member.length )
                uIDWatched = res[1][randomIndex].body.member[showIndex].uID
            }

            if( isWatched === 0 ) {
                watched = res[1][randomIndex].body.member[showIndex].durationInSeconds
            }
            else {
                watched = (res[1][randomIndex].body.member[showIndex].durationInSeconds) / 2;
            }

            console.log(uIDWatched);
            userMap[email].videoMap[uIDWatched] = {"showIndex": showIndex, "pageIndex": randomIndex};
            promises.push(bookMarkVideo(userID, token, uIDWatched, watched ))
        };
        return Promise.all(promises)
    })
    .then(function(res) {
        console.log(res)
    })
    .catch(function(err) {    
        console.log(err)
    })
}

/* Favorite a specified number of random shows 
 * @param numFavs - number of videos to favorite
 * @param email - email of the specified user
 * @param password - password of the specified user
 */
function createRandomFavorites( numFavs, email, password ) {
    Promise.all([signin( email, password ), getSeriesList()]).then(function(res) {    
        var promises = [];
        var token = res[0].body.accessToken;
        var userID = res[0].body.profileId;
        var series = [];

        for (var i = 0; i < numFavs; i++) { 
            var seriesIndex = generateRandomIndex( res[1].body.member.length);
            series.push(res[1].body.member[seriesIndex].showCode);
        };
        promises.push(favoriteShow(userID, token, series))
        return Promise.all(promises)
    })
    .then(function(res) {
        console.log(res)
    })
    .catch(function(err) {    
        console.log(err)
    })
}


/* Favorite a specified show for the user
 * @param email - email of the specified user
 * @param password - password of the specified user
 * @param showCode - showCode for the video to be favorited
 */
function createSetFavorites( email, password, showCode ) {
    var shows = [];
    signin( email, password )
        .then(function(res) {    
            var promises = [];
            var token = res.body.accessToken;
            var userID = res.body.profileId;
            for( var index = 0; index < showCode.length; index++) {
                shows.push(showCode[index].showCode);
            }
            promises.push(favoriteShow(userID, token, shows))
            return Promise.all(promises)
        })
        .then(function(res) {
            console.log(res)
        })
        .catch(function(err) {    
            console.log(err)
        })
}


/* Bookmark a specified video for the user
 * @param email - email of the specified user
 * @param password - password of the specified user
 * @param bookmark - video to be bookmarked
 */ 
function createSetBookmarks( email, password, bookmark ) {
    for ( var index = 0; index < bookmark.length; index++ ) {
        if (bookmark[index].hasOwnProperty('showCode')) {
            Promise.all([signin( email, password ), getShowBySeriesList(bookmark[index].showCode)]).then(function(res) {    
                var token = res[0].body.accessToken;
                var userID = res[0].body.profileId;
                var watched;
                
                if( bookmark[index].hasOwnProperty('watched') && bookmark[index].watched === true ) {
                    watched = res[1].body.member[finalIndex].durationInSeconds;
                } 
                else {
                    watched = (res[1].body.member[finalIndex].durationInSeconds) / 2 
                }

                var showIndex = generateRandomIndex( res[1].body.member.length );
                var uIDWatched = res[1].body.member[showIndex].uID;
                userMap[email].videoMap[uIDWatched] = {"showIndex": showIndex, "pageIndex": "ShowBySeriesList"};
                return bookMarkVideo( userID, token, uIDWatched, watched );
            })
            .then(function(res) {
                console.log(res)
            })
            .catch(function(err) {    
                console.log(err)
            })       
        }
        else {
            var uid = bookmark[index].uID;
            var isWatched = false;
            if( bookmark[index].hasOwnProperty('watched') && bookmark[index].watched === true ) {
                isWatched = true;
            }
            Promise.all([signin( email, password ), getAllShowsList()]).then(function(res) {   
                console.log(index); 
                var token = res[0].body.accessToken;
                var userID = res[0].body.profileId;
                /*
                if( Object.keys(userMap[email].videoMap).length >= res[1].body.member.length ) {
                    throw "You have bookmarked every video already!"
                } */
                var showExists = false;
                var showIndex;
                var randomIndex
                var checkBreak = false;

                for( randomIndex = 0; randomIndex < res[1].length; randomIndex++ ) {
                    for( showIndex = 0; showIndex < res[1][randomIndex].body.member.length; showIndex++ ) {
                        console.log(res[1][randomIndex].body.member[showIndex].uID  );
                        if( res[1][randomIndex].body.member[showIndex].uID === uid ) {
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
                console.log(uid);
                console.log(watched);
                userMap[email].videoMap[ uid ] = {"showIndex": showIndex, "pageIndex": randomIndex}
                return bookMarkVideo(userID, token, uid, watched );
            })
            .then(function(res) {
                console.log(res)
            })
            .catch(function(err) {    
                console.log(err)
            })
        }
    } 
}

/* Function that prints all of the specified user's favorites
 * @param email - Email of the user to grab favorites from
 * @param password - Password of the user to grab bookmarks from
 */ 
function grabUserFavorites( email, password ) {
    signin( email, password )
        .then(function(res) {
            var token = res.body.accessToken;
            var userID = res.body.profileId;
            return getFavorites(userID, token)
        })  
        .then(function(res){
            console.log(res);
        })
        .catch(function(err) {
            console.log(err.response.body);
        })
        .catch( function(err) {
            console.log(err.body);
        });
}

/* Function that prints all of the specified user's bookmarks 
 * @param email - Email of the user to grab bookmarks from
 * @param password - Password of the user to grab bookmarks from
 */ 
function grabUserBookmarks( email, password ) {
    signin( email, password )
        .then(function(res) {
            var token = res.body.accessToken;
            var userID = res.body.profileId;
            return getBookmarks( userID, token )
        })
        .then(function(res) {
            console.log(res.body);
        })
        .catch(function(err) {
            console.log(err.response.body);
        })
        .catch( function(err) {
            console.log(err.body);
        });
}

module.exports = { 
    signupBody, 
    signinBody,
    //checkSameVid,
    generateRandomIndex,
    signup,
    createUserMap,
    deleteUser,
    signin,
    getFavorites,
    getBookmarks,
    favoriteShow,
    bookMarkVideo,
    getShowsList,
    getSeriesList, 
    createRandomBookmark,
    createRandomFavorites,
    grabUserFavorites,
    grabUserBookmarks,
    createSetFavorites,
    createSetBookmarks
}