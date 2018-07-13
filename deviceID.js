const got = require('got');

// Variables -------------------------------------------------------------------------------------------

// Map containing every user registered
const userMap = {}; 

var charSequence = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

// Header used in sign-up and sign-in
var generalHeader = {
    'Origin': 'https://delta-qa.fox.com',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US, en;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://delta-qa.fox.com/account/',
    'apikey': 'abdcbed02c124d393b39e818a4312055',
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
    'apikey': 'abdcbed02c124d393b39e818a4312055',
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

/* Body used for the sign-in function 
 * @param deviceID - deviceID for the account
 * @return Json object containing signin body
 */
function signinBody(){
    return {
        "deviceID": generateRandomDeviceID()
    }
};

/* Helper function to find the index in the show list of a video that has not been bookmarked yet
 * @param index - index to be checked
 * @return index in the show list array
 */
function checkSameVid( deviceID, index ) {
    if( !userMap[deviceID].videoMap[index] ) {
        return index;
    }
    else {
        return checkSameVid( index + 1);
    }
}

/* Helper function to get a random index to get random shows/series 
 * @param size - size of the array 
 * @return a Random index 
 */
function generateRandomIndex( size ) {
    var returnIndex = Math.round( Math.random() * size );
    return returnIndex;
}

function generateRandomDeviceID() {
    var randomLength = Math.random() * charSequence.length;
    var deviceID = "";
    for ( var i = 0; i < randomLength; i++ ) {
        var index = Math.floor( Math.random() * charSequence.length );
        deviceID += charSequence.charAt(index);
    }
    return deviceID;
}

// API Functions -------------------------------------------------------------------------------------
/* Function to sign a user into the fox website
 * @param deviceID - deviceID of the account 
 * @param password - Corresponding password of the account
 * @return Promise object to post user's info to log-in to the account
 */
function signin ( deviceID ) {
    // If the deviceID exists in the userMap
    if( userMap[deviceID] ) {
        return Promise.resolve(userMap[deviceID])
    }
    return got.post('https://api-staging.fox.com/profiles/_latest/login', {
        headers: generalHeader,
        body: signinBody(deviceID, password),
        json: true
    }).then(function(res){
        userMap[deviceID] = { 'myToken': res.body.accessToken, 'userID': res.body.profileId, 'body': res.body, 'videoMap': {} }
        return res;
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
    console.log(newVideo);
    return got.post('https://api-staging.fox.com/profiles/v3/' + userID + '/bookmarks', {
        headers: newAuthHeaders,
        body: newVideo,
        json: true
    });
}

/* Functiom that gets a list of all the shows in the Fox database
 * @return Promise that gets all shows
 */
function getShowsList() {
    return got.get("https://stage.dpp.foxdcg.com/api/published/video?_fields=durationInSeconds,uID,videoType,&videoType=fullEpisode&itemsPerPage=1000", {
        headers: {
            'apikey':'DEFAULT'
        }, 
        json: true
    });
}

/* Function that gets a list of all the series in the Fox database
 * @return Promise that gets all of the series
 */
function getSeriesList() {
    return got.get('https://stage.dpp.foxdcg.com/api/published/series?_fields=showCode&itemsPerPage=10000', {
        headers: {
            'apikey': 'DEFAULT'
        },
        json: true
    })
}

//Function call to signup a user
//NOTE: MIGHT NOT NEED
/*
signup()
    .then(function(res) {
        console.log(res.body);
    })
    .catch( function(err) {
        console.log(err.response.body);
    });*/

//Function call to delete a user
//NODE: MIGHT NOT NEED 
/*
deleteUser()
    .then(function(res) {
        console.log(res.body);
    })
    .catch( function(err) {
        console.log(err);
    });
*/

/* Function to favorite three shows and bookmark three videos
 */
function defaultFunc( deviceID, password ) {
    Promise.all([signin( deviceID, password ), getSeriesList(), getShowsList()]).then(function(res) {    
        var promises = [];
        var token = res[0].body.accessToken;
        var userID = res[0].body.profileId;
        var series = [];
        
        var uIDWatched;
        var uIDHalf;
        var watched;
        var halfWatched;

        if( Object.keys(userMap[deviceID].videoMap).length >= res[2].body.member.length ) {
            throw "You have bookmarked every video already!"
        } 

        for (var i = 0; i < 3; i++) {
            //USED FOR THE GET SERIES INDEX 
            var seriesIndex = generateRandomIndex( res[1].body.member.length );
            series.push(res[1].body.member[seriesIndex].showCode);

            //USED FOR THE GET SHOWS INDEX - WATCHED 
            var showIndex = generateRandomIndex( res[2].body.member.length );
            var finalIndex = checkSameVid( showIndex );
            watched = res[2].body.member[finalIndex].durationInSeconds;

            //USED FOR GET SHOWS INDEX - HALF WATCHED
            var showIndexHalf = generateRandomIndex(res[2].body.member.length);
            var finalIndexHalf = checkSameVid( showIndexHalf );
            if( finalIndexHalf > res[2].body.member.length ) {
                throw "Out of bounds!"
            }
            halfWatched = (res[2].body.member[finalIndexHalf].durationInSeconds ) / 2;
            
            
            uIDWatched = res[2].body.member[finalIndex].uID;
            uIDHalf = res[2].body.member[finalIndexHalf].uID;
            
            userMap[deviceID].videoMap[ finalIndex ] = uIDWatched;
            userMap[deviceID].videoMap[ finalIndexHalf ] = uIDHalf;
 
            promises.push(bookMarkVideo(userID, token, uIDWatched, watched ))
            promises.push(bookMarkVideo(userID, token, uIDHalf, halfWatched))

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

/* Bookmark a certain number of shows */
function createRandomBookmark( numBookmarks, deviceID, password ) {
    Promise.all([signin( deviceID, password ), getShowsList()]).then(function(res) {    
        var promises = [];
        var token = res[0].body.accessToken;
        var userID = res[0].body.profileId;
        
        var uIDWatched;
        var uIDHalf;
        var watched;
        var halfWatched;

        if( Object.keys(userMap[deviceID].videoMap).length >= res[1].body.member.length ) {
            throw "You have bookmarked every video already!"
        } 

        for (var i = 0; i < numBookmarks; i++) {
            //USED FOR THE GET SHOWS INDEX - WATCHED 
            var showIndex = generateRandomIndex( res[1].body.member.length );
            var finalIndex = checkSameVid( showIndex );
            watched = res[1].body.member[finalIndex].durationInSeconds;

            //USED FOR GET SHOWS INDEX - HALF WATCHED
            var showIndexHalf = generateRandomIndex(res[1].body.member.length);
            var finalIndexHalf = checkSameVid( showIndexHalf );
            if( finalIndexHalf > res[1].body.member.length ) {
                throw "Out of bounds!"
            }
            halfWatched = (res[1].body.member[finalIndexHalf].durationInSeconds ) / 2;
            
            uIDWatched = res[1].body.member[finalIndex].uID;
            uIDHalf = res[1].body.member[finalIndexHalf].uID;
            
            userMap[deviceID].videoMap[ finalIndex ] = uIDWatched;
            userMap[deviceID].videoMap[ finalIndexHalf ] = uIDHalf;
 
            promises.push(bookMarkVideo(userID, token, uIDWatched, watched ))
            promises.push(bookMarkVideo(userID, token, uIDHalf, halfWatched))

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

//Favorite certain number of shows
function createRandomFavorites( numFavs, deviceID, password ) {
    Promise.all([signin( deviceID, password ), getSeriesList()]).then(function(res) {    
        var promises = [];
        var token = res[0].body.accessToken;
        var userID = res[0].body.profileId;
        var series = [];

        for (var i = 0; i < numFavs; i++) {
            //USED FOR THE GET SERIES INDEX 
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

function createSetFavorites( deviceID, password, showCode ) {
    signin( deviceID, password )
        .then(function(res) {    
            var promises = [];
            var token = res.body.accessToken;
            var userID = res.body.profileId;
            promises.push(favoriteShow(userID, token, showCode))
            return Promise.all(promises)
        })
        .then(function(res) {
            console.log(res)
        })
        .catch(function(err) {    
            console.log(err)
        })
}

//TODO:
function createSetBookmarks( deviceID, password, video ) {
    signin( deviceID, password )
        .then(function(res) { 
            for ( var index = 0; index < video.length; index ++ ) {
                if (video[index].hasOwnProperty('showCode')) {

                }
                else {

                }
            } 
            var promises = [];
            var token = res.body.accessToken;
            var userID = res.body.profileId;
            promises.push(favoriteShow(userID, token, showCode))
            return Promise.all(promises)
        })
        .then(function(res) {
            console.log(res)
        })
        .catch(function(err) {    
            console.log(err)
        })
}

// Function call to get user's favorites
function grabUserFavorites( deviceID, password ) {
    signin( deviceID, password )
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

// Function call to get user's Bookmarks
function grabUserBookmarks( deviceID, password ) {
    signin( deviceID, password )
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
    checkSameVid,
    generateRandomIndex,
    signup,
    deleteUser,
    signin,
    getFavorites,
    getBookmarks,
    favoriteShow,
    bookMarkVideo,
    getShowsList,
    getSeriesList, 
    defaultFunc,
    createRandomBookmark,
    createRandomFavorites,
    grabUserFavorites,
    grabUserBookmarks,
    createSetFavorites,
    createSetBookmarks
}