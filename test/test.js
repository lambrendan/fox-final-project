var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var nock = require("nock")
var users = require('../server/services/users.js')
var favorites = require('../server/services/favorites.js')
var bookmarks = require('../server/services/bookmarks.js')
var file = require('../server/services/file.js')
var list = require('../server/services/list.js')
var userMap = users.createUserMap( true );

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

describe('Favorites', function() {
    describe('Create Set Favorites', function() {
        
    })
})