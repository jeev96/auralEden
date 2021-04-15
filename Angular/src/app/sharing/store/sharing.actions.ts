import { Action } from "@ngrx/store";

export const SHARING_STRING_REQUEST = "[SHARING] SHARING STRING REQUEST";
export const SHARING_STRING = "[SHARING] SHARING STRING";
export const DOWNLOAD_STRING_REQUEST = "[SHARING] DOWNLOAD STRING REQUEST";
export const DOWNLOAD_STRING = "[SHARING] DOWNLOAD STRING";

export const STOP_SHARING_REQUEST = "[SHARING] STOP SHARING REQUEST";
export const STOP_DOWNLOAD_REQUEST = "[SHARING] STOP DOWNLOAD REQUEST";

export const SHARING_REQUEST_ERROR = "[SHARING] SHARING REQUEST ERROR";
export const DOWNLOAD_REQUEST_ERROR = "[SHARING] DOWNLOAD REQUEST ERROR";


export class SharingStringRequest implements Action {
	readonly type = SHARING_STRING_REQUEST;

	constructor(public payload: string) { }
}
export class SharingString implements Action {
	readonly type = SHARING_STRING;

	constructor(public payload: string) { }
}

export class DownloadStringRequest implements Action {
	readonly type = DOWNLOAD_STRING_REQUEST;

	constructor(public payload: { encryptedString: string, location: string }) { }
}
export class DownloadString implements Action {
	readonly type = DOWNLOAD_STRING;

	constructor(public payload: { encryptedString: string, location: string }) { }
}

export class StopSharingRequest implements Action {
	readonly type = STOP_SHARING_REQUEST;
}
export class StopDownloadRequest implements Action {
	readonly type = STOP_DOWNLOAD_REQUEST;
}

export class SharingRequestError implements Action {
	readonly type = SHARING_REQUEST_ERROR;
	constructor(public payload: string) { }
}
export class DownloadRequestError implements Action {
	readonly type = DOWNLOAD_REQUEST_ERROR;
	constructor(public payload: string) { }
}

export type SharingActions = SharingStringRequest
	| SharingString
	| DownloadStringRequest
	| DownloadString
	| StopSharingRequest
	| StopDownloadRequest
	| SharingRequestError
	| DownloadRequestError;
