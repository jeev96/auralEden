import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import * as fromApp from "../store/app.reducer";
import * as LibraryActions from "./store/library.actions";

declare let $: any;

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

	private storeSub: Subscription;

	constructor(private store: Store<fromApp.AppState>, private http: HttpClient) { }

	ngOnInit(): void {
		// this.store.dispatch(new LibraryActions.GetLibraryDataRequest());
		this.storeSub = this.store.select("library").subscribe(libraryData => {
			this.library = libraryData.library;
			this.isloading = libraryData.loading;
			this.count = libraryData.count;
			this.error = libraryData.error;
		});

		this.dtOptions = {
			columns: [
				{ "name": "_id" },
				{ "name": "title" },
				{ "name": "artist" },
				{ "name": "album" },
				{ "name": "duration" },
				{ "name": "rating" },
				{ "name": "bitrate" }
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
			processing: true,
			serverSide: true,
			ajax: (dataTablesParameters: any, callback) => {
				this.http
					.post<DataTablesResponse>(environment.getLibraryDataURL, dataTablesParameters, {})
					.subscribe(response => {
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
					});
			},
		};
	}

	ngOnDestroy(): void {
		this.storeSub.unsubscribe();
	}

	roundNumber(val: number) {
		return Math.round(val);
	}


}
