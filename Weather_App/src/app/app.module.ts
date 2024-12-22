import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { CardComponent } from './components/card/card.component';
import { LocationComponent } from './pages/location/location.component';
import { DailyDetailedCardComponent } from './components/daily-detailed-card/daily-detailed-card.component';
import { ThreeDaysCardComponent } from './components/three-days-card/three-days-card.component';
import { TemperatureConverterPipe } from './pipes/temperature-converter.pipe';
import { TemperatureColorDirective } from './directives/temperature-color.directive';
import { ThermometerComponent } from './components/thermometer/thermometer.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { HistoryComponent } from './pages/history/history.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { SignupComponent } from './pages/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    CardComponent,
    LocationComponent,
    DailyDetailedCardComponent,
    ThreeDaysCardComponent,
    TemperatureConverterPipe,
    TemperatureColorDirective,
    ThermometerComponent,
    FavoriteComponent,
    HistoryComponent,
    LoginFormComponent,
    LoginComponent,
    SignupFormComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
