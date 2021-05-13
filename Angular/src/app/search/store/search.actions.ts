import { Action } from "@ngrx/store";

export const SEARCH_REQUEST = "[SEARCH] SEARCH REQUEST";
export const SEARCH = "[SEARCH] SEARCH";
export const SEARCH_DOWNLOAD_REQUEST = "[SEARCH] SEARCH DOWNLOAD REQUEST";
export const SEARCH_DOWNLOAD = "[SEARCH] SEARCH_DOWNLOAD";

export const SEARCH_ERROR = "[SEARCH] SEARCH ERROR";

export class SearchRequest implements Action {
	readonly type = SEARCH_REQUEST;

	constructor(public payload: string) { }
}
export class Search implements Action {
	readonly type = SEARCH;

	constructor(public payload: {
		ownServer: any,
		otherServers: any
	}) { }
}

export class SearchDownloadRequest implements Action {
	readonly type = SEARCH_DOWNLOAD_REQUEST;

	constructor(public payload: string, public address: { ip: string, port: number }) { }
}
export class SearchDownload implements Action {
	readonly type = SEARCH_DOWNLOAD;
	constructor(public payload: string, public shareString: string) { }
}

export class SearchError implements Action {
	readonly type = SEARCH_ERROR;
	constructor(public payload: string) { }
}

export type SearchActions = SearchRequest
	| Search
	| SearchDownloadRequest
	| SearchDownload
	| SearchError;
