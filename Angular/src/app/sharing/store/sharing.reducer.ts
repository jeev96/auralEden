import * as SharingActions from "./sharing.actions";

export interface State {
	shareLoading: boolean,
	shareString: string,
	isSharing: boolean,
	shareError: string,
	downloadLoading: boolean,
	downloadString: string,
	isDownloading: boolean,
	downloadError: string,
}

const initialState: State = {
	shareLoading: false,
	shareString: null,
	isSharing: false,
	shareError: null,
	downloadLoading: false,
	downloadString: null,
	isDownloading: false,
	downloadError: null
}

export function sharingReducer(state = initialState, action: SharingActions.SharingActions) {
	switch (action.type) {
		case SharingActions.SHARING_STRING_REQUEST:
			return {
				...state,
				shareLoading: true,
				isSharing: false,
				shareString: null,
				shareError: null
			}
		case SharingActions.SHARING_STRING:
			return {
				...state,
				shareLoading: false,
				isSharing: true,
				shareString: action.payload,
				shareError: null
			}
		case SharingActions.SHARING_REQUEST_ERROR:
			return {
				...state,
				shareLoading: false,
				isSharing: false,
				shareString: null,
				shareError: action.payload,
			}
		case SharingActions.DOWNLOAD_STRING_REQUEST:
			return {
				...state,
				downloadLoading: true,
				isDownloading: false,
				downloadError: null
			}
		case SharingActions.DOWNLOAD_STRING:
			return {
				...state,
				downloadLoading: false,
				isDownloading: true,
				downloadError: null
			}
		case SharingActions.DOWNLOAD_REQUEST_ERROR:
			return {
				...state,
				downloadLoading: false,
				isDownloading: false,
				downloadError: action.payload,
			}
		default: return state
	}
}
