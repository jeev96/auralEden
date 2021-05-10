import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule, HTTP_INTERCEPTORS, } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

import * as fromApp from "./store/app.reducer";
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

import { EffectsModule } from '@ngrx/effects';
import { SettingsEffects } from './settings/store/settings.effects';
import { AuthEffects } from './auth/store/auth.effects';
import { LibraryEffects } from './library/store/library.effects';
import { PlayerEffects } from './player/store/player.effects';
import { SharingEffects } from './sharing/store/sharing.effects';
import { SearchEffects } from './search/store/search.effects';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { LibraryComponent } from './library/library.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlayerComponent } from './player/player.component';
import { PlayerMiniComponent } from './player/player-mini/player-mini.component';
import { SettingsComponent } from './settings/settings.component';
import { SharingComponent } from './sharing/sharing.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

import { DataTablesModule } from 'angular-datatables';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ClipboardModule } from 'ngx-clipboard';
import { SearchComponent } from './search/search.component';

const config: SocketIoConfig = { url: environment.socketUrl, options: {} };

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		HomeComponent,
		LibraryComponent,
		PlaylistComponent,
		PlayerComponent,
		PlayerMiniComponent,
		SettingsComponent,
		SharingComponent,
		LoadingSpinnerComponent,
		AuthComponent,
  SearchComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		SocketIoModule.forRoot(config),
		CommonModule,
		DataTablesModule,
		NgxDropzoneModule,
		ClipboardModule,
		StoreModule.forRoot(fromApp.appReducer),
		EffectsModule.forRoot([AuthEffects, SettingsEffects, LibraryEffects, SharingEffects, SearchEffects, PlayerEffects])
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptorService,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
