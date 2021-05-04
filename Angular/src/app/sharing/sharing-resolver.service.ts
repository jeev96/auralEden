import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, take } from "rxjs/operators";
import { of } from "rxjs";

import * as fromApp from "../store/app.reducer";
import * as SharingActions from "../sharing/store/sharing.actions";


@Injectable({ providedIn: "root" })
export class SharingResolverService implements Resolve<any> {
	constructor(private store: Store<fromApp.AppState>, private actions$: Actions) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.store.select("sharing").pipe(take(1), map(sharingState => {
			return sharingState;
		}), switchMap(sharingState => {
			if (sharingState.shareData.length == 0 && sharingState.shareData.length === 0) {
				this.store.dispatch(new SharingActions.AllTorrentsRequest());
				return of(sharingState)
			}
			else {
				return of(sharingState);
			}
		}))
	}
}
