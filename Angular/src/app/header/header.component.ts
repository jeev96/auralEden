import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";
import * as PlayerActions from "../player/store/player.actions";
import { PlayerService } from '../player/player.service';

interface SocketData {
	username: string;
	devices: any;
}

interface ConnectionsResponse {
	deviceId: string,
	selectedDevice: string,
	playerState: {
		playlist: any[],
		currentSong: any,
		duration: number | undefined,
		timeElapsed: number | undefined,
		volume: number,
		playing: boolean,
		paused: boolean,
		stopped: boolean,
		loading: boolean,
		error: string
	}
}

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	constructor(
		private store: Store<fromApp.AppState>,
		private socket: Socket,
		private playerService: PlayerService
	) { }

	private authSub: Subscription;
	private playerSub: Subscription;
	private devicesSub: Subscription;
	private userConnectionsSub: Subscription;
	private controlSub: Subscription;

	username = null;
	playerState = null;
	isLoggedIn = false;
	devices = [];
	selectedDevice = null;


	ngOnInit() {
		this.authSub = this.store.select("auth").subscribe(authState => {
			this.isLoggedIn = !!authState.user;
			this.username = !!authState.user ? authState.user.username : null;
			this.selectedDevice = authState.selectedDevice;

			if (!authState.user) {
				this.devices = [];
			}
		});
		this.playerSub = this.store.select("player").subscribe(playerState => {
			this.playerState = playerState;
			this.broadcastPlayerData();
		});
		this.devicesSub = this.socket.fromEvent<any>("broadcastDevices").subscribe(data => {
			if (data.username === this.username)
				this.devices = data.devices;
		});
		this.userConnectionsSub = this.socket.fromEvent<ConnectionsResponse>("broadcastSetState").subscribe(data => {
			if (data.deviceId === this.getDeviceId() && data.selectedDevice == null) {
				console.log("StateTransfer data received");
				this.store.dispatch(new PlayerActions.PlayerData(data.playerState));
			} else if (data.deviceId === null && data.selectedDevice !== this.getDeviceId() && data.selectedDevice === this.selectedDevice) {
				console.log("Command data received");
				this.store.dispatch(new PlayerActions.PlayerRemoteData(data.playerState));
			}
		});
		this.controlSub = this.socket.fromEvent<{ deviceId: string, command: string, data: any }>("broadcastControlDevice").subscribe(data => {
			if (data.deviceId === this.getDeviceId()) {
				this.store.dispatch(new PlayerActions.RemoteCommand({ command: data.command, data: data.data }));
			}
		});
	}

	ngOnDestroy() {
		this.authSub.unsubscribe();
		this.playerSub.unsubscribe();
		this.devicesSub.unsubscribe();
		this.userConnectionsSub.unsubscribe();
		this.controlSub.unsubscribe();
	}

	logout() {
		this.store.dispatch(new AuthActions.Logout());
	}

	playOnDevice(deviceId) {
		if (deviceId === this.getDeviceId()) {
			return;
		}
		this.store.dispatch(new PlayerActions.PauseSongRequest());
		const data = {
			deviceId: deviceId,
			selectedDevice: null,
			playerState: this.playerState
		}
		this.socket.emit("setState", data);
		console.log("data Sent");
	}

	broadcastPlayerData() {
		if (this.selectedDevice !== this.getDeviceId()) {
			return;
		}
		const data = {
			deviceId: null,
			selectedDevice: this.getDeviceId(),
			playerState: this.playerState
		}
		this.socket.emit("setState", data);
		console.log("data Sent");
	}

	selectDevice(deviceId) {
		this.store.dispatch(new AuthActions.DeviceChange(deviceId));
	}

	isSelectedDevice(deviceId) {
		return deviceId === this.selectedDevice;
	}

	@HostListener('window:beforeunload', ['$event'])
	beforeUnloadHandler(event) {
		this.store.dispatch(new AuthActions.DeviceOffline());
	}

	getDeviceId = () => {
		return localStorage.getItem("deviceId");
	}
}
