import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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


@NgModule({
  declarations: [AppComponent, HomeComponent, HeaderComponent, CardComponent, LocationComponent, DailyDetailedCardComponent, ThreeDaysCardComponent, TemperatureConverterPipe],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}