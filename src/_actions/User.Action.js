import { userActionTypes } from "./User.Actions.Type";

export const changeLoggedIn = (isLoggedIn, user) => {
    return (dispatch) => {
        dispatch({
            type: userActionTypes.LOGIN_SUCCESS,
            payload: { isLoggedIn: isLoggedIn, userData: user }
        })
    }
}