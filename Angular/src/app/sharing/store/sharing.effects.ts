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

	startSharingRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SharingActions.START_SHARING_REQUEST), switchMap((sharingAction: SharingActions.StartSharingRequest) => {
			return this.http.post<{ shareString: string, torrentId: string, name: string }>(environment.shareContent, {
				path: sharingAction.payload
			});
		}), map((response) => {
			return new SharingActions.StartSharing(response);
		}), catchError((error: any) => {
			return of(new SharingActions.SharingRequestError(error.message));
		}))
	);

	stopSharingRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SharingActions.STOP_SHARING_REQUEST), switchMap((sharingAction: SharingActions.StopSharingRequest) => {
			return this.http.post<{ torrentId: string }>(environment.stopShareTorrent, {
				torrentId: sharingAction.payload
			});
		}), map((response) => {
			return new SharingActions.StopSharing(response.torrentId);
		}), catchError((error: any) => {
			return of(new SharingActions.SharingRequestError(error.message));
		}))
	);

	startDownloadRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SharingActions.START_DOWNLOAD_REQUEST), switchMap((sharingAction: SharingActions.StartDownloadRequest) => {
			return this.http.post<{ name: string, torrentId: string, size: string }>(environment.downloadContent, {
				shareString: sharingAction.payload.encryptedString,
				saveLocation: sharingAction.payload.location
			});
		}), map((response) => {
			return new SharingActions.StartDownload(response);
		}), catchError((error: any) => {
			return of(new SharingActions.DownloadRequestError(error.message));
		}))
	);
}
