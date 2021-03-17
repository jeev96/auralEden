import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class PlayerService {

	constructor(@Inject(DOCUMENT) private document: HTMLDocument) { }

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
}
