import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import * as fromApp from "../store/app.reducer";
import * as LibraryActions from "./store/library.actions";
import * as PlayerActions from "../player/store/player.actions";
import { Socket } from 'ngx-socket-io';
export class DataTablesResponse {
	data: any[];
	draw: number;
	recordsFiltered: number;
	recordsTotal: number;
}

@Component({
	selector: 'app-library',
	templateUrl: './library.component.html',
	styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, OnDestroy {
	isloading = false;
	library: any;
	count: number;
	error: string;

	limit = 10;
	page = 0;
	dtOptions: any = {};

	currentSongId = null;
	playing = false;
	playlistIds = [];
	selectedDevice = null;

	private librarySub: Subscription;
	private playerSub: Subscription;
	private authSub: Subscription;

	constructor(
		private store: Store<fromApp.AppState>,
		private http: HttpClient,
		private socket: Socket
	) { }

	ngOnInit(): void {
		this.librarySub = this.store.select("library").subscribe(libraryData => {
			this.library = libraryData.library;
			this.isloading = libraryData.loading;
			this.count = libraryData.count;
			this.error = libraryData.error;
		});
		this.authSub = this.store.select("auth").subscribe(authData => {
			this.selectedDevice = authData.selectedDevice;
		});
		this.playerSub = this.store.select("player").subscribe(playerData => {
			if (playerData.currentSong) {
				this.currentSongId = playerData.currentSong["_id"];
			}
			this.playing = playerData.playing;
			this.playlistIds = playerData.playlist.map(song => song[0]);
		});
		this.dtOptions = {
			columns: [
				{ "name": "_id" },
				{ "name": "title" },
				{ "name": "artist" },
				{ "name": "album" },
				{ "name": "duration" },
				{ "name": "rating" },
				{ "name": "bitrate" },
				{ "name": "controls" }
			],
			columnDefs: [
				{ "width": "20%", "targets": 1 },
				{ "width": "15%", "targets": 2 },
				{ "width": "20%", "targets": 3 }
			],
			autoWidth: false,
			// scrollX: true,
			initComplete: (settings, json) => {
				$("#pagination-container").append($(".dataTables_paginate"));
			},
			pageLength: 10,
			lengthMenu: [10, 25, 50],
			processing: false,
			serverSide: true,
			ajax: (dataTablesParameters: any, callback) => {
				this.http.post<DataTablesResponse>(environment.getLibraryData, dataTablesParameters, {}).subscribe(response => {
					this.store.dispatch(new LibraryActions.SetLibraryData({
						data: response.data,
						draw: response.draw,
						recordsFiltered: response.recordsFiltered,
						recordsTotal: response.recordsTotal
					}))

					callback({
						recordsTotal: response.recordsTotal,
						recordsFiltered: response.recordsFiltered,
						data: [],
					});
				}, (error) => {
					this.error = "Unable to Fetch Data. Please Check your Connection!!";
				});
			}
		};
	}

	ngOnDestroy(): void {
		this.librarySub.unsubscribe();
		this.authSub.unsubscribe();
		this.playerSub.unsubscribe();
	}

	playSong(songId) {
		if (this.selectedDevice && this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.PLAY_SONG_REQUEST,
				data: songId
			};
			this.socket.emit("controlDevice", data);
			return;
		}

		this.store.dispatch(new PlayerActions.CurrentSongRequest(songId));
	}

	pauseSong() {
		if (this.selectedDevice && this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.PAUSE_SONG_REQUEST,
				data: null
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		this.store.dispatch(new PlayerActions.PauseSongRequest());
	}

	addToPlaylist(song) {
		if (this.selectedDevice && this.getDeviceId() !== this.selectedDevice) {
			const data = {
				deviceId: this.selectedDevice,
				command: PlayerActions.ADD_PLAYLIST_SONG_REQUEST,
				data: song
			};
			this.socket.emit("controlDevice", data);
			return;
		}
		this.store.dispatch(new PlayerActions.AddPlaylistSongRequest(song));
	}

	removeFromPlaylist(songId) {
		if (this.selectedDevice && this.getDeviceId() !== this.selectedDevice) {
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

	roundNumber(val: number) {
		return Math.round(val);
	}

	getDeviceId = () => {
		return localStorage.getItem("deviceId");
	}
}
