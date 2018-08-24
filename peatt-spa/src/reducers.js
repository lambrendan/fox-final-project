import { GET_USER } from "./actions.js"


export default function userInfo( state = {
    'userID': "",
    'accessToken': "",
    'email': "",
    'password': "" }, action ) {
        if( action.type === GET_USER ) {
            return Object.assign({}, action.payload )
        }
}