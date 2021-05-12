import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { environment } from "src/environments/environment";

import * as fromApp from "../../store/app.reducer";
import { PlayerService } from "../player.service";
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
	},
	address?: {
		ip: string,
		port: number
	}
}

@Injectable()
export class PlayerEffects {
	constructor(
		private actions$: Actions,
		private http: HttpClient,
		private store: Store<fromApp.AppState>,
		private playerService: PlayerService
	) { }

	remoteControl$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.REMOTE_COMMAND), map((actionData: PlayerActions.RemoteCommand) => {
			switch (actionData.payload.command) {
				case PlayerActions.PLAY_SONG_REQUEST:
					return new PlayerActions.PlaySongRequest(actionData.payload.data);
				case PlayerActions.PAUSE_SONG_REQUEST:
					return new PlayerActions.PauseSongRequest();
				case PlayerActions.STOP_SONG_REQUEST:
					return new PlayerActions.PauseSongRequest();
				case PlayerActions.CURRENT_SONG_REQUEST:
					return new PlayerActions.CurrentSongRequest(actionData.payload.data);
				case PlayerActions.PLAY_NEXT_SONG_REQUEST:
					return new PlayerActions.PlayNextSongRequest();
				case PlayerActions.PLAY_PREVIOUS_SONG_REQUEST:
					return new PlayerActions.PlayPreviousSongRequest();
				case PlayerActions.ADD_PLAYLIST_SONG_REQUEST:
					return new PlayerActions.AddPlaylistSongRequest(actionData.payload.data);
				case PlayerActions.DELETE_PLAYLIST_SONG_REQUEST:
					return new PlayerActions.DeletePlaylistSongRequest(actionData.payload.data);
				case PlayerActions.CHANGE_VOLUME_REQUEST:
					return new PlayerActions.ChangeVolumeRequest(actionData.payload.data);
				case PlayerActions.SEEK_TRACK_REQUEST:
					return new PlayerActions.SeekTrackRequest(actionData.payload.data);
			}
			return new PlayerActions.NoopAction();
		}))
	)

	playerState$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.PLAYER_DATA), withLatestFrom(this.store.select("player")), map(([actionData, playerState]) => {
			if (playerState.currentSong != null) {
				return new PlayerActions.PlaySongRequest();
			}
			return new PlayerActions.NoopAction();
		}))
	)

	currentSongRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.CURRENT_SONG_REQUEST), switchMap((playerActions: PlayerActions.CurrentSongRequest) => {
			const url = !playerActions.address ? environment.getLibraryData + "/" + playerActions.payload : environment.globalSearchData(playerActions.address.ip, playerActions.address.port) + playerActions.payload;
			return this.http.get<SongResponseData>(url);
		}), map((response) => {
			const streamUrl = response.address ? environment.globalStream(response.address.ip, response.address.port) : environment.streamUrl;
			console.log(streamUrl);

			this.playerService.setAudioElementSource(streamUrl + response._id);
			return new PlayerActions.CurrentSong(response);
		}), catchError((error: any) => {
			return of(new PlayerActions.PlayerError(error.message));
		}))
	);

	currentSong$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.CURRENT_SONG), withLatestFrom(this.store.select("player")), map(([actionData, playerState]) => {
			this.playerService.playAudioElementSource();
			console.log(playerState.currentSong);

			return new PlayerActions.AddPlaylistSongRequest(playerState.currentSong._id, playerState.currentSong.address);
		}))
	)

	playSongRequest$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.PLAY_SONG_REQUEST), withLatestFrom(this.store.select("player")), map(([actionData, playerState]) => {
			if (playerState.currentSong == null && playerState.playlist.length === 0) {
				return new PlayerActions.ClearPlayerRequest();
			} else if (playerState.currentSong == null && playerState.playlist.length > 0) {
				return new PlayerActions.CurrentSongRequest(playerState.playlist[0]["_id"], playerState.playlist[0]["address"]);
			} else if (playerState.stopped == true && playerState.currentSong != null) {
				const streamUrl = playerState.currentSong.ip ? environment.globalStream : environment.streamUrl;
				this.playerService.setAudioElementSource(streamUrl + playerState.currentSong["_id"]);
			}
			this.playerService.playAudioElementSource();
			return new PlayerActions.PlaySong();
		}), catchError((error: any) => {
			return of(new PlayerActions.PlayerError(error.message));
		}))
	);

	pauseSong$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.PAUSE_SONG_REQUEST), map(() => {
			this.playerService.pauseAudioElementSource();
			return new PlayerActions.PauseSong();
		}), catchError((error: any) => {
			return of(new PlayerActions.PlayerError(error.message));
		}))
	);

	stopSong$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.STOP_SONG_REQUEST), map(() => {
			this.playerService.removeAudioElemetSource();
			return new PlayerActions.StopSong();
		}), catchError((error: any) => {
			return of(new PlayerActions.PlayerError(error.message));
		}))
	);

	clearPlayer$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.CLEAR_PLAYER_REQUEST), map(() => {
			this.playerService.removeAudioElemetSource();
			return new PlayerActions.ClearPlayer();
		}), catchError((error: any) => {
			return of(new PlayerActions.PlayerError(error.message));
		}))
	);

	addToPlaylist$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.ADD_PLAYLIST_SONG_REQUEST), switchMap((playerActions: PlayerActions.AddPlaylistSongRequest) => {
			const url = !playerActions.address ? environment.getLibraryData + "/" + playerActions.payload : environment.globalSearchData(playerActions.address.ip, playerActions.address.port) + playerActions.payload;
			return this.http.get<SongResponseData>(url);
		}), withLatestFrom(this.store.select("player")), map(([response, playerState]) => {
			const index = playerState.playlist.map((song) => song._id).indexOf(response._id);
			if (index >= 0) {
				return new PlayerActions.NoopAction();
			}
			return new PlayerActions.AddPlaylistSong(response);
		}), catchError((error: any) => {
			return of(new PlayerActions.PlayerError(error.message));
		}))
	);

	removeFromPlaylist$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.DELETE_PLAYLIST_SONG_REQUEST), withLatestFrom(this.store.select("player")), map(([actionData, playerState]) => {
			if (playerState.playlist.length === 1) {
				return new PlayerActions.ClearPlayerRequest();
			} else if (playerState.playlist.length > 1 && playerState.currentSong && actionData["payload"] === playerState.currentSong["_id"]) {
				this.store.dispatch(new PlayerActions.PlayNextSongRequest());
			}
			return new PlayerActions.DeletePlaylistSong(actionData["payload"]);
		}), catchError((error: any) => {
			return of(new PlayerActions.PlayerError(error.message));
		}))
	);

	playNextSong$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.PLAY_NEXT_SONG_REQUEST), withLatestFrom(this.store.select("player")), map(([actionData, playerState]) => {
			const index = playerState.playlist.map((song) => song._id).indexOf(playerState.currentSong["_id"]);
			if (playerState.playlist.length === 0) {
				return new PlayerActions.ClearPlayer();
			}
			if (index < 0 || index === playerState.playlist.length - 1) {
				return new PlayerActions.StopSongRequest();
			}
			return new PlayerActions.CurrentSongRequest(playerState.playlist[index + 1]["_id"], playerState.playlist[index]["address"]);
		}), catchError((error: any) => {
			return of(new PlayerActions.PlayerError(error.message));
		}))
	);

	playPreviousSong$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.PLAY_PREVIOUS_SONG_REQUEST), withLatestFrom(this.store.select("player")), map(([actionData, playerState]) => {
			const index = playerState.playlist.map((song) => song._id).indexOf(playerState.currentSong["_id"]);
			if (this.playerService.getCurrentTime() > 5) {
				return new PlayerActions.CurrentSongRequest(playerState.playlist[index]["_id"], playerState.playlist[index]["address"]);
			}
			if (index <= 0) {
				return new PlayerActions.StopSongRequest();
			}
			return new PlayerActions.CurrentSongRequest(playerState.playlist[index - 1]["_id"], playerState.playlist[index]["address"]);
		}), catchError((error: any) => {
			return of(new PlayerActions.PlayerError(error.message));
		}))
	);

	changeVolume$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.CHANGE_VOLUME_REQUEST), map((actionData: PlayerActions.ChangeVolumeRequest) => {
			this.playerService.changeAudioElementVolume(actionData.payload);
			return new PlayerActions.ChangeVolume(actionData.payload);
		}))
	);

	seekTrack$ = createEffect(() =>
		this.actions$.pipe(ofType(PlayerActions.SEEK_TRACK_REQUEST), map((actionData: PlayerActions.SeekTrackRequest) => {
			if (actionData.payload.manualEntry) {
				this.playerService.seekAudioElement(actionData.payload.timeElapsed);
			}
			return new PlayerActions.SeekTrack(actionData.payload.timeElapsed);
		}))
	);
}
