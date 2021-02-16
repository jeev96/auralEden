import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import * as fromApp from "../store/app.reducer";

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
	private storeSub: Subscription;

	albumArtUrl = "/assets/media/album/cover.jpg";
	streamUrl = "/assets/media/album/cover.jpg";
	currentSong: any;
	playlist = []
	playing = false;
	paused = false;
	stopped = false;
	isLoading = false;
	error = null;

	audio = new Audio();

	constructor(private store: Store<fromApp.AppState>,) { }


	ngOnInit(): void {
		this.storeSub = this.store.select("player").subscribe(playerData => {
			console.log(playerData.currentSong["_id"]);

			this.albumArtUrl = "http://localhost:3000/api/song/albumArt/" + playerData.currentSong["_id"];
			this.streamUrl = "http://localhost:3000/api/song/stream/" + playerData.currentSong["_id"];
			this.currentSong = playerData.currentSong;
			this.playlist = playerData.playlist;
			this.isLoading = playerData.loading;
			this.playing = playerData.playing;
			this.paused = playerData.paused;
			this.stopped = playerData.stopped;
			this.error = playerData.error;
		});
	}

	ngOnDestroy(): void {
		this.storeSub.unsubscribe();
	}

	play() {
		console.log("play");
		this.audio.src = this.streamUrl;
		this.audio.load();
		this.audio.play();
	}

	pause() {
		console.log("pause");
		this.audio.pause();
		this.audio.removeAttribute("src");
		this.audio.load();
	}

	stop() {
		console.log("stop");
		this.audio.removeAttribute("src");
		this.audio.load();
	}

	roundNumber(val: number) {
		return Math.round(val);
	}

	formatTime(time: number, format: string = "HH:mm:ss") {
		const momentTime = time * 1000;
		return moment.utc(momentTime).format(format);
	}

}
