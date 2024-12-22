import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { FavoriteService } from 'src/app/services/favorite/favorite.service';
import { CityService } from 'src/app/services/city/city.service';
import { CityWeather, UserHistory } from 'src/app/models/weather';
import { UserHistoryService } from 'src/app/services/userHistory/userHistory';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  favoriteCity: CityWeather[] = [];
  lastSeenCity: CityWeather[] = [];
  topFrenchCity: CityWeather[] = [];
  isUserHistoryEmpty: boolean = false;
  isFavoritesEmpty: boolean = false;
  isNotUserConnected: boolean = false;
  userId: string = '';

  constructor(
    private weatherService: WeatherService,
    private favoriteService: FavoriteService,
    private cityService: CityService,
    private userHistoryService: UserHistoryService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const topCities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'];
    
    this.userId = this.authService.getUserId()|| '';
    if (!this.userId) {
      this.isNotUserConnected = true;
      return;
    }

    // Top French cities
    topCities.forEach((city) => {
      this.weatherService.getWeatherByCity(city).subscribe(
        (data) => {
          this.topFrenchCity.push({
            city: data.name,
            weather: data.weather[0].description,
            temperature: data.main.temp,
            feelsLike: data.main.feels_like,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          } as CityWeather);
        },
        (error) => {
          console.error(error);
        }
      );
    });

    // Favorite cities
    this.favoriteService.getFavoritesByUserId(this.userId).subscribe(
      (filteredFavorites: any[]) => {
        console.log(filteredFavorites);
        if (filteredFavorites.length === 0) {
          this.isFavoritesEmpty = true;
          return;
        }

        filteredFavorites.forEach((city) => {
          this.cityService
            .getCityFromId(city.location_id)
            .subscribe((cityData) => {
              if (cityData.length === 0) {
                console.error('City not found');
                return;
              }
              const long = cityData[0].longitude;
              const lat = cityData[0].latitude;
              this.weatherService.getWeather(lat, long).subscribe(
                (data) => {
                  this.favoriteCity.push({
                    city: data.name,
                    weather: data.weather[0].description,
                    temperature: data.main.temp,
                    feelsLike: data.main.feels_like,
                    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                  } as CityWeather);
                  this.isFavoritesEmpty = false;
                },
                (error) => {
                  console.error(error);
                }
              );
            });
        });
      },
      (error) => {
        console.error('Error fetching favorites by user ID:', error);
      }
    );

    // Last searched cities
    this.userHistoryService.getUserHistoryByUserId(this.userId).subscribe(
      (data: UserHistory[]) => {
        if (data.length === 0) {
          this.isUserHistoryEmpty = true;
          return;
        }

        const uniqueHistory = data.filter(
          (history, index, self) =>
            index ===
            self.findIndex(
              (element) => element.location_id === history.location_id
            )
        );

        uniqueHistory.map((history: UserHistory) => {
          const locationId: string = history.location_id;

          this.userHistoryService.getLocationById(locationId).subscribe(
            (location: { city_name: string }) => {
              if (!location || !location.city_name) {
                console.error(
                  `City name is undefined for locationId: ${locationId}`
                );
                return;
              }

              this.weatherService
                .getWeatherByCity(location.city_name)
                .subscribe(
                  (weather: {
                    weather: { description: string; icon: string }[];
                    main: { temp: number; feels_like: number };
                  }) => {
                    this.lastSeenCity.push({
                      city: location.city_name,
                      weather: weather.weather[0].description,
                      temperature: weather.main.temp,
                      feelsLike: weather.main.feels_like,
                      icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                    } as CityWeather);
                  },
                  (weatherError) => {
                    console.error('Error fetching weather data:', weatherError);
                  }
                );
            },
            (locationError) => {
              console.error('Error fetching location details:', locationError);
            }
          );
        });
      },
      (historyError) => {
        console.error('Error fetching user history:', historyError);
      }
    );
  }

      NavToFavorites() {
        console.log(this.userId)
        this.router.navigate(['/favorites', this.userId]);
      }
  
      NavToHistory() {
        this.router.navigate(['/history', this.userId]);
      }
}
