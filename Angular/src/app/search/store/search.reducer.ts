import * as SearchActions from "./search.actions"

export interface State {
	searchLoading: boolean,
	searchDataOwn: any,
	searchDataOthers: any,
	searchError: string,
	searchDownloadLoading: any
}

const initialState: State = {
	searchLoading: false,
	searchDataOwn: [],
	searchDataOthers: [],
	searchError: null,
	searchDownloadLoading: []
}

export function searchReducer(state = initialState, action: SearchActions.SearchActions) {
	switch (action.type) {
		case SearchActions.SEARCH_REQUEST:
			return {
				...state,
				searchLoading: true,
				searchDataOwn: [],
				searchDataOthers: [],
				searchError: null,
			}
		case SearchActions.SEARCH:
			return {
				...state,
				searchLoading: false,
				searchDataOwn: [...state.searchDataOwn, ...action.payload.ownServer],
				searchDataOthers: [...state.searchDataOthers, ...action.payload.otherServers],
				searchError: null,
			}
		case SearchActions.SEARCH_DOWNLOAD_REQUEST:
			return {
				...state,
				searchDownloadLoading: [...state.searchDownloadLoading, action.payload]
			}
		case SearchActions.SEARCH_DOWNLOAD:
			const downloading = state.searchDownloadLoading.filter(element => element !== action.payload);
			return {
				...state,
				searchDownloadLoading: downloading
			}
		case SearchActions.SEARCH_ERROR:
			return {
				...state,
				searchLoading: false,
				searchDataOwn: [],
				searchDataOthers: [],
				searchError: action.payload,
			}
		default: return state
	}
}

