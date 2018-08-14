/* File Header --------------------------------------------------------------------------------------------
 * Filename: favorites.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: File that contains the functions to either favorite certain shows or favorite 
 * random shows for a specified user.
 */ 

var users = require("./users.js");
var lists = require("./list.js");
var got = require('got');


/* Function to get a user's favorite shows
 * @param userID - Profile ID of the user
 * @param myToken - Authorization token for the account 
 * @return Promise that gets the favorites
 */
function getFavorites( userID, myToken ) {
    const newAuthHeaders = Object.assign({}, users.authHeaders);
    newAuthHeaders.Authorization = `Bearer ${myToken}`;
    return got.get('https://api-staging.fox.com/profiles/_latest/' + userID + '/favorites', {
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
    const newAuthHeaders = Object.assign({}, users.authHeaders);
    newAuthHeaders.Authorization = `Bearer ${myToken}`;
    var favoritesBody = [];
    for ( var index = 0; index < show.length; index++ ) {
        favoritesBody.push({'showID': show[index]});
    }
    return got.post('https://api-staging.fox.com/profiles/_latest/' + userID + '/favorites', {
        headers: newAuthHeaders,
        body: favoritesBody,
        json: true
    });
}

/* Favorite a specified number of random shows 
 * @param numFavs - number of videos to favorite
 * @param email - email of the specified user
 * @param password - password of the specified user
 */
function createRandomFavorites( numFavs, email, password, userMap ) {
    return Promise.all([users.signin( email, password, userMap ), lists.getSeriesList()])
    .then(function(res) {    
        //var promises = [];
        var token = res[0].body.accessToken;
        var userID = res[0].body.profileId;
        var series = [];
        for (var i = 0; i < numFavs; i++) { 
            var seriesIndex = users.generateRandomIndex( res[1].body.member.length);
            series.push(res[1].body.member[seriesIndex].showCode);
        };
        //promises.push(favoriteShow(userID, token, series))
        //return Promise.all(promises)
        return favoriteShow(userID, token, series);
    })
    .then(function(res) {
        //console.log(res.requestUrl + " and " + JSON.stringify(res.body));
        return res;
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
function createSetFavorites( email, password, showCode, userMap ) {
    return users.signin( email, password, userMap )
        .then(function(res) {    
            //var promises = [];
            var token = res.body.accessToken;
            var userID = res.body.profileId;
            var shows = [];
            for( var index = 0; index < showCode.length; index++) {
                shows.push(showCode[index].showCode);
            }
            return favoriteShow(userID, token, shows)
            //promises.push(favoriteShow(userID, token, shows))
            //return Promise.all(promises)
        })
        .then(function(res) {
            return res
            //console.log(res.requestUrl + " and " + JSON.stringify(res.body));
        })
        .catch(function(err) {    
            console.log(err)
        })
}

/* Function that prints all of the specified user's favorites
 * @param email - Email of the user to grab favorites from
 * @param password - Password of the user to grab bookmarks from
 */ 
function grabUserFavorites( email, password, userMap ) {
    return users.signin( email, password, userMap )
        .then(function(res) {
            var token = res.body.accessToken;
            var userID = res.body.profileId;
            return getFavorites(userID, token)
        })  
        .then(function(res){
            //console.log(res.body);
            return res;
        })
        .catch(function(err) {
            console.log(err.response.body);
        })
        .catch( function(err) {
            console.log(err.body);
        });
}

module.exports = {
   createRandomFavorites,
   createSetFavorites,
   grabUserFavorites
}