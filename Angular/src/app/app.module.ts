import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule, HTTP_INTERCEPTORS, } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { LibraryComponent } from './library/library.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlayerComponent } from './player/player.component';
import { PlayerMiniComponent } from './player/player-mini/player-mini.component';
import { SettingsComponent } from './settings/settings.component';
import * as fromApp from "./store/app.reducer";
import { SettingsEffects } from './settings/store/settings.effects';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { LibraryEffects } from './library/store/library.effects';
import { PlayerEffects } from './player/store/player.effects';
import { DataTablesModule } from 'angular-datatables';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AuthComponent } from './auth/auth.component';
import { AuthEffects } from './auth/store/auth.effects';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.socketUrl, options: {} };

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		HomeComponent,
		FooterComponent,
		LibraryComponent,
		PlaylistComponent,
		PlayerComponent,
		PlayerMiniComponent,
		SettingsComponent,
		LoadingSpinnerComponent,
		AuthComponent
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
		StoreModule.forRoot(fromApp.appReducer),
		EffectsModule.forRoot([AuthEffects, SettingsEffects, LibraryEffects, PlayerEffects])
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
