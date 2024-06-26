import { ActionReducerMap } from "@ngrx/store";

import * as fromAuth from "../auth/store/auth.reducer";
import * as fromSettings from "../settings/store/settings.reducer";
import * as fromLibrary from "../library/store/library.reducer";
import * as fromSharing from "../sharing/store/sharing.reducer";
import * as fromSearch from "../search/store/search.reducer";
import * as fromPlayer from "../player/store/player.reducer";

export interface AppState {
	auth: fromAuth.State,
	settings: fromSettings.State,
	library: fromLibrary.State,
	sharing: fromSharing.State,
	search: fromSearch.State
	player: fromPlayer.State
}

export const appReducer: ActionReducerMap<AppState> = {
	auth: fromAuth.authReducer,
	settings: fromSettings.settingsReducer,
	library: fromLibrary.libraryReducer,
	sharing: fromSharing.sharingReducer,
	search: fromSearch.searchReducer,
	player: fromPlayer.playerReducer
}
