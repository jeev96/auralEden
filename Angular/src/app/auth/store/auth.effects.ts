import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Socket } from "ngx-socket-io";
import { DeviceDetectorService } from "ngx-device-detector";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface AuthResponseData {
	id: string,
	deviceId: string,
	username: string,
	token: string,
	expiresIn: string
}

const handleAuthentication = (id: string, deviceId: string, username: string, token: string, expiresIn: number) => {
	const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);

	const user = new User(id, deviceId, username, token, expirationDate);
	localStorage.setItem("userData", JSON.stringify(user));
	setDeviceId(user.deviceId);

	return new AuthActions.AuthenticateSuccess({
		id: id,
		deviceId: deviceId,
		username: username,
		token: token,
		tokenExpirationDate: expirationDate,
		redirect: true
	});
};

const handleError = (errorRes: any) => {
	let message = "Some error occurred";
	console.log(errorRes);

	if (!errorRes.error || !errorRes.message) {
		return of(new AuthActions.AuthenticateFail(message));
	}
	switch (errorRes.message) {
		case "EMAIL_EXISTS":
			message = "Email already exists.";
			break;
		case "EMAIL_NOT_FOUND":
			message = "Email not found.";
			break;
		case "INVALID_PASSWORD":
			message = "Wrong Password.";
			break;
		default:
			message = "Some error Occurred.";
			break;
	}
	return of(new AuthActions.AuthenticateFail(message));
};

const getUserData = () => {
	const userData: { id: string, deviceId: string, username: string, _token: string, _tokenExpirationDate: string } = JSON.parse(localStorage.getItem("userData"));
	return userData;
}

const getDeviceId = () => {
	return localStorage.getItem("deviceId");
}

const setDeviceId = (deviceId) => {
	const oldDeviceId = getDeviceId();
	if (!oldDeviceId || oldDeviceId !== deviceId) {
		localStorage.setItem("deviceId", deviceId);
	}
}

@Injectable()
export class AuthEffects {
	constructor(
		private actions$: Actions,
		private http: HttpClient,
		private socket: Socket,
		private router: Router,
		private authService: AuthService,
		private deviceService: DeviceDetectorService
	) { }

	autoLogin$ = createEffect(() =>
		this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN), switchMap((authActions: AuthActions.AutoLogin) => {
			const userData = getUserData();
			if (!userData) {
				return of(new AuthActions.NoopAction());
			}
			const loadedUser = new User(userData.id, userData.deviceId, userData.username, userData._token, new Date(userData._tokenExpirationDate));
			if (loadedUser.token) {
				return this.http.post<{ devices: any }>(environment.authAuthenticate, {
					username: loadedUser.username,
					deviceId: getDeviceId()
				}, {
					headers: new HttpHeaders().set("Authorization", loadedUser.token)
				}).pipe(map((response) => {
					const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
					this.authService.setLogoutTimer(expirationDuration);

					return new AuthActions.AuthenticateSuccess({
						id: loadedUser.id,
						username: loadedUser.username,
						deviceId: getDeviceId(),
						token: loadedUser.token,
						tokenExpirationDate: new Date(userData._tokenExpirationDate),
						redirect: false
					});
				}), catchError(errorRes => {
					return of(new AuthActions.NoopAction());
				}))
			}
			return of(new AuthActions.NoopAction());
		}))
	);

	authSignup$ = createEffect(() =>
		this.actions$.pipe(ofType(AuthActions.SIGNUP_START), switchMap((signupAction: AuthActions.SignupStart) => {
			const deviceInfo = this.deviceService.getDeviceInfo();
			return this.http.post<AuthResponseData>(environment.authSignup, {
				username: signupAction.payload.username,
				password: signupAction.payload.password,
				device: {
					name: deviceInfo.os_version,
					type: deviceInfo.deviceType
				}
			}).pipe(tap(resData => {
				this.authService.setLogoutTimer(+resData.expiresIn * 1000);
			}), map(resData => {
				return handleAuthentication(resData.id, resData.deviceId, resData.username, resData.token, +resData.expiresIn);
			}), catchError(errorRes => {
				return handleError(errorRes);
			}))
		}))
	);

	authLogin$ = createEffect(() =>
		this.actions$.pipe(ofType(AuthActions.LOGIN_START), switchMap((authData: AuthActions.LoginStart) => {
			const deviceInfo = this.deviceService.getDeviceInfo();
			return this.http.post<AuthResponseData>(environment.authLogin, {
				username: authData.payload.username,
				password: authData.payload.password,
				device: {
					id: getDeviceId(),
					name: deviceInfo.os_version,
					type: deviceInfo.deviceType
				}
			}).pipe(tap(resData => {
				this.authService.setLogoutTimer(+resData.expiresIn * 1000);
			}), map(resData => {
				return handleAuthentication(resData.id, resData.deviceId, resData.username, resData.token, +resData.expiresIn);
			}), catchError(errorRes => {
				return handleError(errorRes);
			}))
		}))
	);

	authRedirect$ = createEffect(() =>
		this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
			this.socket.emit('deviceOnline', {
				username: getUserData().username,
				deviceId: getDeviceId()
			});
			if (authSuccessAction.payload.redirect) {
				this.router.navigate(["/"]);
			}
		})), { dispatch: false }
	);

	authLogout$ = createEffect(() =>
		this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() => {
			this.socket.emit('deviceOffline', {
				username: getUserData().username,
				deviceId: getDeviceId()
			});
			this.authService.clearLogoutTimer();
			localStorage.removeItem("userData");
			this.router.navigate(["/"]);
		})), { dispatch: false }
	);

	authDeviceOffline$ = createEffect(() =>
		this.actions$.pipe(ofType(AuthActions.DEVICE_OFFLINE), tap(() => {
			this.socket.emit('deviceOffline', {
				username: getUserData().username,
				deviceId: getDeviceId()
			});
		})), { dispatch: false }
	);
}
