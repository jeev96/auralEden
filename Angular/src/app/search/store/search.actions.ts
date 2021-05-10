import { Action } from "@ngrx/store";

export const SEARCH_REQUEST = "[SEARCH] SEARCH REQUEST";
export const SEARCH = "[SEARCH] SEARCH";

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

export class SearchError implements Action {
	readonly type = SEARCH_ERROR;
	constructor(public payload: string) { }
}

export type SearchActions = SearchRequest | Search | SearchError;
