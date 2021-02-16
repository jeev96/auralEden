import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from "../store/app.reducer";
import * as SettingsActions from "./store/settings.actions";

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
	settingsForm: FormGroup;

	isLoading = false;
	scannedFiles = 0;

	private storeSub: Subscription;

	constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) { }

	ngOnInit(): void {
		this.storeSub = this.store.select("settings").subscribe(settings => {
			this.isLoading = settings.loading;
		});
		this.initForm();
	}

	ngOnDestroy() {
		if (this.storeSub) {
			this.storeSub.unsubscribe();
		}
	}

	private initForm() {
		let mediaLocation = [];
		let theme = "";

		this.storeSub = this.store.select("settings").subscribe(settings => {
			mediaLocation = settings.mediaLocation;
			theme = settings.appTheme;
		})

		this.settingsForm = new FormGroup({
			"mediaLocation": new FormControl(mediaLocation, Validators.required),
			"theme": new FormControl(theme, Validators.required)
		});

	}

	onSubmit() {
		console.log(this.settingsForm.value.mediaLocation);

		this.store.dispatch(new SettingsActions.SetMediaLocationRequest([this.settingsForm.value.mediaLocation]));
		this.store.dispatch(new SettingsActions.SetTheme(this.settingsForm.value.theme));
	}

	onCancel() {
		this.router.navigate(["../"], { relativeTo: this.route });
	}
}
