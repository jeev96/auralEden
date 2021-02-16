import { Action } from "@ngrx/store";

export const SEND_MEDIA_LOCATION_REQUEST = "[SETTINGS] SET MEDIA LOCATION REQUEST";
export const SET_MEDIA_LOCATION_SUCCESS = "[SETTINGS] SET MEDIA LOCATION SUCCESS";
export const SET_MEDIA_LOCATION_FAILURE = "[SETTINGS] SET MEDIA LOCATION FAILURE";
export const GET_MEDIA_LOCATION = "[SETTINGS] GET MEDIA LOCATION";
export const SET_THEME = "[SETTINGS] SET THEME";
export const GET_THEME = "[SETTINGS] GET THEME";

export class SetMediaLocationRequest implements Action {
	readonly type = SEND_MEDIA_LOCATION_REQUEST;

	constructor(public payload: string[]) { }
}

export class SetMediaLocationSuccess implements Action {
	readonly type = SET_MEDIA_LOCATION_SUCCESS;

	constructor(public payload: string[]) { }
}

export class SetMediaLocationFailure implements Action {
	readonly type = SET_MEDIA_LOCATION_FAILURE;
	constructor(public payload: string) { }
}

export class GetMediaLocation implements Action {
	readonly type = GET_MEDIA_LOCATION;
}

export class SetTheme implements Action {
	readonly type = SET_THEME;
	constructor(public payload: string) { }

}

export class GetTheme implements Action {
	readonly type = GET_THEME;
}

export type SettingsActions = SetMediaLocationSuccess
	| SetMediaLocationFailure
	| SetMediaLocationRequest
	| GetMediaLocation
	| SetTheme
	| GetTheme;
