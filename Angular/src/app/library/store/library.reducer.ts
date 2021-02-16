import * as LibraryActions from "./library.actions";

export interface State {
	library: {
		data: any[];
		draw: number;
		recordsFiltered: number;
		recordsTotal: number;
	},
	count: any,
	loading: boolean,
	error: string
}

const initialState: State = {
	library: {
		data: [],
		draw: +1,
		recordsFiltered: 0,
		recordsTotal: 0
	},
	count: 0,
	loading: false,
	error: null
}

export function libraryReducer(state = initialState, action: LibraryActions.LibraryActions) {
	switch (action.type) {
		case LibraryActions.GET_LIBRARY_DATA_REQUEST:
			return {
				...state,
				library: {
					data: [],
					draw: +1,
					recordsFiltered: 0,
					recordsTotal: 0
				},
				count: 0,
				loading: true
			}
		case LibraryActions.GET_LIBRARY_DATA_ERROR:
			return {
				...state,
				loading: false,
				error: action.payload
			}
		case LibraryActions.SET_LIBRARY_DATA:
			return {
				...state,
				library: {
					data: action.payload.data,
					draw: action.payload.draw,
					recordsFiltered: action.payload.recordsFiltered,
					recordsTotal: action.payload.recordsTotal
				},
				count: action.payload.recordsFiltered,
				loading: false
			}
		default: return state
	}
}
