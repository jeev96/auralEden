import { Action } from "@ngrx/store";

export const LOGIN_START = "[AUTH] LOGIN START";
export const AUTHENTICATE_SUCCESS = "[AUTH] AUTHENTICATE SUCCESS";
export const AUTHENTICATE_FAIL = "[AUTH] AUTHENTICATE FAIL";
export const SIGNUP_START = "[AUTH] SIGNUP START";
export const CLEAR_ERROR = "[AUTH] CLEAR ERROR";
export const AUTO_LOGIN = "[AUTH] AUTO LOGIN";
export const LOGOUT = "[AUTH] LOGOUT";
export const DEVICE_OFFLINE = "[AUTH] DEVICE OFFLINE";
export const DEVICE_CHANGE = "[AUTH] DEVICE CHANGE";
export const NOOP_ACTION = "[AUTH] NOOP ACTION";

export class LoginStart implements Action {
	readonly type = LOGIN_START;

	constructor(public payload: { username: string; password: string; }) { }
}

export class AuthenticateSuccess implements Action {
	readonly type = AUTHENTICATE_SUCCESS;

	constructor(public payload: { id: string; deviceId: string, username: string; token: string; tokenExpirationDate: Date; redirect: boolean }) { }
}

export class AuthenticateFail implements Action {
	readonly type = AUTHENTICATE_FAIL;

	constructor(public payload: string) { }
}

export class SignupStart implements Action {
	readonly type = SIGNUP_START;

	constructor(public payload: { username: string; password: string; }) { }
}

export class ClearError implements Action {
	readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
	readonly type = AUTO_LOGIN;
}

export class Logout implements Action {
	readonly type = LOGOUT;
}

export class DeviceChange implements Action {
	readonly type = DEVICE_CHANGE;
	constructor(public payload: string) { }
}

export class DeviceOffline implements Action {
	readonly type = DEVICE_OFFLINE;
}

export class NoopAction implements Action {
	readonly type = NOOP_ACTION;
}

export type AuthActions =
	AuthenticateSuccess
	| LoginStart
	| Logout
	| AuthenticateFail
	| SignupStart
	| ClearError
	| AutoLogin
	| DeviceChange
	| NoopAction;
