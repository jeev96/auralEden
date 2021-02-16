import * as SettingsActions from "./settings.actions";

export interface State {
	mediaLocation: string[],
	appTheme: string,
	loading: boolean
}

const initialState: State = {
	mediaLocation: [],
	appTheme: "default",
	loading: false
}

export function settingsReducer(state = initialState, action: SettingsActions.SettingsActions) {
	switch (action.type) {
		case SettingsActions.SET_MEDIA_LOCATION_SUCCESS:
			return {
				...state,
				mediaLocation: action.payload,
				loading: false
			}
		case SettingsActions.SET_MEDIA_LOCATION_FAILURE:
			return {
				...state,
				mediaLocation: [],
				loading: false
			}
		case SettingsActions.SET_THEME:
			return {
				...state,
				appTheme: action.payload
			}
		case SettingsActions.SEND_MEDIA_LOCATION_REQUEST:
			return {
				...state,
				loading: true
			}
		default: return state
	}
}
