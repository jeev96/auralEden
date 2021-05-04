// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,

	// socket
	socketUrl: "http://192.168.1.10:3000",

	// settings
	setMediaLocationUrl: "http://192.168.1.10:3000/api/settings",

	// library
	getLibraryDataURL: "http://192.168.1.10:3000/api/library",
	uploadUrl: "http://192.168.1.10:3000/api/library/upload",

	// player
	albumArtUrl: "http://192.168.1.10:3000/api/song/albumArt/",
	streamUrl: "http://192.168.1.10:3000/api/song/stream/",

	// auth
	authAuthenticate: "http://192.168.1.10:3000/api/auth/authenticate",
	authSignup: "http://192.168.1.10:3000/api/auth/signup",
	authLogin: "http://192.168.1.10:3000/api/auth/signin",
	authLogoutAll: "http://192.168.1.10:3000/api/auth/alogout-all",

	// devices
	changeDeviceStatus: "http://192.168.1.10:3000/api/devices/change-status",
	getOnlineDevices: "http://192.168.1.10:3000/api/devices/online",

	// sharing
	shareContent: "http://192.168.1.10:3000/api/share/share-content",
	downloadContent: "http://192.168.1.10:3000/api/share/download-content",
	stopTorrent: "http://192.168.1.10:3000/api/share/stop-torrent",
	getTorrentStats: "http://192.168.1.10:3000/api/share/stats",
	allTorrents: "http://192.168.1.10:3000/api/share/all-torrents",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
