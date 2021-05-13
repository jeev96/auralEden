import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { TorrentData } from "src/app/models/TorrentData.model";
import { environment } from "src/environments/environment";

import * as SharingActions from "./sharing.actions";

@Injectable()
export class SharingEffects {
	constructor(private actions$: Actions, private http: HttpClient) { }

	startSharingRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SharingActions.START_SHARING_REQUEST), switchMap((sharingAction: SharingActions.StartSharingRequest) => {
			return this.http.post<TorrentData>(environment.shareContent, {
				path: sharingAction.payload
			});
		}), map((response) => {
			return new SharingActions.StartSharing(response);
		}), catchError((error: any) => {
			return of(new SharingActions.SharingRequestError(error.message));
		}))
	);

	stopTorrentRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SharingActions.STOP_TORRENT_REQUEST), switchMap((sharingAction: SharingActions.StopTorrentRequest) => {
			return this.http.post<{ torrentId: string, isUpload: boolean }>(environment.stopTorrent, {
				torrentId: sharingAction.payload.torrentId,
				isUpload: sharingAction.payload.isUpload
			});
		}), map((response) => {
			return new SharingActions.StopTorrent(response);
		}), catchError((error: any) => {
			return of(new SharingActions.SharingRequestError(error.message));
		}))
	);

	startDownloadRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SharingActions.START_DOWNLOAD_REQUEST), switchMap((sharingAction: SharingActions.StartDownloadRequest) => {
			console.log(sharingAction);

			return this.http.post<TorrentData>(environment.downloadContent, {
				shareString: sharingAction.payload.encryptedString,
				saveLocation: sharingAction.payload.location
			});
		}), map((response) => {
			return new SharingActions.StartDownload(response);
		}), catchError((error: any) => {
			return of(new SharingActions.DownloadRequestError(error.message));
		}))
	);

	allTorrentsRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SharingActions.ALL_TORRENTS_REQUEST), switchMap((sharingAction: SharingActions.AllTorrentsRequest) => {
			return this.http.get<{ downloading: any, uploading: any }>(environment.allTorrents);
		}), map((response) => {
			return new SharingActions.AllTorrents(response);
		}), catchError((error: any) => {
			return of(new SharingActions.DownloadRequestError(error.message));
		}))
	);

	torrentStatsRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SharingActions.TORRENT_STATS_REQUEST), switchMap((sharingAction: SharingActions.TorrentStatsRequest) => {
			return this.http.get<{ downloading: any, uploading: any }>(environment.allTorrents);
		}), map((response) => {
			return new SharingActions.TorrentStats(response);
		}), catchError((error: any) => {
			return of(new SharingActions.DownloadRequestError(error.message));
		}))
	);
}
