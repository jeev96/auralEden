export class User {
	constructor(
		public id: string,
		public deviceId: string,
		public username: string,
		private _token: string,
		private _tokenExpirationDate: Date,
		public devices?: [{
			_id: string,
			name: string,
			type: string,
			active: boolean,
			online: boolean
		}]
	) { }

	get token() {
		if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
			return null;
		}
		return this._token;
	}
}
