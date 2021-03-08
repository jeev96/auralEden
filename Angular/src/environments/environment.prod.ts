export const environment = {
	production: true,
	socketUrl: "http://192.168.1.10:3000",

	setMediaLocationUrl: "http://192.168.1.10:3000/api/settings",

	getLibraryDataURL: "http://192.168.1.10:3000/api/library",
	uploadUrl: "http://192.168.1.10:3000/api/library/upload",

	albumArtUrl: "http://192.168.1.10:3000/api/song/albumArt/",
	streamUrl: "http://192.168.1.10:3000/api/song/stream/",

	authAuthenticate: "http://192.168.1.10:3000/api/auth/authenticate",
	authSignup: "http://192.168.1.10:3000/api/auth/signup",
	authLogin: "http://192.168.1.10:3000/api/auth/signin",
	authLogoutAll: "http://192.168.1.10:3000/api/auth/alogout-all",

	changeDeviceStatus: "http://192.168.1.10:3000/api/devices/change-status",
	getOnlineDevices: "http://192.168.1.10:3000/api/devices/online",
};
