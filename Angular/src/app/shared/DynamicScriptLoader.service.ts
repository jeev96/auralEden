
import { Injectable } from '@angular/core';

interface Scripts {
	name: string;
	src: string;
}

export const ScriptStore: Scripts[] = [
	{ name: "jquery", src: "../../assets/dependencies/jquery/jquery.min.js" },
	{ name: "jquery-ui", src: "../../assets/dependencies/jquery-ui/jquery-ui.min.js" },
	{ name: "bootstrap", src: "../../assets/dependencies/bootstrap/js/bootstrap.min.js" },
	{ name: "swiper", src: "../../assets/dependencies/swiper/js/swiper.min.js" },
	{ name: "swiperRunner", src: "../../assets/dependencies/swiperRunner/swiperRunner.min.js" },
	{ name: "wow", src: "../../assets/dependencies/wow/js/wow.min.js" },
	{ name: "jquery-countdown", src: "../../assets/dependencies/jquery.countdown/jquery.countdown.min.js" },
	{ name: "magnific-popup", src: "../../assets/dependencies/magnific-popup/js/jquery.magnific-popup.min.js" },
	{ name: "spinner", src: "../../assets/dependencies/jquery.spinner/js/jquery.spinner.js" },
	{ name: "isotope", src: "../../assets/dependencies/isotope-layout/isotope.pkgd.min.js" },
	{ name: "masonry", src: "../../assets/dependencies/masonry-layout/masonry.pkgd.min.js" },
	{ name: "imagesloaded", src: "../../assets/dependencies/imagesloaded/imagesloaded.pkgd.min.js" },
	{ name: "slick-carousel", src: "../../assets/dependencies/slick-carousel/js/slick.min.js" },
	{ name: "headroom", src: "../../assets/assets/js/headroom.js" },
	{ name: "soundmanager2", src: "../../assets/assets/js/soundmanager2.js" },
	{ name: "mp3-player-button", src: "../../assets/assets/js/mp3-player-button.js" },
	{ name: "smoke", src: "../../assets/assets/js/smoke.js" },
	{ name: "fittext", src: "../../assets/dependencies/FitText.js/js/jquery.fittext.js" },
	{ name: "gmap3", src: "../../assets/dependencies/gmap3/js/gmap3.min.js" },
	{ name: "jplayer", src: "../../assets/dependencies/jPlayer/js/jquery.jplayer.min.js" },
	{ name: "playlist", src: "../../assets/dependencies/jPlayer/js/jplayer.playlist.min.js" },
	{ name: "myplaylist", src: "../../assets/assets/js/myplaylist.js" },
	{ name: "colornip", src: "../../assets/dependencies/colornip/colornip.min.js" },
	{ name: "app", src: "../../assets/assets/js/app.js" }
];

declare var document: any;

@Injectable({ providedIn: "root" })
export class DynamicScriptLoaderService {

	private scripts: any = {};

	constructor() {
		ScriptStore.forEach((script: any) => {
			this.scripts[script.name] = {
				loaded: false,
				src: script.src
			};
		});
	}

	load(...scripts: [string]) {
		const promises: any[] = [];
		scripts.forEach((script) => promises.push(this.loadScript(script)));
		return Promise.all(promises);
	}

	loadAll() {
		// this.load(...ScriptStore.map((script) => {
		// 	return script.name;
		// }))
	}

	loadScript(name: string) {
		return new Promise((resolve, reject) => {
			if (!this.scripts[name].loaded) {
				//load script
				let script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = this.scripts[name].src;
				if (script.readyState) {  //IE
					script.onreadystatechange = () => {
						if (script.readyState === "loaded" || script.readyState === "complete") {
							script.onreadystatechange = null;
							this.scripts[name].loaded = true;
							resolve({ script: name, loaded: true, status: 'Loaded' });
						}
					};
				} else {  //Others
					script.onload = () => {
						this.scripts[name].loaded = true;
						resolve({ script: name, loaded: true, status: 'Loaded' });
					};
				}
				script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
				document.getElementsByTagName('head')[0].appendChild(script);
			} else {
				resolve({ script: name, loaded: true, status: 'Already Loaded' });
			}
		});
	}

}
