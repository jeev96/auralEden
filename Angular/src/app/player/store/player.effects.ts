import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable} from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect,  ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, concatMap, map, switchMap, tap, withLatestFrom } from "rxjs/operators";
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

	getSongDataRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.GET_PLAYER_SONG_REQUEST), switchMap((playerActions: PlayerActions.GetPlayerSongRequest) => {
			return this.http.get<SongResponseData>(environment.getLibraryDataURL + "/" + playerActions.payload);
		}), map((response, playerState) => {
			this.setAudioElementSource(environment.streamUrl + response["_id"]);
			return new PlayerActions.SetCurrentSongData(response);
		}), concatMap((response) => {
			return of(response).pipe(withLatestFrom(this.store.select("player")));
		}), tap(([response, playerState]) => {
			const index = playerState.playlist.map((song) => song[0]).indexOf(response.payload["_id"]);
			if (index < 0) {
				this.store.dispatch(new PlayerActions.AddPlaylistSong([
					response.payload._id.toString(),
					response.payload.name,
					response.payload.common.artist ? response.payload.common.artist : "unknown",
					response.payload.common.album ? response.payload.common.album : "unknown",
					Math.round(response.payload.format.duration.$numberDecimal / 60) + ":" + (Math.round(response.payload.format.duration.$numberDecimal % 60) > 9 ? Math.round(response.payload.format.duration.$numberDecimal % 60) : "0" + Math.round(response.payload.format.duration.$numberDecimal % 60)),
					response.payload.common.rating,
					Math.round(response.payload.format.bitrate / 1000),
					null
				]));
			}
		}), map(([response, playerState]) => {
			return response;
		}), catchError((error: any) => {
			return of(new PlayerActions.GetPlayerSongError(error.message));
		}))
	);

	playSong$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.PLAYER_PLAY_SONG_REQUEST), withLatestFrom(this.store.select("player")), map(([actionData, playerState]) => {
			if (playerState.currentSong == null || playerState.playlist.length === 0) {
				return new PlayerActions.ClearPlayerRequest();
			} else if (playerState.stopped == true && playerState.currentSong != null) {
				this.setAudioElementSource(environment.streamUrl + playerState.currentSong["_id"]);
			}
			this.playAudioElementSource();
			return new PlayerActions.PlaySong();
		}), catchError((error: any) => {
			return of(new PlayerActions.GetPlayerSongError(error.message));
		}))
	);

	pauseSong$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.PLAYER_PAUSE_SONG_REQUEST), map(() => {
			this.pauseAudioElementSource();
			return new PlayerActions.PauseSong();
		}), catchError((error: any) => {
			return of(new PlayerActions.GetPlayerSongError(error.message));
		}))
	);

	stopSong$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.PLAYER_STOP_SONG_REQUEST), map(() => {
			this.removeAudioElemetSource();
			return new PlayerActions.StopSong();
		}), catchError((error: any) => {
			return of(new PlayerActions.GetPlayerSongError(error.message));
		}))
	);

	clearPlayer$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.CLEAR_PLAYER_REQUEST), map(() => {
			this.removeAudioElemetSource();
			return new PlayerActions.ClearPlayer();
		}), catchError((error: any) => {
			return of(new PlayerActions.GetPlayerSongError(error.message));
		}))
	);

	addToPlaylist$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.ADD_PLAYLIST_SONG_REQUEST), map((actionData: PlayerActions.AddPlaylistSongRequest) => {
			return actionData.payload
		}), concatMap((action) => {
			return of(action).pipe(withLatestFrom(this.store.select("player")));
		}), map(([payload, playerState]) => {
			const index = playerState.playlist.map((song) => song[0]).indexOf(payload[0]);
			if (index >= 0) {
				return new PlayerActions.NoopAction();
			}
			return new PlayerActions.AddPlaylistSong(payload);
		}), catchError((error: any) => {
			return of(new PlayerActions.GetPlayerSongError(error.message));
		}))
	);

	removeFromPlaylist$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.DELETE_PLAYLIST_SONG_REQUEST), map((actionData: PlayerActions.DeletePlaylistSongRequest) => {
			return actionData.payload
		}), concatMap((payload) => {
			return of(payload).pipe(withLatestFrom(this.store.select("player")));
		}), tap(([payload, playerState]) => {
			if (playerState.playlist.length > 1 && playerState.currentSong && payload === playerState.currentSong["_id"]) {
				this.store.dispatch(new PlayerActions.PlayNextSongRequest());
			}
		}), map(([payload, playerState]) => {
			if (playerState.playlist.length === 1) {
				return new PlayerActions.ClearPlayerRequest();
			}
			return new PlayerActions.DeletePlaylistSong(payload);
		}), catchError((error: any) => {
			return of(new PlayerActions.GetPlayerSongError(error.message));
		}))
	);

	playNextSong$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.PLAYER_PLAY_NEXT_SONG_REQUEST), withLatestFrom(this.store.select("player")), map(([actionData, playerState]) => {
			const index = playerState.playlist.map((song) => song[0]).indexOf(playerState.currentSong["_id"]);
			if (playerState.playlist.length === 0) {
				return new PlayerActions.ClearPlayer();
			}
			if (index < 0 || index === playerState.playlist.length - 1) {
				return new PlayerActions.StopSongRequest();
			}
			return new PlayerActions.GetPlayerSongRequest(playerState.playlist[index + 1][0]);
		}), catchError((error: any) => {
			return of(new PlayerActions.GetPlayerSongError(error.message));
		}))
	);

	playPreviousSong$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.PLAYER_PLAY_PREVIOUS_SONG_REQUEST), withLatestFrom(this.store.select("player")), map(([actionData, playerState]) => {
			const index = playerState.playlist.map((song) => song[0]).indexOf(playerState.currentSong["_id"]);
			if (index <= 0) {
				return new PlayerActions.StopSongRequest();
			}
			return new PlayerActions.GetPlayerSongRequest(playerState.playlist[index - 1][0]);
		}), catchError((error: any) => {
			return of(new PlayerActions.GetPlayerSongError(error.message));
		}))
	);

	changeVolume$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.CHANGE_VOLUME_REQUEST), map((actionData: PlayerActions.ChangeVolumeRequest) => {
			this.changeAudioElementVolume(actionData.payload);
			return new PlayerActions.ChangeVolume(actionData.payload);
		}))
	);

	seekTrack$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.SEEK_TRACK_REQUEST), map((actionData: PlayerActions.SeekTrackRequest) => {
			if (actionData.payload.manualEntry) {
				this.seekAudioElement(actionData.payload.timeElapsed);
			}
			return new PlayerActions.SeekTrack(actionData.payload.timeElapsed);
		}))
	);

	setSongData$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.SET_CURRENT_SONG_DATA), map(() => {
			this.playAudioElementSource();
		})), { dispatch: false }
	);

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

	private changeAudioElementVolume(value: number) {
		let audioElement = this.document.getElementsByTagName('audio')[0];
		audioElement.volume = value;
	}

	private seekAudioElement(value: number) {
		let audioElement = this.document.getElementsByTagName('audio')[0];
		audioElement.currentTime = value;
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
