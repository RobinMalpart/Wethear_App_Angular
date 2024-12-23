import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { UserHistoryService } from 'src/app/services/userHistory/userHistory';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
  userId = '';
  history: any[] = [];
  isLoading = true;

  constructor(
    private weatherService: WeatherService,
    private userHistoryService: UserHistoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() || '';
    this.userHistoryService.getUserHistoryByUserId(this.userId).subscribe(
      (searches: any) => {
        searches.forEach((search: any) => {
          this.userHistoryService.getLocationById(search.location_id).subscribe(
            (location: any) => {
              const long = location.longitude;
              const lat = location.latitude;
              this.weatherService.getWeather(lat, long).subscribe(
                (data: any) => {
                  this.isLoading = false;
                  this.history.push({
                    city: data.name,
                    weather: data.weather[0].description,
                    temperature: data.main.temp,
                    feelsLike: data.main.feels_like,
                    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
                  });
                  this.isLoading = false;
                },
                (error) => console.error('Error fetching weather data:', error)
              );
            },
            (error) => console.error('Error fetching location data:', error)
          );
        });
      },
      (error) => console.error('Error fetching searches:', error)
    );
  }
}
