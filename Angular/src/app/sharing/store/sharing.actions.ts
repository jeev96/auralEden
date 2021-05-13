import { Action } from "@ngrx/store";
import { TorrentData } from "src/app/models/TorrentData.model";

export const START_SHARING_REQUEST = "[SHARING] START SHARING REQUEST";
export const START_SHARING = "[SHARING] START SHARING";

export const START_DOWNLOAD_REQUEST = "[SHARING] START DOWNLOAD REQUEST";
export const START_DOWNLOAD = "[SHARING] START DOWNLOAD";

export const STOP_TORRENT_REQUEST = "[SHARING] STOP TORRENT REQUEST";
export const STOP_TORRENT = "[SHARING] STOP TORRENT";

export const SHARING_REQUEST_ERROR = "[SHARING] SHARING REQUEST ERROR";
export const DOWNLOAD_REQUEST_ERROR = "[SHARING] DOWNLOAD REQUEST ERROR";

export const ALL_TORRENTS_REQUEST = "[SHARING] ALL TORRENTS REQUEST";
export const ALL_TORRENTS = "[SHARING] ALL TORRENTS";

export const TORRENT_STATS_REQUEST = "[SHARING] TORRENT STATS REQUEST";
export const TORRENT_STATS = "[SHARING] TORRENT STATS";

export class StartSharingRequest implements Action {
	readonly type = START_SHARING_REQUEST;

	constructor(public payload: string) { }
}
export class StartSharing implements Action {
	readonly type = START_SHARING;

	constructor(public payload: TorrentData) { }
}

export class StartDownloadRequest implements Action {
	readonly type = START_DOWNLOAD_REQUEST;

	constructor(public payload: { encryptedString: string, location: string }) { }
}
export class StartDownload implements Action {
	readonly type = START_DOWNLOAD;

	constructor(public payload: TorrentData) { }
}

export class StopTorrentRequest implements Action {
	readonly type = STOP_TORRENT_REQUEST;
	constructor(public payload: { torrentId: string, isUpload: boolean }) { }
}
export class StopTorrent implements Action {
	readonly type = STOP_TORRENT;
	constructor(public payload: { torrentId: string, isUpload: boolean }) { }
}

export class SharingRequestError implements Action {
	readonly type = SHARING_REQUEST_ERROR;
	constructor(public payload: string) { }
}
export class DownloadRequestError implements Action {
	readonly type = DOWNLOAD_REQUEST_ERROR;
	constructor(public payload: string) { }
}

export class AllTorrentsRequest implements Action {
	readonly type = ALL_TORRENTS_REQUEST;
}
export class AllTorrents implements Action {
	readonly type = ALL_TORRENTS;
	constructor(public payload: { downloading: any, uploading: any }) { }
}

export class TorrentStatsRequest implements Action {
	readonly type = TORRENT_STATS_REQUEST;
}
export class TorrentStats implements Action {
	readonly type = TORRENT_STATS;
	constructor(public payload: { downloading: any, uploading: any }) { }
}

export type SharingActions = StartSharingRequest
	| StartSharing
	| StartDownloadRequest
	| StartDownload
	| StopTorrentRequest
	| StopTorrent
	| SharingRequestError
	| DownloadRequestError
	| AllTorrentsRequest
	| AllTorrents
	| TorrentStatsRequest
	| TorrentStats;
