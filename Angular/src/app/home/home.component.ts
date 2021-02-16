import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from '../shared/DynamicScriptLoader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private dynamicScriptLoader: DynamicScriptLoaderService) { }

  ngOnInit(): void {
	//   this.dynamicScriptLoader.loadAll();
  }

}
