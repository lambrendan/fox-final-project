
export const GET_BOOKMARKS = 'GET_BOOKMARKS';
export const GET_FAVORITES = 'GET_FAVORITES';

function favoriteAction( favorites ) {
    return {
        type: GET_FAVORITES,
        favsPayload: {
            favorite: favorites
        }
    }
}

function bookmarkAction( bookmarks, favorites ) {
    return {
        type: GET_BOOKMARKS,
        bookPayload: {
            favorite: favorites,
            bookmark: bookmarks
        }
    }
}

export function favorite( favorites ) {
    return dispatch => {
        dispatch( favoriteAction(favorites));
    }
}

export function bookmark( bookmarks, favorites ) {
    return dispatch => {
        dispatch( bookmarkAction(bookmarks, favorites));
    }
}
