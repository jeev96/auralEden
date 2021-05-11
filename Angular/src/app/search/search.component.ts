import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from "../store/app.reducer";
import * as SearchActions from "./store/search.actions";
import * as PlayerActions from "../player/store/player.actions";

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

	searchForm: FormGroup;
	searchDataOwn = [];
	searchDataOthers = [];
	isLoading = false;
	searchError = null;

	currentSongId = null;
	playing = false;
	playlistIds = [];

	private storeSub: Subscription;
	private playerSub: Subscription;

	constructor(private store: Store<fromApp.AppState>,) { }

	ngOnInit(): void {
		this.initForm();
		this.storeSub = this.store.select("search").subscribe(searchData => {
			this.searchDataOwn = searchData.searchDataOwn ? searchData.searchDataOwn : [];
			this.searchDataOthers = searchData.searchDataOthers ? searchData.searchDataOthers : [];
			this.isLoading = searchData.searchLoading;
			this.searchError = searchData.searchError;
		});
		this.playerSub = this.store.select("player").subscribe(playerData => {
			if (playerData.currentSong) {
				this.currentSongId = playerData.currentSong._id;
			}
			this.playing = playerData.playing;
			this.playlistIds = playerData.playlist.map(song => song[0]);
		});
	}

	ngOnDestroy() {
		this.storeSub.unsubscribe();
		this.playerSub.unsubscribe();
	}

	private initForm() {
		this.searchForm = new FormGroup({
			"searchString": new FormControl(null, Validators.required),
		});
	}

	onSubmit() {
		console.log(this.searchForm.value.searchString);
		this.store.dispatch(new SearchActions.SearchRequest(this.searchForm.value.searchString));
	}

	playSong(songId, isLocal = true) {
		this.store.dispatch(new PlayerActions.CurrentSongRequest(songId, isLocal));
	}

	pauseSong() {
		this.store.dispatch(new PlayerActions.PauseSongRequest());
	}

	addToPlaylist(song) {
		this.store.dispatch(new PlayerActions.AddPlaylistSongRequest(song));
	}

	removeFromPlaylist(songId) {
		this.store.dispatch(new PlayerActions.DeletePlaylistSongRequest(songId));
	}

	download() {

	}

	displayCompleteInfo(infoObject) {
		return JSON.stringify(infoObject, undefined, 2);
	}

	getBitrate(bitrate) {
		return Math.trunc(bitrate / 1000);
	}
}
