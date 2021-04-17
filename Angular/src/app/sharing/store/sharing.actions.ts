import { Action } from "@ngrx/store";

export const START_SHARING_REQUEST = "[SHARING] START SHARING REQUEST";
export const START_SHARING = "[SHARING] START SHARING";
export const STOP_SHARING_REQUEST = "[SHARING] STOP SHARING REQUEST";
export const STOP_SHARING = "[SHARING] STOP SHARING";

export const START_DOWNLOAD_REQUEST = "[SHARING] START DOWNLOAD REQUEST";
export const START_DOWNLOAD = "[SHARING] START DOWNLOAD";
export const STOP_DOWNLOAD_REQUEST = "[SHARING] STOP DOWNLOAD REQUEST";
export const STOP_DOWNLOAD = "[SHARING] STOP DOWNLOAD";

export const SHARING_REQUEST_ERROR = "[SHARING] SHARING REQUEST ERROR";
export const DOWNLOAD_REQUEST_ERROR = "[SHARING] DOWNLOAD REQUEST ERROR";


export class StartSharingRequest implements Action {
	readonly type = START_SHARING_REQUEST;

	constructor(public payload: string) { }
}
export class StartSharing implements Action {
	readonly type = START_SHARING;

	constructor(public payload: { shareString: string, torrentId: string, name: string }) { }
}
export class StopSharingRequest implements Action {
	readonly type = STOP_SHARING_REQUEST;
	constructor(public payload: string) { }
}
export class StopSharing implements Action {
	readonly type = STOP_SHARING;
	constructor(public payload: string) { }
}

export class StartDownloadRequest implements Action {
	readonly type = START_DOWNLOAD_REQUEST;

	constructor(public payload: { encryptedString: string, location: string }) { }
}
export class StartDownload implements Action {
	readonly type = START_DOWNLOAD;

	constructor(public payload: { name: string, torrentId: string, size: string }) { }
}
export class StopDownloadRequest implements Action {
	readonly type = STOP_DOWNLOAD_REQUEST;
}
export class StopDownload implements Action {
	readonly type = STOP_DOWNLOAD;
	constructor(public payload: string) { }
}

export class SharingRequestError implements Action {
	readonly type = SHARING_REQUEST_ERROR;
	constructor(public payload: string) { }
}
export class DownloadRequestError implements Action {
	readonly type = DOWNLOAD_REQUEST_ERROR;
	constructor(public payload: string) { }
}

export type SharingActions = StartSharingRequest
	| StartSharing
	| StopSharingRequest
	| StopSharing
	| StartDownloadRequest
	| StartDownload
	| StopDownloadRequest
	| StopDownload
	| SharingRequestError
	| DownloadRequestError;
