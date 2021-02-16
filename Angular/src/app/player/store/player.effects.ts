import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

import * as fromApp from "../../store/app.reducer";
import * as PlayerActions from "./player.actions";

export interface SongResponseData {
	_id: String
	name: String,
	common: {
		albumartist: String,
		genre: [String],
		album: String,
		year: String,
		composer: [String],
		artists: [String],
		artist: String,
		title: String,
		date: String,
		rating: Number
	},
	format: {
		lossless: Boolean,
		codec: String,
		sampleRate: Number,
		numberOfChannels: Number,
		bitrate: Number,
		duration: Number
	}
}

@Injectable()
export class PlayerEffects {
	constructor(private actions$: Actions, private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) { }

	@Effect()
	getSongDataRequest = this.actions$.pipe(ofType(PlayerActions.GET_PLAYER_SONG_REQUEST), switchMap((libraryActions: PlayerActions.GetPlayerSongRequest) => {
		return this.http.get<SongResponseData>(environment.getLibraryDataURL + "/" + libraryActions.payload);
	}), map((response) => {
		console.log(response);

		return new PlayerActions.SetCurrentSong(response);
	}), catchError((error: any) => {
		return of(new PlayerActions.GetPlayerSongError(error.message));
	}));

	@Effect({ dispatch: false })
	setSongData = this.actions$.pipe(ofType(PlayerActions.SET_CURRENT_SONG_DATA), tap((libraryActions: PlayerActions.SetCurrentSong) => {
		this.router.navigate(["/player"]);
	}));
}
