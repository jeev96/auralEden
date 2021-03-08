import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from "./store/app.reducer";
import * as PlayerActions from "./player/store/player.actions";
import * as AuthActions from "./auth/store/auth.actions";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'aural-eden';

	@ViewChild('audioPlayer') audioPlayer: ElementRef;

	constructor(private store: Store<fromApp.AppState>) { }

	ngOnInit() {
		this.store.dispatch(new AuthActions.AutoLogin());
	}

	handleAudioEnded() {
		this.store.dispatch(new PlayerActions.PlayNextSongRequest());
	}
}
