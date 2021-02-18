import { Action } from "@ngrx/store";

export const GET_PLAYER_SONG_REQUEST = "[PLAYER] GET PLAYER SONG REQUEST";
export const GET_PLAYER_SONG_ERROR = "[PLAYER] GET PLAYER SONG ERROR";
export const SET_CURRENT_SONG_DATA = "[PLAYER] SET CURRENT SONG DATA";
export const CLEAR_PLAYER_PLAYLIST = "[PLAYER] CLEAR PLAYER PLAYLIST";
export const ADD_PLAYLIST_SONG = "[PLAYER] ADD PLAYLIST SONG";
export const DELETE_PLAYLIST_SONG = "[PLAYER] DELETE PLAYLIST SONG";
export const CLEAR_PLAYER = "[PLAYER] CLEAR PLAYER";

export const PLAYER_PLAY_SONG_REQUEST = "[PLAYER] PLAYER PLAY SONG REQUEST";
export const PLAYER_PLAY_SONG = "[PLAYER] PLAYER PLAY SONG";

export const PLAYER_PAUSE_SONG_REQUEST = "[PLAYER] PLAYER PAUSE SONG REQUEST";
export const PLAYER_PAUSE_SONG = "[PLAYER] PLAYER PAUSE SONG";

export const PLAYER_STOP_SONG_REQUEST = "[PLAYER] PLAYER STOP SONG REQUEST";
export const PLAYER_STOP_SONG = "[PLAYER] PLAYER STOP SONG";


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
export class AddPlaylistSong implements Action {
	readonly type = ADD_PLAYLIST_SONG;

	constructor(public payload: any) { }
}
export class DeletePlaylistSong implements Action {
	readonly type = DELETE_PLAYLIST_SONG;

	constructor(public payload: any) { }
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

export type PlayerActions = GetPlayerSongRequest
	| GetPlayerSongError
	| SetCurrentSongData
	| ClearPlayerPlaylist
	| AddPlaylistSong
	| DeletePlaylistSong
	| ClearPlayer
	| PlaySong
	| PauseSong
	| StopSong;
