import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, take } from "rxjs/operators";

import * as fromApp from "../store/app.reducer";
import * as PlayerActions from "../player/store/player.actions";
import { of } from "rxjs";

@Injectable({ providedIn: "root" })
export class SongResolverService implements Resolve<any> {
	constructor(private store: Store<fromApp.AppState>, private actions$: Actions) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.store.select("player").pipe(take(1), map(playerState => {
			return playerState;
		}), switchMap(playerState => {
			if (playerState.currentSong == null && playerState.playlist.length === 0) {

				this.store.dispatch(new PlayerActions.GetPlayerSongRequest("602c0b8d4cb2a723109ba692"));
				return this.actions$.pipe(ofType(PlayerActions.SET_CURRENT_SONG_DATA), take(1));
			} else if (playerState.currentSong == null && playerState.playlist.length > 0) {
				this.store.dispatch(new PlayerActions.GetPlayerSongRequest(route.firstChild.params["id"]));
				return this.actions$.pipe(ofType(PlayerActions.SET_CURRENT_SONG_DATA), take(1));
			}
			else {
				return of(playerState);
			}
		}))
	}
}
