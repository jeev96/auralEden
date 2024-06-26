import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LibraryComponent } from './library/library.component';
import { PlayerComponent } from './player/player.component';
import { SongResolverService } from './player/song-resolver.service';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchComponent } from './search/search.component';
import { SettingsComponent } from './settings/settings.component';
import { SharingResolverService } from './sharing/sharing-resolver.service';
import { SharingComponent } from './sharing/sharing.component';

const routes: Routes = [
	{ path: "", component: HomeComponent, pathMatch: "full" },
	{ path: "login", component: AuthComponent },
	{ path: "signup", component: AuthComponent },
	{ path: "library", component: LibraryComponent },
	{ path: "playlist", component: PlaylistComponent },
	{ path: "search", component: SearchComponent },
	{ path: "sharing", component: SharingComponent, resolve: [SharingResolverService] },
	{ path: "player", component: PlayerComponent, resolve: [SongResolverService] },
	{ path: "settings", component: SettingsComponent, canActivate: [AuthGuard]}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
