/* File Header --------------------------------------------------------------------------------------------
 * Filename:  list.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: File that contains the API calls to get the videos and the different series from the 
 * Fox website.
 */  

var got = require('got');

/* Helper function to iterate through the pages containing all of the video information
 * @param url - Url of the page to pageanate
 * @param results - Array of responses to be used 
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

/* Function that gets all the videos in the Fox database
 * @return Promise with an array containing all of the videos
 */
function getAllShowsList() {
    return getShowsList()
    .then( function(res){
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
    return got.get('https://stage.dpp.foxdcg.com/api/published/series?_fields=showCode,images&itemsPerPage=200', {
        headers: {
            'apikey': 'DEFAULT'
        },
        json: true
    })
}

/* Function that gets a list of all the videos in a particular series in the Fox database
 * @param showCode - The show code of the series
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

module.exports = {
    getShowsList,
    getAllShowsList, 
    getSeriesList, 
    getShowBySeriesList
}