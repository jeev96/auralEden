export const environment = {
	production: true,
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
	allTorrents: "http://192.168.1.10:3000/api/share/all-torrents",

};
