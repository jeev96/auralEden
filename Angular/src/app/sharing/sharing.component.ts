import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard'
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from "../store/app.reducer";
import * as SharingActions from "./store/sharing.actions";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-sharing',
	templateUrl: './sharing.component.html',
	styleUrls: ['./sharing.component.css']
})
export class SharingComponent implements OnInit, OnDestroy {

	sharingForm: FormGroup;
	downloadForm: FormGroup;

	isShareLoading = false;
	isShareLinkLoaded = false;
	shareError = null;
	isDownloadLoading = false;
	isDownloadLinkLoaded = false;
	downloadError = null;

	isDeleting = null;
	statsTimer = null;
	downloadTimer = null;

	shareData = [];
	downloadData = [];

	private storeSub: Subscription;

	constructor(
		private store: Store<fromApp.AppState>,
		private clipboardService: ClipboardService,
		private http: HttpClient
	) { }

	ngOnInit(): void {
		this.initForms();
		this.storeSub = this.store.select("sharing").subscribe(sharingData => {
			this.isShareLoading = sharingData.shareLoading;
			this.isDownloadLoading = sharingData.downloadLoading;
			this.isShareLinkLoaded = sharingData.isSharing;
			this.isDownloadLinkLoaded = sharingData.isDownloading;
			this.shareError = sharingData.shareError;
			this.downloadError = sharingData.downloadError;
			this.shareData = sharingData.shareData;
			this.downloadData = sharingData.downloadData;
			this.isDeleting = null;

			this.updateIntervals();
		});
	}
	ngOnDestroy() {
		this.storeSub.unsubscribe();
		clearInterval(this.statsTimer);
	}

	private initForms() {
		this.sharingForm = new FormGroup({
			"contentLocation": new FormControl(null, Validators.required),
		});
		this.downloadForm = new FormGroup({
			"encryptedCode": new FormControl(null, Validators.required),
			"saveLocation": new FormControl(null, Validators.required),
		});

	}

	private updateIntervals() {
		clearInterval(this.statsTimer);
		if (this.shareData.length > 0) {
			this.statsTimer = setInterval(() => this.updateStats(), 5000);
		}
	}

	private updateStats() {
		this.store.dispatch(new SharingActions.TorrentStatsRequest());
	}

	prettyBytes(num: number) {
		let exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		if (neg) num = -num
		if (num < 1) return (neg ? '-' : '') + num + ' B'
		exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
		num = Number((num / Math.pow(1024, exponent)).toFixed(2))
		unit = units[exponent]
		return (neg ? '-' : '') + num + ' ' + unit
	}

	onSubmitShare() {
		this.store.dispatch(new SharingActions.StartSharingRequest(this.sharingForm.value.contentLocation));
	}

	onSubmitDownload() {
		this.store.dispatch(new SharingActions.StartDownloadRequest({
			encryptedString: this.downloadForm.value.encryptedCode,
			location: this.downloadForm.value.saveLocation
		}));
	}

	selectLocation() {

	}

	stopClient(torrentId, isUpload) {
		this.isDeleting = torrentId;
		this.store.dispatch(new SharingActions.StopTorrentRequest({ torrentId: torrentId, isUpload: isUpload }));
	}

	copy(link) {
		this.clipboardService.copy(link);
	}
}
