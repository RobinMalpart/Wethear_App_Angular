import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { CityWeather } from 'src/app/models/city';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  favoriteCity: CityWeather[] = [];
  lastSeenCity: CityWeather[] = [];
  topFrenchCity: CityWeather[] = [];

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    // hard init wait for login
    const topCities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'];
    const favoriteCity = 'Lille';
    const lastSeenCity = 'Nantes';

    // top French cities
    topCities.forEach(city => {
      this.weatherService.getWeatherByCity(city).subscribe(
        data => {
          this.topFrenchCity.push({
            city: data.name,
            weather: data.weather[0].description,
            temperature: data.main.temp,
            feelsLike: data.main.feels_like
          } as CityWeather);
        },
        error => {
          console.error(error);
        }
      );
    });

    // favorite city
    this.weatherService.getWeatherByCity(favoriteCity).subscribe(
      data => {
        this.favoriteCity.push({
          city: data.name,
          weather: data.weather[0].description,
          temperature: data.main.temp,
          feelsLike: data.main.feels_like
        } as CityWeather);
      },
      error => {
        console.error(error);
      }
    );

    // Last seen city
    this.weatherService.getWeatherByCity(lastSeenCity).subscribe(
      data => {
        this.lastSeenCity.push({
          city: data.name,
          weather: data.weather[0].description,
          temperature: data.main.temp,
          feelsLike: data.main.feels_like
        } as CityWeather);
      },
      error => {
        console.error(error);
      }
    );
  }
}