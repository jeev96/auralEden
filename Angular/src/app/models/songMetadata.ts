export class SongMetadata {
	constructor(
		public name: string,
		public common: Common,
		public format: Format,
		public location: string
	) { }
}

class Common {
	constructor(
		public track: any,
		public disk: any,
		public movementIndex: any,
		public copyright: string,
		public comment: string[],
		public encodedby: string,
		public title: string,
		public year: number,
		public label: string[],
		public genre: string[],
		public album: string,
		public albumartist: string,
		public composer: string[],
		public originalartist: string,
		public artists: string[],
		public artist: string
	) { }
}

class Format {
	constructor(
		public tagTypes: string[],
		public trackInfo: any,
		public lossless: boolean,
		public container: string,
		public codec: string,
		public sampleRate: number,
		public numberOfChannels: number,
		public bitrate: number,
		public tool: string,
		public trackGain: number,
		public duration: number,
		public codecProfile: string
	) { }
}

