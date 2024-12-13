import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProtectedComponent } from './pages/protected/protected.component'; // Import du composant
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Rediriger par défaut
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
