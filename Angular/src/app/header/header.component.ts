import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

interface SocketData {
	username: string;
	devices: any;
}

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	constructor(private store: Store<fromApp.AppState>, private socket: Socket) { }

	private storeSub: Subscription;
	private devicesSub: Subscription;

	username = null;
	isLoggedIn = false;
	devices = [];

	ngOnInit() {
		this.storeSub = this.store.select("auth").subscribe(authState => {
			this.isLoggedIn = !!authState.user;
			this.username = !!authState.user ? authState.user.username : null;
			if (!authState.user) {
				this.devices = [];
			}
		});
		this.devicesSub = this.socket.fromEvent<any>("broadcastDevices").subscribe(data => {
			console.log(data);
			if (data.username === this.username)
				this.devices = data.devices;
		})
	}

	ngOnDestroy() {
		this.storeSub.unsubscribe();
		this.devicesSub.unsubscribe();
	}

	logout() {
		this.store.dispatch(new AuthActions.LogoutRequest());
	}

}
