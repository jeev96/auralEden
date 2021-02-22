import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, switchMap } from "rxjs/operators";
import { Actions, createEffect, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { environment } from "src/environments/environment";

import * as SettingsActions from "./settings.actions";

export interface SettingsResponseData {
	status: string,
	mediaLocation: string[],
	count: number,
}

@Injectable()
export class SettingsEffects {
	constructor(private actions$: Actions, private http: HttpClient) { }

	setMediaLocation = createEffect(() =>
		this.actions$.pipe(ofType(SettingsActions.SEND_MEDIA_LOCATION_REQUEST), switchMap((settingsAction: SettingsActions.SetMediaLocationRequest) => {
			const data = {
				mediaLocation: settingsAction.payload
			}
			return this.http.post<SettingsResponseData>(environment.setMediaLocationUrl, data);
		}), map((response) => {
			console.log(response.count);
			return new SettingsActions.SetMediaLocationSuccess(response.mediaLocation);
		}), catchError((error) => {
			return of(new SettingsActions.SetMediaLocationFailure(error));
		}))
	);
}
