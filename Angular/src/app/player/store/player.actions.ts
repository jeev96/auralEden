import { Action } from "@ngrx/store";

// misc
export const CLEAR_PLAYER_REQUEST = "[PLAYER] CLEAR PLAYER REQUEST";
export const CLEAR_PLAYER = "[PLAYER] CLEAR PLAYER";
export const REMOTE_COMMAND = "[PLAYER] REMOTE COMMAND";
export const PLAYER_ERROR = "[PLAYER] PLAYER ERROR";

// set all player data
export const PLAYER_DATA = "[PLAYER] PLAYER DATA";
export const PLAYER_REMOTE_DATA = "[PLAYER] PLAYER REMOTE DATA";

// current song
export const CURRENT_SONG_REQUEST = "[PLAYER] CURRENT SONG REQUEST";
export const CURRENT_SONG = "[PLAYER] CURRENT SONG";

// playlist
export const ADD_PLAYLIST_SONG_REQUEST = "[PLAYER] ADD PLAYLIST SONG REQUEST";
export const ADD_PLAYLIST_SONG = "[PLAYER] ADD PLAYLIST SONG";
export const DELETE_PLAYLIST_SONG_REQUEST = "[PLAYER] DELETE PLAYLIST SONG REQUEST";
export const DELETE_PLAYLIST_SONG = "[PLAYER] DELETE PLAYLIST SONG";
export const CLEAR_PLAYLIST = "[PLAYER] CLEAR PLAYLIST";

// player controls
export const PLAY_SONG_REQUEST = "[PLAYER] PLAY SONG REQUEST";
export const PLAY_SONG = "[PLAYER] PLAY SONG";
export const PLAY_NEXT_SONG_REQUEST = "[PLAYER] PLAY NEXT SONG REQUEST";
export const PLAY_PREVIOUS_SONG_REQUEST = "[PLAYER] PLAY PREVIOUS SONG REQUEST";
export const PAUSE_SONG_REQUEST = "[PLAYER] PAUSE SONG REQUEST";
export const PAUSE_SONG = "[PLAYER] PAUSE SONG";
export const STOP_SONG_REQUEST = "[PLAYER] STOP SONG REQUEST";
export const STOP_SONG = "[PLAYER] STOP SONG";
export const CHANGE_VOLUME_REQUEST = "[PLAYER] CHANGE VOLUME REQUEST"
export const CHANGE_VOLUME = "[PLAYER] CHANGE VOLUME"
export const SEEK_TRACK_REQUEST = "[PLAYER] CHANGE SEEK TRACK REQUEST"
export const SEEK_TRACK = "[PLAYER] CHANGE SEEK TRACK"

// Do nothing
export const NOOP_ACTION = "[PLAYER] NOOP ACTION";

// misc
export class ClearPlayerRequest implements Action {
	readonly type = CLEAR_PLAYER_REQUEST;
}
export class ClearPlayer implements Action {
	readonly type = CLEAR_PLAYER;
}
export class RemoteCommand implements Action {
	readonly type = REMOTE_COMMAND;
	constructor(public payload: { command: string, data: any }) { }
}
export class PlayerError implements Action {
	readonly type = PLAYER_ERROR;

	constructor(public payload: string) { }
}

// set all player data
export class PlayerData implements Action {
	readonly type = PLAYER_DATA;
	constructor(public payload: {
		playlist: any[],
		currentSong: any,
		duration: number | undefined,
		timeElapsed: number | undefined,
		volume: number,
		playing: boolean,
		paused: boolean,
		stopped: boolean,
		loading: boolean,
		error: string
	}) { }
}
export class PlayerRemoteData implements Action {
	readonly type = PLAYER_REMOTE_DATA;
	constructor(public payload: {
		playlist: any[],
		currentSong: any,
		duration: number | undefined,
		timeElapsed: number | undefined,
		volume: number,
		playing: boolean,
		paused: boolean,
		stopped: boolean,
		loading: boolean,
		error: string
	}) { }
}

// current song
export class CurrentSongRequest implements Action {
	readonly type = CURRENT_SONG_REQUEST;
	constructor(public payload: string) { }
}
export class CurrentSong implements Action {
	readonly type = CURRENT_SONG;

	constructor(public payload: any) { }
}


// playlist
export class AddPlaylistSongRequest implements Action {
	readonly type = ADD_PLAYLIST_SONG_REQUEST;

	constructor(public payload: (string | number)[]) { }
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
export class ClearPlayerPlaylist implements Action {
	readonly type = CLEAR_PLAYLIST;
}

// player controls
export class PlaySongRequest implements Action {
	readonly type = PLAY_SONG_REQUEST;
	constructor(public payload?: string) { }
}
export class PlaySong implements Action {
	readonly type = PLAY_SONG;
}
export class PlayNextSongRequest implements Action {
	readonly type = PLAY_NEXT_SONG_REQUEST;
}
export class PlayPreviousSongRequest implements Action {
	readonly type = PLAY_PREVIOUS_SONG_REQUEST;
}
export class PauseSongRequest implements Action {
	readonly type = PAUSE_SONG_REQUEST;
}
export class PauseSong implements Action {
	readonly type = PAUSE_SONG;
}
export class StopSongRequest implements Action {
	readonly type = STOP_SONG_REQUEST;
}
export class StopSong implements Action {
	readonly type = STOP_SONG;
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

// Do nothing
export class NoopAction implements Action {
	readonly type = NOOP_ACTION;
}

export type PlayerActions = ClearPlayer
	| PlayerData
	| PlayerRemoteData
	| RemoteCommand
	| PlayerError
	| CurrentSongRequest
	| CurrentSong
	| AddPlaylistSong
	| DeletePlaylistSong
	| ClearPlayerPlaylist
	| PlaySong
	| PlayPreviousSongRequest
	| PlayNextSongRequest
	| PauseSong
	| StopSong
	| ChangeVolume
	| SeekTrack
	| NoopAction;
