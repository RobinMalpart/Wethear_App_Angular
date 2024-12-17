import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { FavoriteService } from 'src/app/services/favorite/favorite.service';
import { CityWeather } from 'src/app/models/city';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  favoriteCity: CityWeather[] = [];
  lastSeenCity: CityWeather[] = [];
  topFrenchCity: CityWeather[] = [];

  constructor(private weatherService: WeatherService, private favoriteService: FavoriteService, private cityService: CityService) { }

  ngOnInit(): void {
    // hard init wait for login
    const topCities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'];
    const favoriteCity = '';
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

    // favorite city test
    this.favoriteService.getFavorites().subscribe(
      data => {
        for (const city of data as any) {
          console.log('All Favorite',city);
          this.cityService.getCityFromId(city.location_id).subscribe(
            cityData => {
              if (cityData.length === 0) {
                console.error('City not found');
              }
              console.log('datacity',cityData);
              const long = cityData[0].longitude;
              const lat = cityData[0].latitude;
              this.weatherService.getWeather(lat, long).subscribe(
                data => {
                  console.log('data',data);
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
            }
          )

        }
      },
      error => {
        console.error(error);
      }
    );
  }
}