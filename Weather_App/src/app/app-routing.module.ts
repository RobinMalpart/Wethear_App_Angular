import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LocationComponent } from './pages/location/location.component';

const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'reload',
  scrollPositionRestoration: 'enabled',
};

const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  { path: 'location', component: LocationComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}