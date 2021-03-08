import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	constructor(private store: Store<fromApp.AppState>) { }

	private storeSub: Subscription;

	isLoggedIn = false;
	devices = [];

	ngOnInit() {
		this.storeSub = this.store.select("auth").subscribe(authState => {
			this.isLoggedIn = !!authState.user;
			if (authState.user && authState.user.devices) {
				this.devices = authState.user.devices;
			} else {
				this.devices = [];
			}
		});
	}

	ngOnDestroy() {
		this.storeSub.unsubscribe();
	}

	logout() {
		this.store.dispatch(new AuthActions.LogoutRequest());
	}

}
