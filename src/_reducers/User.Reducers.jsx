import { userActionTypes } from '../_actions/User.Actions.Type';

const initialState = {
    loggedIn: false,
    userDetails: {}
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case userActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                userDetails: action.payload.userData
            };
        case userActionTypes.LOGOUT:
            return {
                ...state,
                loggedIn: false,
                userDetails: {}
            };
        default:
            return state;
    }
}

export default userReducer;