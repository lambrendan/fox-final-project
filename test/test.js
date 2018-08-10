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
        

        //Creating a user that already exists

    })

    describe('Sign-in', function() {

    })
})