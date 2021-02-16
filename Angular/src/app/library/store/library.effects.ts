import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { environment } from "src/environments/environment";

import * as fromApp from "../../store/app.reducer";
import * as LibraryActions from "./library.actions";

export interface LibraryResponseData {
	data: any[];
	draw: number;
	recordsFiltered: number;
	recordsTotal: number;
}


@Injectable()
export class LibraryEffects {
	constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) { }

	@Effect()
	getLibraryDataRequest = this.actions$.pipe(ofType(LibraryActions.GET_LIBRARY_DATA_REQUEST), switchMap((libraryActions: LibraryActions.GetLibraryDataRequest) => {
		return this.http.get<LibraryResponseData>(environment.getLibraryDataURL);
	}), map((response) => {
		return new LibraryActions.SetLibraryData(response);
	}), catchError((error: any) => {
		return of(new LibraryActions.GetLibraryDataError(error.message));
	}));
}
