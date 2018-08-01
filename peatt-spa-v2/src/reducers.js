import { GET_BOOKMARKS, GET_FAVORITES } from "./actions.js"


export default function reduce( state = {}, action ) {
        switch (action.type) {
            case GET_BOOKMARKS:
                return Object.assign( {}, action.bookPayload)
   
            case GET_FAVORITES:
                return Object.assign( {}, action.favsPayload)
       
            default: 
                return state
        }
            
}

