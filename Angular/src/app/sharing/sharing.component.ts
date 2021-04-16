import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard'
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from "../store/app.reducer";
import * as SharingActions from "./store/sharing.actions";

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

	shareLink = null;

	private storeSub: Subscription;

	constructor(private store: Store<fromApp.AppState>, private clipboardService: ClipboardService) { }

	ngOnInit(): void {
		this.initForms();
		this.storeSub = this.store.select("sharing").subscribe(sharingData => {
			this.isShareLoading = sharingData.shareLoading;
			this.isDownloadLoading = sharingData.downloadLoading;
			this.isShareLinkLoaded = sharingData.isSharing;
			this.isDownloadLinkLoaded = sharingData.isDownloading;
			this.shareError = sharingData.shareError;
			this.downloadError = sharingData.downloadError;

			this.shareLink = sharingData.shareString;
		});
	}
	ngOnDestroy() {
		this.storeSub.unsubscribe();
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

	onSubmitShare() {
		this.store.dispatch(new SharingActions.SharingStringRequest(this.sharingForm.value.contentLocation));
	}

	onSubmitDownload() {
		this.store.dispatch(new SharingActions.DownloadStringRequest({
			encryptedString: this.downloadForm.value.encryptedCode,
			location: this.downloadForm.value.saveLocation
		}));
	}

	selectLocation() {

	}

	copy() {
		this.clipboardService.copy(this.shareLink);
	}
}
