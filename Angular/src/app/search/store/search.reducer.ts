import * as SearchActions from "./search.actions"

export interface State {
	searchLoading: boolean,
	searchDataOwn: any,
	searchDataOthers: any,
	searchError: string,
}

const initialState: State = {
	searchLoading: false,
	searchDataOwn: [],
	searchDataOthers: [],
	searchError: null,
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

