import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { environment } from "src/environments/environment";

import * as SearchActions from "./search.actions";
import * as SharingActions from "../../sharing/store/sharing.actions";

interface TorrentData {
	name: string,
	downloaded: number,
	uploaded: number,
	upSpeed: number,
	downSpeed: number,
	completed: number,
	size: number,
	shareString: string
}

@Injectable()
export class SearchEffects {
	constructor(private actions$: Actions, private http: HttpClient) { }

	searchRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SearchActions.SEARCH_REQUEST), switchMap((searchActions: SearchActions.SearchRequest) => {
			return this.http.post<{
				ownServer: any,
				otherServers: any
			}>(environment.search, { searchString: searchActions.payload });
		}), map((response) => {
			return new SearchActions.Search(response);
		}), catchError((error: any) => {
			return of(new SearchActions.SearchError(error.message));
		}))
	);

	searchDownloadRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(SearchActions.SEARCH_DOWNLOAD_REQUEST), mergeMap((searchActions: SearchActions.SearchDownloadRequest) => {
			const url = environment.globalDownload(searchActions.address.ip, searchActions.address.port) + searchActions.payload;
			return this.http.get<TorrentData>(url).pipe(map((data => {
				return {
					actionData: searchActions.payload,
					httpData: data
				}
			})));
		}), map((response) => {
			return new SearchActions.SearchDownload(response.actionData, response.httpData.shareString);
		}), catchError((error: any) => {
			return of(new SearchActions.SearchError(error.message));
		}))
	);

	searchDownload$ = createEffect(() =>
		this.actions$.pipe(ofType(SearchActions.SEARCH_DOWNLOAD), map((searchActions: SearchActions.SearchDownload) => {
			console.log("hello here");

			return new SharingActions.StartDownloadRequest({
				encryptedString: searchActions.shareString,
				location: environment.DEFAULT_SAVE_LOCATION
			});
		}), catchError((error: any) => {
			return of(new SearchActions.SearchError(error.message));
		}))
	);
}
