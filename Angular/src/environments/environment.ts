// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const APPLICATION_LOCAL_IP = "192.168.1.10";
const APPLICATION_LOCAL_PORT = 3000;
const APPLICATION_SEARCH_PORT = 40998;

export const environment = {
	production: false,

	// socket
	socketUrl: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}`,

	// settings
	setMediaLocationUrl: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/settings`,

	// library
	getLibraryData: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/library`,
	uploadUrl: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/library/upload`,

	// player
	albumArtUrl: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/song/albumArt/`,
	streamUrl: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/song/stream/`,

	// auth
	authAuthenticate: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/auth/authenticate`,
	authSignup: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/auth/signup`,
	authLogin: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/auth/signin`,
	authLogoutAll: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/auth/alogout-all`,

	// devices
	changeDeviceStatus: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/devices/change-status`,
	getOnlineDevices: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/devices/online`,

	// file sharing
	shareContent: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/share/share-content`,
	downloadContent: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/share/download-content`,
	stopTorrent: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/share/stop-torrent`,
	allTorrents: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/share/all-torrents`,

	// search and stream
	search: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_SEARCH_PORT}/api/search`,
	globalSearchData: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_SEARCH_PORT}/api/search/data/`,
	globalStream: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_SEARCH_PORT}/api/stream/`,
	globalDownload: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_SEARCH_PORT}/api/stream/download/`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
