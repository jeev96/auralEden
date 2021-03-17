import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from "rxjs/operators";
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import * as fromApp from "../store/app.reducer";
import * as PlayerActions from "./store/player.actions";
import { HttpClient } from '@angular/common/http';
import { PlayerService } from './player.service';
import { Socket } from 'ngx-socket-io';


@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
	private playerSub: Subscription;
	private authSub: Subscription;

	albumArtUrl = "/assets/media/album/cover.jpg";
	currentSong: "Add a song to Playlist";
	playlist = [];
	playing = false;
	paused = false;
	stopped = false;
	isLoading = false;
	volume = 100;
	duration = 100;
	timeElapsed = 0;
	seekTimer = null;
	error = null;
	selectedDevice = null;

	constructor(
		private store: Store<fromApp.AppState>,
		private http: HttpClient,
		private socket: Socket,
		private playerService: PlayerService
	) { }

	ngOnInit(): void {
		this.authSub = this.store.select("auth").subscribe(authData => {
			this.selectedDevice = authData.selectedDevice;
		});
		this.playerSub = this.store.select("player").subscribe(playerData => {
			clearInterval(this.seekTimer);
			if (playerData.currentSong) {
				this.albumArtUrl = environment.albumArtUrl + playerData.currentSong["_id"];
				this.currentSong = playerData.currentSong;
				this.duration = playerData.duration;
			} else {
				this.albumArtUrl = "/assets/media/album/cover.jpg";
				this.currentSong = null;
				this.duration = 100;
			}
			this.playlist = playerData.playlist;
			this.isLoading = playerData.loading;
			this.playing = playerData.playing;
			this.paused = playerData.paused;
			this.stopped = playerData.stopped;
			this.volume = playerData.volume * 100;
			if (this.getDeviceId() !== this.selectedDevice) {
				this.timeElapsed = playerData.timeElapsed;
				this.error = playerData.error;
			} else {
				this.timeElapsed = this.playerService.getCurrentTime();
				this.error = playerData.error;
				if (playerData.playing) {
					this.seekTimer = setInterval(() => this.updateSeekSlider(), 1000);
				}
			}
		});
	}

	ngOnDestroy(): void {
		this.playerSub.unsubscribe();
		this.authSub.unsubscribe();
		clearInterval(this.seekTimer);
	}

	private updateSeekSlider() {
		if (this.playing) {
			this.seekTrack(this.timeElapsed + 1, false);
		}
	}

	play() {
		if (this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.PLAY_SONG_REQUEST,
				data: this.currentSong["_id"]
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		else if (!this.playing && this.currentSong) {
			this.store.dispatch(new PlayerActions.PlaySongRequest(this.currentSong["_id"]));
			return;
		}
	}
	pause() {
		if (this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.PAUSE_SONG_REQUEST,
				data: null
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		else if (this.playing) {
			this.store.dispatch(new PlayerActions.PauseSongRequest());
		}
	}

	stop() {
		if (this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.STOP_SONG_REQUEST,
				data: null
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		this.store.dispatch(new PlayerActions.StopSongRequest());
	}

	changeCurrentSong(songId) {
		if (this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.CURRENT_SONG_REQUEST,
				data: songId
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		this.store.dispatch(new PlayerActions.CurrentSongRequest(songId));
	}

	next() {
		if (this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.PLAY_NEXT_SONG_REQUEST,
				data: null
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		this.store.dispatch(new PlayerActions.PlayNextSongRequest());
	}

	previous() {
		if (this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.PLAY_PREVIOUS_SONG_REQUEST,
				data: null
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		this.store.dispatch(new PlayerActions.PlayPreviousSongRequest());
	}

	removeFromPlaylist(songId) {
		if (this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.DELETE_PLAYLIST_SONG_REQUEST,
				data: songId
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		this.store.dispatch(new PlayerActions.DeletePlaylistSongRequest(songId));
	}

	mute(mute: boolean) {
		if (this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.CHANGE_VOLUME_REQUEST,
				data: mute ? 0 : 0.5
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		this.store.dispatch(new PlayerActions.ChangeVolumeRequest(mute ? 0 : 0.5));
	}
	changeVolume(event) {
		if (this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.CHANGE_VOLUME_REQUEST,
				data: event.target.value / 100
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		this.store.dispatch(new PlayerActions.ChangeVolumeRequest(event.target.value / 100));
	}

	seekTrack(event, isManual = true) {
		let value = event;
		if (event.target) {
			value = event.target.value
		}
		if (this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.SEEK_TRACK_REQUEST,
				data: { timeElapsed: +value, manualEntry: isManual }
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		this.store.dispatch(new PlayerActions.SeekTrackRequest({ timeElapsed: +value, manualEntry: isManual }));
	}

	downloadSong(songId, title = "download") {
		return this.http.get(environment.streamUrl + songId, {
			responseType: "blob",
		}).pipe(map(res => {
			return {
				filename: title,
				data: res
			};
		})).subscribe(res => {
			let url = window.URL.createObjectURL(res.data);
			let a = document.createElement('a');
			document.body.appendChild(a);
			a.setAttribute('style', 'display: none');
			a.href = url;
			a.download = res.filename;
			a.click();
			window.URL.revokeObjectURL(url);
			a.remove();
		});
	}

	roundNumber(val: number) {
		return Math.trunc(val);
	}

	formatTime(time: number, format: string = "HH:mm:ss") {
		const momentTime = time * 1000;
		return moment.utc(momentTime).format(format);
	}

	getDeviceId = () => {
		return localStorage.getItem("deviceId");
	}
}
