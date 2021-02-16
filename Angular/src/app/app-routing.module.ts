import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LibraryComponent } from './library/library.component';
import { PlayerComponent } from './player/player.component';
import { SongResolverService } from './player/song-resolver.service';
import { PlaylistComponent } from './playlist/playlist.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
	{ path: "", component: HomeComponent, pathMatch: "full" },
	{ path: "library", component: LibraryComponent },
	{ path: "playlist", component: PlaylistComponent },
	{ path: "player", component: PlayerComponent, resolve: [SongResolverService] },
	{ path: "settings", component: SettingsComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
