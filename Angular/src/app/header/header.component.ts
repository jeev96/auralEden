import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	constructor() { }

	ngOnInit() {

	// 	$('[data-bg-image]').each(function () {
	// 		var img = $(this).data('bg-image');
	// 		$(this).css({
	// 			backgroundImage: 'url(' + img + ')',
	// 		});
	// 	});

	// 	//Parallax Background
	// 	$('[data-parallax="image"]').each(function () {

	// 		var actualHeight = $(this).position().top;
	// 		var speed = $(this).data('parallax-speed');
	// 		var reSize = actualHeight - $(window).scrollTop();
	// 		var makeParallax = -(reSize / 2);
	// 		var posValue = makeParallax + "px";

	// 		$(this).css({
	// 			backgroundPosition: '50% ' + posValue,
	// 		});
	// 	});
	// },
	}

}
