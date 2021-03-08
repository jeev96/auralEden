import { ActionReducerMap } from "@ngrx/store";

import * as fromAuth from "../auth/store/auth.reducer";
import * as fromSettings from "../settings/store/settings.reducer";
import * as fromLibrary from "../library/store/library.reducer";
import * as fromPlayer from "../player/store/player.reducer";

export interface AppState {
	auth: fromAuth.State,
	settings: fromSettings.State,
	library: fromLibrary.State,
	player: fromPlayer.State
}

export const appReducer: ActionReducerMap<AppState> = {
	auth: fromAuth.authReducer,
	settings: fromSettings.settingsReducer,
	library: fromLibrary.libraryReducer,
	player: fromPlayer.playerReducer
}
