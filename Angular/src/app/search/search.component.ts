import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from "../store/app.reducer";
import * as SearchActions from "./store/search.actions";

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

	private storeSub: Subscription;

	constructor(private store: Store<fromApp.AppState>,) { }

	ngOnInit(): void {
		this.initForm();
		this.storeSub = this.store.select("search").subscribe(searchData => {
			this.searchDataOwn = searchData.searchDataOwn ? searchData.searchDataOwn : [];
			this.searchDataOthers = searchData.searchDataOthers ? searchData.searchDataOthers : [];
			this.isLoading = searchData.searchLoading;
			this.searchError = searchData.searchError;
		});
	}

	ngOnDestroy() {
		this.storeSub.unsubscribe();
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

	play() {

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
