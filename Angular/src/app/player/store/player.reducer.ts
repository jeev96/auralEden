import * as PlayerActions from "./player.actions";

export interface State {
	playlist: any[],
	currentSong: any,
	duration: number | undefined,
	currentTime: number | undefined,
	volume: number,
	playing: boolean,
	paused: boolean,
	stopped: boolean,
	loading: boolean,
	error: string
}

const initialState: State = {
	playlist: [],
	currentSong: null,
	duration: null,
	currentTime: null,
	volume: 1,
	playing: false,
	paused: false,
	stopped: true,
	loading: false,
	error: null
}

export function playerReducer(state = initialState, action: PlayerActions.PlayerActions) {
	switch (action.type) {
		case PlayerActions.GET_PLAYER_SONG_REQUEST:
			return {
				...state,
				currentSong: null,
				playing: false,
				paused: false,
				stopped: true,
				loading: true,
			}
		case PlayerActions.GET_PLAYER_SONG_ERROR:
			return {
				...state,
				currentSong: null,
				playing: false,
				paused: false,
				stopped: true,
				loading: false,
				error: action.payload
			}
		case PlayerActions.SET_CURRENT_SONG_DATA:
			return {
				...state,
				currentSong: action.payload,
				playing: true,
				paused: false,
				stopped: true,
				loading: false,
			}
		case PlayerActions.CLEAR_PLAYER_PLAYLIST:
			return {
				...state,
				playlist: []
			}
		case PlayerActions.ADD_PLAYLIST_SONG:
			return {
				...state,
				playlist: [...state.playlist, action.payload]
			}
		case PlayerActions.DELETE_PLAYLIST_SONG:
			return {
				...state,
				playlist: state.playlist.filter((song) => {
					return song[0] !== action.payload[0];
				})
			}
		case PlayerActions.PLAYER_PLAY_SONG:
			return {
				...state,
				playing: true,
				paused: false,
				stopped: false,
			}
		case PlayerActions.PLAYER_PAUSE_SONG:
			return {
				...state,
				playing: false,
				paused: true,
				stopped: false,
			}
		case PlayerActions.PLAYER_STOP_SONG:
			return {
				...state,
				playing: false,
				paused: false,
				stopped: true,
				currentTime: null
			}
		default: return state
	}
}
