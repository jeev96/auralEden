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
				this.store.dispatch(new PlayerActions.ClearPlayer());
				return of(playerState)
			} else if (playerState.currentSong == null && playerState.playlist.length > 0) {
				this.store.dispatch(new PlayerActions.GetPlayerSongRequest(playerState.playlist[0][0]));
				return this.actions$.pipe(ofType(PlayerActions.SET_CURRENT_SONG_DATA), take(1));
			}
			else {
				return of(playerState);
			}
		}))
	}
}
