import { Action } from "@ngrx/store";

export const CLEAR_PLAYER_REQUEST = "[PLAYER] CLEAR PLAYER REQUEST";
export const CLEAR_PLAYER = "[PLAYER] CLEAR PLAYER";

export const GET_PLAYER_SONG_REQUEST = "[PLAYER] GET PLAYER SONG REQUEST";
export const SET_CURRENT_SONG_DATA = "[PLAYER] SET CURRENT SONG DATA";
export const GET_PLAYER_SONG_ERROR = "[PLAYER] GET PLAYER SONG ERROR";

export const ADD_PLAYLIST_SONG_REQUEST = "[PLAYER] ADD PLAYLIST SONG REQUEST";
export const ADD_PLAYLIST_SONG = "[PLAYER] ADD PLAYLIST SONG";
export const DELETE_PLAYLIST_SONG_REQUEST = "[PLAYER] DELETE PLAYLIST SONG REQUEST";
export const DELETE_PLAYLIST_SONG = "[PLAYER] DELETE PLAYLIST SONG";

export const CLEAR_PLAYER_PLAYLIST = "[PLAYER] CLEAR PLAYER PLAYLIST";

export const PLAYER_PLAY_SONG_REQUEST = "[PLAYER] PLAYER PLAY SONG REQUEST";
export const PLAYER_PLAY_SONG = "[PLAYER] PLAYER PLAY SONG";

export const PLAYER_PLAY_NEXT_SONG_REQUEST = "[PLAYER] PLAYER PLAY NEXT SONG REQUEST";
export const PLAYER_PLAY_PREVIOUS_SONG_REQUEST = "[PLAYER] PLAYER PLAY PREVIOUS SONG REQUEST";

export const PLAYER_PAUSE_SONG_REQUEST = "[PLAYER] PLAYER PAUSE SONG REQUEST";
export const PLAYER_PAUSE_SONG = "[PLAYER] PLAYER PAUSE SONG";

export const PLAYER_STOP_SONG_REQUEST = "[PLAYER] PLAYER STOP SONG REQUEST";
export const PLAYER_STOP_SONG = "[PLAYER] PLAYER STOP SONG";

export const CHANGE_VOLUME_REQUEST = "[PLAYER] CHANGE VOLUME REQUEST"
export const CHANGE_VOLUME = "[PLAYER] CHANGE VOLUME"

export const SEEK_TRACK_REQUEST = "[PLAYER] CHANGE SEEK TRACK REQUEST"
export const SEEK_TRACK = "[PLAYER] CHANGE SEEK TRACK"

export const NOOP_ACTION = "[PLAYER] NOOP ACTION";


export class GetPlayerSongRequest implements Action {
	readonly type = GET_PLAYER_SONG_REQUEST;
	constructor(public payload: string) { }
}
export class GetPlayerSongError implements Action {
	readonly type = GET_PLAYER_SONG_ERROR;

	constructor(public payload: string) { }
} export class SetCurrentSongData implements Action {
	readonly type = SET_CURRENT_SONG_DATA;

	constructor(public payload: any) { }
}

export class ClearPlayerPlaylist implements Action {
	readonly type = CLEAR_PLAYER_PLAYLIST;
}

export class AddPlaylistSongRequest implements Action {
	readonly type = ADD_PLAYLIST_SONG_REQUEST;

	constructor(public payload: any) { }
}
export class AddPlaylistSong implements Action {
	readonly type = ADD_PLAYLIST_SONG;

	constructor(public payload: any) { }
}

export class DeletePlaylistSongRequest implements Action {
	readonly type = DELETE_PLAYLIST_SONG_REQUEST;
	constructor(public payload: any) { }
}
export class DeletePlaylistSong implements Action {
	readonly type = DELETE_PLAYLIST_SONG;

	constructor(public payload: any) { }
}

export class ClearPlayerRequest implements Action {
	readonly type = CLEAR_PLAYER_REQUEST;
}
export class ClearPlayer implements Action {
	readonly type = CLEAR_PLAYER;
}

export class PlaySongRequest implements Action {
	readonly type = PLAYER_PLAY_SONG_REQUEST;
	constructor(public payload: any) { }
}
export class PlaySong implements Action {
	readonly type = PLAYER_PLAY_SONG;
}

export class PlayNextSongRequest implements Action {
	readonly type = PLAYER_PLAY_NEXT_SONG_REQUEST;
}
export class PlayPreviousSongRequest implements Action {
	readonly type = PLAYER_PLAY_PREVIOUS_SONG_REQUEST;
}

export class PauseSongRequest implements Action {
	readonly type = PLAYER_PAUSE_SONG_REQUEST;
}
export class PauseSong implements Action {
	readonly type = PLAYER_PAUSE_SONG;
}

export class StopSongRequest implements Action {
	readonly type = PLAYER_STOP_SONG_REQUEST;
}
export class StopSong implements Action {
	readonly type = PLAYER_STOP_SONG;
}

export class ChangeVolumeRequest implements Action {
	readonly type = CHANGE_VOLUME_REQUEST;
	constructor(public payload: number) { }
}
export class ChangeVolume implements Action {
	readonly type = CHANGE_VOLUME;
	constructor(public payload: number) { }
}

export class SeekTrackRequest implements Action {
	readonly type = SEEK_TRACK_REQUEST;
	constructor(public payload: { timeElapsed: number, manualEntry: boolean }) { }
}
export class SeekTrack implements Action {
	readonly type = SEEK_TRACK;
	constructor(public payload: number) { }
}

export class NoopAction implements Action {
	readonly type = NOOP_ACTION;
}

export type PlayerActions = GetPlayerSongRequest
	| GetPlayerSongError
	| SetCurrentSongData
	| ClearPlayerPlaylist
	| AddPlaylistSong
	| DeletePlaylistSong
	| ClearPlayer
	| PlaySong
	| PlayPreviousSongRequest
	| PlayNextSongRequest
	| PauseSong
	| StopSong
	| ChangeVolume
	| SeekTrack
	| NoopAction;
