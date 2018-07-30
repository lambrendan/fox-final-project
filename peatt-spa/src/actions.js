var got = require('got');


export const GET_USER = 'GET_USER';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT_SUCCESS = ' LOGOUT SUCCESS ';

function getUser( user ) {
    return {
        type: GET_USER,
        payload: {
            userID: user.userID,
            accessToken: user.accessToken,
            email: user.email,
            password: user.password
        }
    }
}

function loginFail( err ) {
    return {
        type: LOGIN_FAIL,
        payload: {
            errorMessage: err
        }
     
    }
}

function logout( user ) {
    return {
        type: LOGOUT_SUCCESS,
        payload: {
            newState: 'new state'
        }
    }
}

export function loginUser( email, password ) {
    return dispatch => {
        return got.post("http://localhost:3001/api/signin", {
            body: {
                "email": email,
                "password": password
            }, json: true
        })
        .then( res => {
            var user = { 'userID': res.userID, 'accessToken': res.accessToken, 'email': email, 'password': password };
            dispatch( getUser(user));
        })
        .catch ( err => {
            dispatch( loginFail(err));
        })
    }
}