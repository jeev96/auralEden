import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from "rxjs/operators";
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import * as fromApp from "../store/app.reducer";
import * as PlayerActions from "./store/player.actions";
import { HttpClient } from '@angular/common/http';


@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
	private storeSub: Subscription;

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

	constructor(private store: Store<fromApp.AppState>, private http: HttpClient) { }

	ngOnInit(): void {
		this.storeSub = this.store.select("player").subscribe(playerData => {
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
			this.timeElapsed = playerData.timeElapsed;
			this.error = playerData.error;
			if (playerData.playing) {
				this.seekTimer = setInterval(() => this.updateSeekSlider(), 1000);
			}
		});
	}

	ngOnDestroy(): void {
		this.storeSub.unsubscribe();
		clearInterval(this.seekTimer);
	}

	private updateSeekSlider() {
		if (this.playing) {
			this.seekTrack(this.timeElapsed + 1, false);
		}
	}

	play() {
		if (!this.playing) {
			this.store.dispatch(new PlayerActions.PlaySongRequest(this.currentSong["_id"]));
		}
	}

	changeCurrentSong(songId) {
		this.store.dispatch(new PlayerActions.GetPlayerSongRequest(songId));
	}

	pause() {
		if (this.playing) {
			this.store.dispatch(new PlayerActions.PauseSongRequest());
		}
	}

	stop() {
		this.store.dispatch(new PlayerActions.StopSongRequest());
	}

	next() {
		this.store.dispatch(new PlayerActions.PlayNextSongRequest());
	}

	previous() {
		this.store.dispatch(new PlayerActions.PlayPreviousSongRequest());
	}

	removeFromPlaylist(songId) {
		this.store.dispatch(new PlayerActions.DeletePlaylistSongRequest(songId));
	}

	mute(mute: boolean) {
		this.store.dispatch(new PlayerActions.ChangeVolumeRequest(mute ? 0 : 0.5));
	}
	changeVolume(event) {
		this.store.dispatch(new PlayerActions.ChangeVolumeRequest(event.target.value / 100));
	}

	seekTrack(event, isManual = true) {
		let value = event;
		if (event.target) {
			value = event.target.value
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
}
