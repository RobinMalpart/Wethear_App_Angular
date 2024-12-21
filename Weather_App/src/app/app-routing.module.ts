import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LocationComponent } from './pages/location/location.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { HistoryComponent } from './pages/history/history.component';

const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'reload',
  scrollPositionRestoration: 'enabled',
};

const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'location', component: LocationComponent },
  { path: 'favorites', component: FavoriteComponent },
  { path: 'history', component: HistoryComponent },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}