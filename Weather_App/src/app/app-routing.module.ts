import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LocationComponent } from './pages/location/location.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { HistoryComponent } from './pages/history/history.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProtectedComponent } from './pages/protected/protected.component';
import { AuthGuard } from './guards/auth.guard';

const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'reload',
  scrollPositionRestoration: 'enabled',
};

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'location', component: LocationComponent },
  { path: 'favorites', component: FavoriteComponent,canActivate: [AuthGuard]},
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },  
  { path: 'home', component: HomeComponent },
  { path: 'location', component: LocationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // a changer ...
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}