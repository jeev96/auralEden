import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, take, tap, withLatestFrom } from "rxjs/operators";
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
	constructor(@Inject(DOCUMENT) private document: HTMLDocument, private actions$: Actions, private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) { }

	@Effect()
	getSongDataRequest = this.actions$.pipe(ofType(PlayerActions.GET_PLAYER_SONG_REQUEST), switchMap((playerActions: PlayerActions.GetPlayerSongRequest) => {
		return this.http.get<SongResponseData>(environment.getLibraryDataURL + "/" + playerActions.payload);
	}), map((response) => {
		this.setAudioElementSource("http://localhost:3000/api/song/stream/" + response._id);
		return new PlayerActions.SetCurrentSongData(response);
	}), catchError((error: any) => {
		return of(new PlayerActions.GetPlayerSongError(error.message));
	}));

	@Effect()
	playSong = this.actions$.pipe(ofType(PlayerActions.PLAYER_PLAY_SONG_REQUEST), withLatestFrom(this.store.select("player")), map(([actionData, playerState]) => {
		if (playerState.currentSong == null && playerState.playlist.length === 0) {
			return new PlayerActions.ClearPlayer();
		} else if (playerState.stopped == true && playerState.currentSong != null) {
			this.setAudioElementSource("http://localhost:3000/api/song/stream/" + playerState.currentSong["_id"]);
		}
		this.playAudioElementSource();
		return new PlayerActions.PlaySong();
	}), catchError((error: any) => {
		return of(new PlayerActions.GetPlayerSongError(error.message));
	}));

	@Effect()
	pauseSong = this.actions$.pipe(ofType(PlayerActions.PLAYER_PAUSE_SONG_REQUEST), map(() => {
		this.pauseAudioElementSource();
		return new PlayerActions.PauseSong();
	}), catchError((error: any) => {
		return of(new PlayerActions.GetPlayerSongError(error.message));
	}));

	@Effect()
	stopSong = this.actions$.pipe(ofType(PlayerActions.PLAYER_STOP_SONG_REQUEST), map(() => {
		this.removeAudioElemetSource();

		return new PlayerActions.StopSong();
	}), catchError((error: any) => {
		return of(new PlayerActions.GetPlayerSongError(error.message));
	}));

	@Effect({ dispatch: false })
	setSongData = this.actions$.pipe(ofType(PlayerActions.SET_CURRENT_SONG_DATA), map(() => {
		this.playAudioElementSource();
	}));


	private removeAudioElemetSource() {
		try {
			let audioElement = this.document.getElementsByTagName('audio')[0];
			if (audioElement.src) {
				audioElement.removeAttribute("src");
				audioElement.load();
			}
			return
		} catch (error) {
			throw (error)
		}
	}

	private pauseAudioElementSource() {
		let audioElement = this.document.getElementsByTagName('audio')[0];
		audioElement.pause();
	}

	private playAudioElementSource() {
		let audioElement = this.document.getElementsByTagName('audio')[0];
		audioElement.play();
	}

	private setAudioElementSource(source) {
		try {
			this.removeAudioElemetSource();
			let audioElement = this.document.getElementsByTagName('audio')[0];
			audioElement.src = source;
			audioElement.load();
			return;
		} catch (error) {
			throw (error);
		}
	}
}
