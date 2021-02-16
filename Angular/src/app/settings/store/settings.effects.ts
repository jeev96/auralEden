import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { environment } from "src/environments/environment";

import * as fromApp from "../../store/app.reducer";
import * as SettingsActions from "./settings.actions";
import * as LibraryActions from "../../library/store/library.actions";

export interface SettingsResponseData {
	status: string,
	mediaLocation: string[],
	count: number,
}

@Injectable()
export class SettingsEffects {
	constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) { }

	@Effect()
	setMediaLocation = this.actions$.pipe(ofType(SettingsActions.SEND_MEDIA_LOCATION_REQUEST), switchMap((settingsAction: SettingsActions.SetMediaLocationRequest) => {
		const data = {
			mediaLocation: settingsAction.payload
		}
		return this.http.post<SettingsResponseData>(environment.setMediaLocationUrl, data);
	}), map((response) => {
		console.log(response.count);
		return new SettingsActions.SetMediaLocationSuccess(response.mediaLocation);
	}), catchError((error) => {
		return of(new SettingsActions.SetMediaLocationFailure(error));
	}));
}
