/* File Header --------------------------------------------------------------------------------------------
 * Filename:  test.js 
 * Author: Brendan Lam 
 * Company: 21st Century Fox
 * File Description: File that contains all of the Unit Tests for the api.
 */ 

var chai = require('chai');
var expect = chai.expect;
var nock = require("nock")
var users = require('../server/services/users.js')
var favorites = require('../server/services/favorites.js')
var bookmarks = require('../server/services/bookmarks.js')
var userMap = users.createUserMap( true );


/* Tests for Users 
 * Description: These tests are focused on sign-up, sign-in, and delete functions
 */
describe('User', function(){
    describe('Signup', function() {
        //Basic signup
        it( "Creating a user that doesn't already exist", function() {
            nock('https://qa.api2.fox.com', {
                headers: users.generalHeader
            })
            .post('/v2.0/register', users.signupBody('fox544455@fox.com', 'abcdef'))
            .reply(200, { 
                accessToken: '12345',
                profileId: '678910'
                
            })

            email = 'fox544455@fox.com'
            password = 'abcdef'
            return users.signup(email, password, undefined, undefined, undefined, undefined, userMap )
            .then(function(res){
                expect(res.body.accessToken).to.be.eql('12345')
                expect(res.body.profileId).to.equal('678910')
            })
        })

        //Creating a user that already exists in the user map
        it( "Creating a user that already exist", function() {
            this.timeout(10000);
            var tempUserMap = { 
                "foxuser166@fox.com": {
                    "password": "89898989",
                    "myToken": "1234",
                    "userID": "569"
                }
            }
            email = 'foxuser166@fox.com'
            password = '89898989'
            return users.signup(email, password, undefined, undefined, undefined, undefined, tempUserMap )
            .then(function(res){
                throw res
            })
            .catch(function(err){
                expect(err).to.be.equal("User has already been created!")
            })
           
        })
    })

    describe('Sign-in', function() {
        var tempUserMap = {
            "foxuser166@fox.com": {
                "password": "abcdef",
                "myToken": "1234",
                "userID": "569",
                "body": {
                    "accessToken": "1234",
                    "profileId": "569"
                }
            },
            "foxuser168@fox.com": {
                "password": "abcdef"
            }
        }
        //Sign-in a brand new user with working credentials 
        it( "Sign-in with a brand new, created user", function() {
            nock('https://qa.api2.fox.com', {
                headers: users.generalHeader
            })
            .post('/v2.0/login', users.signinBody('foxuser168@fox.com', 'abcdef'))
            .reply(200, { 
                accessToken: '12345678',
                profileId: '678910'
            })

            email = 'foxuser168@fox.com';
            password = 'abcdef';
            return users.signin(email, password, tempUserMap )
            .then(function(res){
                expect(res.body.accessToken).to.be.eql('12345678')
                expect(res.body.profileId).to.equal('678910')
            })
        })

        //Sign-in without working credentials
        it( "Sign-in without a created user", function() {
            this.timeout(10000)
            nock('https://qa.api2.fox.com', {
                headers: users.generalHeader
            })
            .post('/v2.0/login', users.signinBody('foxuser188@fox.com', 'abcdef'))
            .reply(200, { 
                accessToken: '5ab',
                profileId: '66b'
            })

            nock('https://qa.api2.fox.com', {
                headers: users.generalHeader
            })
            .post('/v2.0/register', users.signupBody('foxuser188@fox.com', 'abcdef'))
            .reply(200, { 
                accessToken: '5ab',
                profileId: '66b'
                
            })

            email = 'foxuser188@fox.com';
            password = 'abcdef';
            return users.signin(email, password, tempUserMap )
            .then(function(res){
                expect( res.body.accessToken).to.equal('5ab');
                expect( res.body.profileId).to.equal('66b');
            })
        })

        //Sign-in after already being signed in once
        it( "Sign-in after being signed in once", function() {
            email = 'foxuser166@fox.com';
            password = 'abcdef';
            return users.signin(email, password, tempUserMap )
            .then(function(res){
                expect(res.body.accessToken).to.be.eql('1234')
                expect(res.body.profileId).to.equal('569')
            })
        })
    })
    describe('Delete', function(){
        var tempUserMap = {
            "foxuser166@fox.com": {
                "password": "abcdef",
                "myToken": "1234",
                "userID": "569",
                "body": {
                    "accessToken": "1234",
                    "profileId": "569"
                }
            }
        }

        //Delete a user that exists
        it( "Delete a user that does exist", function(){
            const newAuthHeaders = Object.assign({}, users.authHeaders);
            newAuthHeaders.Authorization = 'Bearer 1234';
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .delete('/profiles/_latest/569')
            .reply(200, { 
                "success": true,
                "message": "User has been deleted"                
            })

            return users.deleteUser("foxuser166@fox.com", "abcdef", tempUserMap )
            .then( res => {
                expect(res.body.success).to.be.true
                expect(res.body.message).to.equal("User has been deleted")    
            })
        }) 

        //Delete a user that doesn't exist
        it( "Delete a user that does not exist", function(){
            this.timeout(10000)
            nock('https://qa.api2.fox.com', {
                headers: users.generalHeader
            })
            .post('/v2.0/login', users.signinBody('foxuser190@fox.com', 'abcdef'))
            .reply(200, { 
                accessToken: '5abcdef',
                profileId: '66boool'
            })

            nock('https://qa.api2.fox.com', {
                headers: users.generalHeader
            })
            .post('/v2.0/register', users.signupBody('foxuser190@fox.com', 'abcdef'))
            .reply(200, { 
                accessToken: '5abcdef',
                profileId: '66boool'
                
            })
            const newAuthHeaders = Object.assign({}, users.authHeaders);
            newAuthHeaders.Authorization = 'Bearer 5abcdef';
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .delete('/profiles/_latest/66boool')
            .reply(200, { 
                "success": true,
                "message": "User has been deleted"                
            })

            email = 'foxuser190@fox.com';
            password = 'abcdef';
            return users.deleteUser(email, password, tempUserMap )
            .then(function(res){
                expect(res.body.success).to.be.true
                expect(res.body.message).to.equal("User has been deleted")  
            })
        })
    })
})

/* Tests for Favorites 
 * Description: These tests are focused on getFavorites, createSetFavorites, and createRandomFavorites
 */
describe('Favorites', function() {
    var tempUserMap = {
        "foxuser12@fox.com": {
            "password": "abcdef",
            "myToken": "1234",
            "userID": "569",
            "body": {
                "accessToken": "1234",
                "profileId": "569"
            }
        }
    }
    nock('https://qa.api2.fox.com', {
        headers: users.generalHeader
    })
    .post('/v2.0/login', users.signinBody('foxuser12@fox.com', 'abcdef'))
    .reply(200, { 
        accessToken: '1234',
        profileId: '569'
    })
    userID = '569'
    const newAuthHeaders = Object.assign({}, users.authHeaders);
    newAuthHeaders.Authorization = 'Bearer 1234';

    describe('Create Set Favorites', function() {
        //Create a single, specified favorite of a show
        it("Create one favorite", function() {
            this.timeout(10000)
            favBody = [{'showID':'bamboo-eater' }]
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .post(`/profiles/_latest/${userID}/favorites`, favBody )
            .reply(200, favBody )
            let favBodyToo = [{ 'showCode': 'bamboo-eater'}]
            return favorites.createSetFavorites( 'foxuser12@fox.com', 'abcdef', favBodyToo, tempUserMap )
            .then(res=> {
                expect(res.body).to.be.eql(favBody);
            })
        })

        //Favorite multiple shows
        it("Create multiple favorites", function() {
            this.timeout(10000)
            favBody =[{'showID': 'bamboo-eater'}, {'showID': 'hello-world'}, {'showID': 'fun-with-javascript'}]
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .post(`/profiles/_latest/${userID}/favorites`, favBody )
            .reply(200, favBody )
            let favBodyToo =[{'showCode': 'bamboo-eater'}, {'showCode': 'hello-world'}, {'showCode': 'fun-with-javascript'}]
            return favorites.createSetFavorites( 'foxuser12@fox.com', 'abcdef', favBodyToo, tempUserMap )
            .then(res=> {
                expect(res.body).to.be.eql(favBody);
            })
        })

    })

    describe( 'Get Favorites', function() {

        //Get a user's favorite with only one show favorited
        it("Get favorites of user with only one favorites", function() {
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .get(`/profiles/_latest/${userID}/favorites`)
            .reply(200, {
                showCode: "lost-in-the-sauce"
            })
            return favorites.grabUserFavorites( 'foxuser12@fox.com', 'abcdef', tempUserMap )
            .then( res=> {
                expect(res.body.showCode).to.equal('lost-in-the-sauce')
            })
        })

        //Get a user's favorite with no shows favorited
        it("Get favorites of user with no favorites", function() {
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .get(`/profiles/_latest/${userID}/favorites`)
            .reply(200, {
            })
            return favorites.grabUserFavorites( 'foxuser12@fox.com', 'abcdef', tempUserMap )
            .then( res=> {
                expect(res.body).to.be.empty;
            })
        })

        //Get a user's favorite with multiple shows favorited
        it("Get favorites of user with multiple favorites", function() {
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .get(`/profiles/_latest/${userID}/favorites`)
            .reply(200, [
                {
                    showCode: "lost-in-the-sauce",
                },
                {
                    showCode: "cool-dinosaurs"
                },
                {
                    showCode: "hi-there"
                }
            ])
            return favorites.grabUserFavorites( 'foxuser12@fox.com', 'abcdef', tempUserMap )
            .then( res=> {
                expect(res.body[0].showCode).to.equal('lost-in-the-sauce')
                expect(res.body[1].showCode).to.equal('cool-dinosaurs')
                expect(res.body[2].showCode).to.equal('hi-there');
            })
        })
    })

    describe( 'Create random favorites', function() {
        nock('https://qa.api2.fox.com', {
            headers: users.generalHeader
        })
        .post('/v2.0/login', users.signinBody('foxuser12@fox.com', 'abcdef'))
        .reply(200, { 
            accessToken: '1234',
            profileId: '569'
        })
        userID = '569'
        const newAuthHeaders = Object.assign({}, users.authHeaders);
        newAuthHeaders.Authorization = 'Bearer 1234';   

        //Randomly favorite a show
        it("Create one random favorite", function() {
            nock('https://stage.dpp.foxdcg.com', {
                headers: {
                    'apikey': 'DEFAULT'
                }
            })
            .get('/api/published/series?_fields=showCode,images&itemsPerPage=200')
            .reply(200, {
                member: [{
                    "showCode": "hello-mr-guy",
                    "images": {
                        "seriesList": {
                            "FHD": "yo"
                        }
                    }
                }]
            })
            favBody =[{'showID':'hello-mr-guy'}]
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .post(`/profiles/_latest/${userID}/favorites`, favBody )
            .reply(200, favBody )

            return favorites.createRandomFavorites(1, 'foxuser12@fox.com', 'abcdef', tempUserMap)
            .then( res => {
                expect(res.body).to.be.eql(favBody);
            })
        })

        //Randomly favorite multiple shows
        it("Create multiple random favorites", function() {
            this.timeout(10000)
            nock('https://stage.dpp.foxdcg.com', {
                headers: {
                    'apikey': 'DEFAULT'
                }
            })
            .get('/api/published/series?_fields=showCode,images&itemsPerPage=200')
            .reply(200, {
                member: [{
                    "showCode": "hello-mr-guy",
                    "images": {
                        "seriesList": {
                            "FHD": "yo"
                        }
                    }
                },
                {
                    "showCode": "hello-mr-guy",
                    "images": {
                        "seriesList": {
                            "FHD": "hi"
                        }
                    }
                }]
            })
            favBody =[{'showID': 'hello-mr-guy'}, {'showID':'hello-mr-guy'}] 
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .post(`/profiles/_latest/${userID}/favorites`, favBody )
            .reply(200, favBody )

            return favorites.createRandomFavorites(2, 'foxuser12@fox.com', 'abcdef', tempUserMap)
            .then( res => {
                expect(res.body.length).to.be.eql(favBody.length)
            })
        })
    })
})

/* Tests for Bookmarks 
 * Description: These tests are focused on the getBookmark function
 */
describe('Bookmarks', function() {
    var tempUserMap = {
        "foxuser12@fox.com": {
            "password": "abcdef",
            "myToken": "1234",
            "userID": "569",
            "body": {
                "accessToken": "1234",
                "profileId": "569"
            }
        }
    }
    nock('https://qa.api2.fox.com', {
        headers: users.generalHeader
    })
    .post('/v2.0/login', users.signinBody('foxuser12@fox.com', 'abcdef'))
    .reply(200, { 
        accessToken: '1234',
        profileId: '569'
    })
    userID = '569'
    const newAuthHeaders = Object.assign({}, users.authHeaders);
    newAuthHeaders.Authorization = 'Bearer 1234';

    describe('Get Bookmarks', function() {

        //Get bookmarks of user with one watched video
        it("Get bookmark of user with only one bookmark", function() {
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .get(`/profiles/v3/${userID}/bookmarks`)
            .reply(200, {
                uID: "lost-in-the-sauce_02-11"
            })
            return bookmarks.grabUserBookmarks( 'foxuser12@fox.com', 'abcdef', tempUserMap )
            .then( res=> {
                expect(res.body.uID).to.equal('lost-in-the-sauce_02-11')
            })
        })

        //Get bookmarks of user with no watched videos
        it("Get bookmark of user with no bookmarks", function() {
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .get(`/profiles/v3/${userID}/bookmarks`)
            .reply(200, {
            })
            return bookmarks.grabUserBookmarks( 'foxuser12@fox.com', 'abcdef', tempUserMap )
            .then( res=> {
                expect(res.body).to.be.empty;
            })
        })

        //Get bookmarks of user with many watched videos
        it("Get bookmarks of user with multiple bookmarks", function() {
            nock('https://api-staging.fox.com', {
                headers: newAuthHeaders
            })
            .get(`/profiles/v3/${userID}/bookmarks`)
            .reply(200, [
                {
                    uID: "lost-in-the-sauce_02-11",
                },
                {
                    uID: "cool-dinosaurs_03-12"
                },
                {
                    uID: "hi-there_04-15"
                }
            ])
            return bookmarks.grabUserBookmarks( 'foxuser12@fox.com', 'abcdef', tempUserMap )
            .then( res=> {
                expect(res.body[0].uID).to.equal('lost-in-the-sauce_02-11')
                expect(res.body[1].uID).to.equal('cool-dinosaurs_03-12')
                expect(res.body[2].uID).to.equal('hi-there_04-15');
            })
        })
    })

})


