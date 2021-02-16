import { Action } from "@ngrx/store";

export const GET_LIBRARY_DATA_REQUEST = "[LIBRARY] GET LIBRARY DATA REQUEST";
export const GET_LIBRARY_DATA_ERROR = "[LIBRARY] GET LIBRARY DATA ERROR";
export const GET_LIBRARY_DATA = "[LIBRARY] GET LIBRARY DATA";
export const SET_LIBRARY_DATA = "[LIBRARY] SET LIBRARY DATA";
export const GET_LIBRARY_COUNT = "[LIBRARY] GET LIBRARY COUNT";
export const SET_LIBRARY_COUNT = "[LIBRARY] SET LIBRARY COUNT";

export class GetLibraryDataRequest implements Action {
	readonly type = GET_LIBRARY_DATA_REQUEST;
}

export class GetLibraryDataError implements Action {
	readonly type = GET_LIBRARY_DATA_ERROR;

	constructor(public payload: string) { }
}

export class GetLibraryData implements Action {
	readonly type = GET_LIBRARY_DATA;
}

export class SetLibraryData implements Action {
	readonly type = SET_LIBRARY_DATA;

	constructor(public payload: {
		data: any[];
		draw: number;
		recordsFiltered: number;
		recordsTotal: number;
	}) { }
}

export class GetLibraryCount implements Action {
	readonly type = GET_LIBRARY_COUNT;
}

export type LibraryActions = GetLibraryDataRequest
	| GetLibraryDataError
	| GetLibraryData
	| SetLibraryData
	| GetLibraryCount;
