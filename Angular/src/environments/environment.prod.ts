const APPLICATION_LOCAL_IP = "192.168.1.10";
const APPLICATION_LOCAL_PORT = 3000;
const APPLICATION_SEARCH_PORT = 40998;

export const environment = {
	production: true,
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

	// sharing
	shareContent: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/share/share-content`,
	downloadContent: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/share/download-content`,
	stopTorrent: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/share/stop-torrent`,
	allTorrents: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_LOCAL_PORT}/api/share/all-torrents`,

	// search
	search: `http://${APPLICATION_LOCAL_IP}:${APPLICATION_SEARCH_PORT}/api/search`,
};
