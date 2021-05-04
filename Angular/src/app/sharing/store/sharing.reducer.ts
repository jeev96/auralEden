import * as SharingActions from "./sharing.actions";

interface TorrentData {
	name: string,
	torrentId: string,
	downloaded: string,
	uploaded: string,
	upSpeed: string,
	downSpeed: string,
	completed: string,
	size: string,
	shareString: string,
}

export interface State {
	shareLoading: boolean,
	shareData: any,
	isSharing: boolean,
	shareError: string,
	downloadLoading: boolean,
	downloadData: any,
	isDownloading: boolean,
	downloadError: string,
}

const initialState: State = {
	shareLoading: false,
	shareData: [],
	isSharing: false,
	shareError: null,
	downloadLoading: false,
	downloadData: [],
	isDownloading: false,
	downloadError: null
}

export function sharingReducer(state = initialState, action: SharingActions.SharingActions) {
	switch (action.type) {
		case SharingActions.START_SHARING_REQUEST:
			return {
				...state,
				shareLoading: true,
				isSharing: false,
				shareError: null
			}
		case SharingActions.START_SHARING:
			return {
				...state,
				shareLoading: false,
				isSharing: true,
				shareData: [...state.shareData, action.payload],
				shareError: null
			}
		case SharingActions.SHARING_REQUEST_ERROR:
			return {
				...state,
				shareLoading: false,
				isSharing: false,
				shareError: action.payload,
			}
		case SharingActions.START_DOWNLOAD_REQUEST:
			return {
				...state,
				downloadLoading: true,
				isDownloading: false,
				downloadError: null
			}
		case SharingActions.START_DOWNLOAD:
			return {
				...state,
				downloadLoading: false,
				isDownloading: true,
				downloadData: [...state.downloadData, action.payload],
				downloadError: null
			}
		case SharingActions.STOP_TORRENT:
			return {
				...state,
				downloadLoading: false,
				downloadData: !action.payload.isUpload ? state.downloadData.filter((downloadData) => {
					return downloadData.torrentId !== action.payload.torrentId;
				}) : state.downloadData,
				shareData: action.payload.isUpload ? state.shareData.filter((shareData) => {
					return shareData.torrentId !== action.payload.torrentId;
				}) : state.shareData,
				downloadError: null
			}
		case SharingActions.DOWNLOAD_REQUEST_ERROR:
			return {
				...state,
				downloadLoading: false,
				isDownloading: false,
				downloadError: action.payload,
			}

		case SharingActions.ALL_TORRENTS_REQUEST:
			return {
				...state,
				shareLoading: true,
				shareData: [],
				isSharing: false,
				shareError: null,
				downloadLoading: true,
				downloadData: [],
				isDownloading: false,
				downloadError: null
			}
		case SharingActions.ALL_TORRENTS:
			return {
				...state,
				shareLoading: false,
				shareData: action.payload.uploading,
				isSharing: false,
				downloadLoading: false,
				downloadData: action.payload.downloading,
				isDownloading: false,
			}
		case SharingActions.TORRENT_STATS:
			return {
				...state,
				shareData: action.payload.isUpload ? action.payload.torrentData : state.shareData,
				downloadData: !action.payload.isUpload ? action.payload.torrentData : state.downloadData
			}

		default: return state
	}
}
