import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { FavoriteService } from 'src/app/services/favorite/favorite.service';
import { UserHistoryService } from 'src/app/services/userHistory/userHistory';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css'],
})
export class FavoriteComponent implements OnInit {
  userId = '';
  favorites: any[] = [];
  isLoading = true;

  constructor(
    private favoriteService: FavoriteService,
    private weatherService: WeatherService,
    private userHistoryService: UserHistoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId()|| '';

    this.favoriteService.getFavoritesByUserId(this.userId).subscribe(
      (favorites: any) => {
        favorites.forEach((favorite: any) => {
          this.userHistoryService
            .getLocationById(favorite.location_id)
            .subscribe(
              (location: any) => {
                const long = location.longitude;
                const lat = location.latitude;
                this.weatherService.getWeather(lat, long).subscribe(
                  (data: any) => {
                    this.isLoading = false;
                    this.favorites.push({
                      city: data.name,
                      weather: data.weather[0].description,
                      temperature: data.main.temp,
                      feelsLike: data.main.feels_like,
                      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
                    });
                  },
                  (error) =>
                    console.error('Error fetching weather data:', error)
                );
              },
              (error) => console.error('Error fetching location data:', error)
            );
        });
      },
      (error) => console.error('Error fetching favorites:', error)
    );
  }
}
