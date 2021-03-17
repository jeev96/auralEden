import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
	user: User;
	authError: string;
	loading: boolean;
	selectedDevice: string;
}

const initialState: State = {
	user: null,
	authError: null,
	loading: false,
	selectedDevice: null
}

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
	switch (action.type) {
		case AuthActions.AUTHENTICATE_SUCCESS:
			const user = new User(action.payload.id, action.payload.deviceId, action.payload.username, action.payload.token, action.payload.tokenExpirationDate);
			return {
				...state,
				user: user,
				authError: null,
				loading: false,
				selectedDevice: user.deviceId
			}
		case AuthActions.LOGIN_START:
		case AuthActions.SIGNUP_START:
			return {
				...state,
				authError: null,
				loading: true
			}
		case AuthActions.AUTHENTICATE_FAIL:
			return {
				...state,
				user: null,
				authError: action.payload,
				loading: false,
				selectedDevice: null
			}
		case AuthActions.CLEAR_ERROR:
			return {
				...state,
				authError: null
			}
		case AuthActions.LOGOUT:
			return {
				...state,
				user: null,
				selectedDevice: null
			}
		case AuthActions.DEVICE_CHANGE:
			return {
				...state,
				selectedDevice: action.payload
			}
		case AuthActions.NOOP_ACTION:
		default: return state;
	}
}
