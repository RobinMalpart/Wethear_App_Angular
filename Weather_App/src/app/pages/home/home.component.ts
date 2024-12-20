import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { FavoriteService } from 'src/app/services/favorite/favorite.service';
import { CityService } from 'src/app/services/city/city.service';
import { CityWeather, UserHistory } from 'src/app/models/weather';
import { JsonServerService } from 'src/app/services/jsonServer/jsonServer.service';

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
  isNotUserConnected: boolean = false;

  constructor(
    private weatherService: WeatherService,
    private favoriteService: FavoriteService,
    private cityService: CityService,
    private jsonServerService: JsonServerService
  ) {}

  ngOnInit(): void {
    // hard init wait for login
    const topCities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'];

    const favoriteCity = 'Lille';

    // top French cities
    topCities.forEach((city) => {
      this.weatherService.getWeatherByCity(city).subscribe(
        (data) => {
          this.topFrenchCity.push({
            city: data.name,
            weather: data.weather[0].description,
            temperature: data.main.temp,
            feelsLike: data.main.feels_like,
          } as CityWeather);
        },
        (error) => {
          console.error(error);
        }
      );
    });

    // favorite city test
    this.favoriteService.getFavorites().subscribe((data) => {
      for (const city of data as any) {
        console.log('All Favorite', city);
        this.cityService
          .getCityFromId(city.location_id)
          .subscribe((cityData) => {
            if (cityData.length === 0) {
              console.error('City not found');
            }
            console.log('datacity', cityData);
            const long = cityData[0].longitude;
            const lat = cityData[0].latitude;
            this.weatherService.getWeather(lat, long).subscribe(
              (data) => {
                console.log('data', data);
                this.favoriteCity.push({
                  city: data.name,
                  weather: data.weather[0].description,
                  temperature: data.main.temp,
                  feelsLike: data.main.feels_like,
                } as CityWeather);
              },
              (error) => {
                console.error(error);
              }
            );
          });
      }

      // Last searched cities
      const userId = '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p';

      if (!userId) {
        this.isNotUserConnected = true;
        return;
      }

      this.jsonServerService.getUserHistoryByUserId(userId).subscribe(
        (data: UserHistory[]) => {
          // User hasn't searched any city yet
          if (data.length === 0) {
            this.isUserHistoryEmpty = true;
            return;
          }

          // Filter out duplicate location_ids in the user history
          const uniqueHistory = data.filter(
            (history, index, self) =>
              index ===
              self.findIndex(
                (element) => element.location_id === history.location_id
              )
          );

          uniqueHistory.map((history: UserHistory) => {
            let locationId: string = history.location_id;

            this.jsonServerService.getLocationById(locationId).subscribe(
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
                      weather: { description: string }[];
                      main: { temp: number; feels_like: number };
                    }) => {
                      this.lastSeenCity.push({
                        city: location.city_name,
                        weather: weather.weather[0].description,
                        temperature: weather.main.temp,
                        feelsLike: weather.main.feels_like,
                      } as CityWeather);
                    },
                    (weatherError) => {
                      console.error(
                        'Error fetching weather data:',
                        weatherError
                      );
                    }
                  );
              },
              (locationError) => {
                console.error(
                  'Error fetching location details:',
                  locationError
                );
              }
            );
          });
        },
        (historyError) => {
          console.error('Error fetching user history:', historyError);
        }
      );
    });
  }
}
