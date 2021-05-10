import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { environment } from "src/environments/environment";

import * as SearchActions from "./search.actions";

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
}
