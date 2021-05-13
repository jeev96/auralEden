import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class PlayerService {

	constructor(@Inject(DOCUMENT) private document: HTMLDocument, private http: HttpClient) { }

	removeAudioElemetSource() {
		try {
			let audioElement = this.document.getElementsByTagName('audio')[0];
			if (audioElement.src) {
				audioElement.removeAttribute("src");
				audioElement.load();
			}
			return
		} catch (error) {
			throw (error)
		}
	}

	getCurrentTime() {
		let audioElement = this.document.getElementsByTagName('audio')[0];
		return audioElement.currentTime;
	}

	pauseAudioElementSource() {
		let audioElement = this.document.getElementsByTagName('audio')[0];
		audioElement.pause();
	}

	playAudioElementSource() {
		let audioElement = this.document.getElementsByTagName('audio')[0];
		audioElement.play();
	}

	changeAudioElementVolume(value: number) {
		let audioElement = this.document.getElementsByTagName('audio')[0];
		audioElement.volume = value;
	}

	seekAudioElement(value: number) {
		let audioElement = this.document.getElementsByTagName('audio')[0];
		audioElement.currentTime = value;
	}

	setAudioElementSource(source) {
		try {
			this.removeAudioElemetSource();
			let audioElement = this.document.getElementsByTagName('audio')[0];
			audioElement.src = source;
			audioElement.load();
			return;
		} catch (error) {
			throw (error);
		}
	}

	downloadSong(song, title = "download") {
		const downloadUrl = song.address ? environment.globalStream(song.address.ip, song.address.port) : environment.streamUrl;
		return this.http.get(downloadUrl + song._id, {
			responseType: "blob",
		}).pipe(map(res => {
			return {
				filename: title,
				data: res
			};
		})).subscribe(res => {
			let url = window.URL.createObjectURL(res.data);
			let a = document.createElement('a');
			document.body.appendChild(a);
			a.setAttribute('style', 'display: none');
			a.href = url;
			a.download = res.filename;
			a.click();
			window.URL.revokeObjectURL(url);
			a.remove();
		});
	}
}
