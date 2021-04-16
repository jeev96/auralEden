import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { environment } from "src/environments/environment";

import * as fromApp from "../../store/app.reducer";
import * as SharingActions from "./sharing.actions";


@Injectable()
export class SharingEffects {
	constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) { }

	sharingStringRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SharingActions.SHARING_STRING_REQUEST), switchMap((sharingAction: SharingActions.SharingStringRequest) => {
			return this.http.post<{ shareString: string }>(environment.shareContent, {
				path: sharingAction.payload
			});
		}), map((response) => {
			return new SharingActions.SharingString(response.shareString);
		}), catchError((error: any) => {
			return of(new SharingActions.SharingRequestError(error.message));
		}))
	);

	downloadStringRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SharingActions.DOWNLOAD_STRING_REQUEST), switchMap((sharingAction: SharingActions.DownloadStringRequest) => {
			return this.http.post<{ status: string }>(environment.downloadContent, {
				shareString: sharingAction.payload.encryptedString,
				saveLocation: sharingAction.payload.location
			});
		}), map((response) => {
			return new SharingActions.DownloadString(response.status);
		}), catchError((error: any) => {
			return of(new SharingActions.DownloadRequestError(error.message));
		}))
	);
}
