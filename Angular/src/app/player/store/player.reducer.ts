import * as PlayerActions from "./player.actions";

export interface State {
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
}

const initialState: State = {
	playlist: [],
	currentSong: null,
	duration: 100,
	timeElapsed: 0,
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
				timeElapsed: 0,
				playing: false,
				paused: false,
				stopped: true,
				loading: true,
			}
		case PlayerActions.GET_PLAYER_SONG_ERROR:
			return {
				...state,
				currentSong: null,
				timeElapsed: 0,
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
				duration: +action.payload.format.duration.$numberDecimal,
				playing: true,
				paused: false,
				stopped: false,
				loading: false,
			}
		case PlayerActions.CLEAR_PLAYER_PLAYLIST:
			return {
				...state,
				playlist: [],
				timeElapsed: 0,
				currentSong: null,
				playing: false,
				paused: false,
				stopped: true,
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
					return song[0] !== action.payload;
				})
			}
		case PlayerActions.CLEAR_PLAYER:
			return {
				...state,
				playlist: [],
				audioStream: null,
				currentSong: null,
				duration: 100,
				timeElapsed: 0,
				volume: 1,
				playing: false,
				paused: false,
				stopped: true,
				loading: false,
				error: null
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
				timeElapsed: 0
			}
		case PlayerActions.CHANGE_VOLUME:
			return {
				...state,
				volume: action.payload
			}
		case PlayerActions.SEEK_TRACK:
			return {
				...state,
				timeElapsed: action.payload,
			}
		case PlayerActions.NOOP_ACTION:
		default: return state
	}
}
