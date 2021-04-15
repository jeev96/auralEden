import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import * as fromApp from "../store/app.reducer";
import * as SettingsActions from "./store/settings.actions";

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
	settingsForm: FormGroup;

	uploadFiles: File[] = [];
	scannedLocations = [];
	isLoading = false;
	scannedFiles = 0;

	private storeSub: Subscription;

	constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>, private http: HttpClient) { }

	ngOnInit(): void {
		this.storeSub = this.store.select("settings").subscribe(settings => {
			this.isLoading = settings.loading;
			this.scannedLocations = settings.mediaLocation;
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
		let scanLocations = new FormArray([]);

		if (this.scannedLocations.length > 0) {
			for (let location of this.scannedLocations) {
				scanLocations.push(new FormGroup({ "mediaLocation": new FormControl(location, Validators.required) }));
			}
		} else {
			scanLocations.push(new FormGroup({ "mediaLocation": new FormControl(null, Validators.required) }));
		}

		this.storeSub = this.store.select("settings").subscribe(settings => {
			mediaLocation = settings.mediaLocation;
		})

		this.settingsForm = new FormGroup({
			"scanLocations": scanLocations,
		});

	}

	onSubmit() {
		const locations = this.settingsForm.value.scanLocations.map(location => location.mediaLocation);
		this.store.dispatch(new SettingsActions.SetMediaLocationRequest(locations));
	}

	onCancel() {
		this.router.navigate(["../"], { relativeTo: this.route });
	}

	onAddIngredient() {
		(<FormArray>this.settingsForm.get("scanLocations")).push(new FormGroup({
			"mediaLocation": new FormControl(null, Validators.required)
		}))
	}

	onDeleteIngredient(index) {
		(<FormArray>this.settingsForm.get("scanLocations")).removeAt(index);
	}

	get controls() {
		return (<FormArray>this.settingsForm.get('scanLocations')).controls;
	}

	onSelect(event) {
		console.log(event);
		this.uploadFiles.push(...event.addedFiles);
	}

	onRemove(event) {
		console.log(event);
		this.uploadFiles.splice(this.uploadFiles.indexOf(event), 1);
	}

	clearFiles() {
		this.uploadFiles.splice(0, this.uploadFiles.length);
	}

	onUploadFiles() {
		if (this.uploadFiles.length === 0) {
			return;
		}

		let formData = new FormData();

		for (let i = 0; i < this.uploadFiles.length; i++) {
			formData.append("data", this.uploadFiles[i]);
		}

		this.http.post(environment.uploadUrl, formData).subscribe((res) => {
			console.log(res);
			this.clearFiles();
		}, error => {
			console.log(error);
		})
	}
}
