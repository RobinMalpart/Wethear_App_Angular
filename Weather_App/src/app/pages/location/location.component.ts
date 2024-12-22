import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserHistoryService } from 'src/app/services/userHistory/userHistory';
import { MessageService } from 'src/app/services/message/shared.service';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { FavoriteService } from 'src/app/services/favorite/favorite.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private weatherService: WeatherService,
    private messageService: MessageService,
    private userHistoryService: UserHistoryService,
    private favoriteService: FavoriteService,
    private authService: AuthService
  ) {}

  locationName = '';
  mainTemperature = 0;
  weatherDescription = '';
  feelsLikeTemperature = 0;
  weatherCondition = '';
  windSpeed = 0;
  humidity = 0;
  cloudCoverage = 0;
  rain = 0;
  minTemperature = 0;
  maxTemperature = 0;
  errorMessage = '';
  date: Date = new Date();

  hasSearched = false;
  isLoading = false;

  currentWeatherIconUrl = '';

  oneDayWeather: any[] = [];
  threeDaysWeather: any[] = [];

  currentWeatherType = 'daily';
  unit = 'C';

  locationId = '';
  isFavorite = false;
  userId = this.authService.getUserId()|| '';
  private errorSubscription!: Subscription;

  ngOnInit(): void {
    this.errorSubscription = this.messageService.errorMessage$.subscribe(
      (message) => {
        this.errorMessage = message ?? '';
      }
    );

    this.route.queryParams.subscribe((params) => {
      const city = params['city']?.trim();
      this.unit = params['unit'] === 'F' ? 'F' : 'C';
      const timeOption = params['time'] === '3 Days' ? 'next-3-days' : 'daily';

      this.currentWeatherType = timeOption;

      if (city) {
        this.searchWeather(city, timeOption);
      } else {
        this.messageService.setErrorMessage('No city specified.');
      }
    });
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }

  searchWeather(city: string, timeOption: string): void {
    this.resetWeatherData();

    if (city.length > 0) {
      this.weatherService.getCoordinates(city).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            if (timeOption === 'daily') {
              this.getTodayWeatherData(lat, lon);
            } else {
              this.getThreeDaysWeatherData(lat, lon);
            }
            this.recordLocationAndCheckFavorite(city, lat, lon);
          } else {
            this.messageService.setErrorMessage('City not found. Please try again.');
            this.hasSearched = false;
          }
        },
        error: () => {
          this.messageService.setErrorMessage('Error fetching data. Please try again.');
          this.hasSearched = false;
        },
      });
    } else {
      this.messageService.setErrorMessage('Please enter a valid city name.');
    }
  }

  resetWeatherData(): void {
    this.oneDayWeather = [];
    this.threeDaysWeather = [];
    this.hasSearched = false;
    this.messageService.setErrorMessage('');
  }

  recordLocationAndCheckFavorite(city: string, lat: number, lon: number): void {
    this.userHistoryService.addLocationAndSearch(this.userId, city, lat, lon).subscribe({
      next: (result) => {
        this.locationId = result?.ville?.id ?? '';
        if (this.locationId) {
          this.getCheckFavorite(this.userId, this.locationId);
        }
      },
      error: (error) => {
        console.error('Error adding Location and Search:', error);
        this.messageService.setErrorMessage('Failed to record your search.');
      },
    });
  }

  getTodayWeatherData(lat: number, lon: number): void {
    this.isLoading = true;
    this.weatherService.getWeather(lat, lon).subscribe({
      next: (weatherData) => {
        this.storeWeatherData(weatherData);
      },
      error: (err) => {
        console.error('Weather Data Error:', err);
        this.messageService.setErrorMessage('Error fetching weather data.');
        this.hasSearched = false;
        this.isLoading = false;
      },
    });

    this.weatherService.get5DaysWeather(lat, lon).subscribe({
      next: (fiveDaysWeatherData) => {
        fiveDaysWeatherData.list.splice(0, 8).forEach((data: any) => {
          this.oneDayWeather.push(this.mapWeatherData(data));
        });
        this.hasSearched = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.setErrorMessage('Error fetching weather forecast data.');
        this.hasSearched = false;
        this.isLoading = false;
      },
    });
  }

  getThreeDaysWeatherData(lat: number, lon: number): void {
    this.isLoading = true;
  
    this.weatherService.getWeather(lat, lon).subscribe({
      next: (weatherData) => {
        this.storeWeatherData(weatherData);
      },
      error: (err) => {
        console.error('Error fetching current weather data:', err);
        this.messageService.setErrorMessage('Error fetching current weather data.');
        this.isLoading = false;
      },
    });
  
    this.weatherService.get5DaysWeather(lat, lon).subscribe({
      next: (fiveDaysWeatherData) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        this.threeDaysWeather = fiveDaysWeatherData.list
          .filter((data: any) => {
            const dataDate = new Date(data.dt * 1000);
            dataDate.setHours(0, 0, 0, 0);
            return dataDate > today; // Filter out today's data
          })
          .slice(0, 24)
          .map((data: any) => this.mapWeatherData(data));
  
        this.hasSearched = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.setErrorMessage('Error fetching weather forecast data.');
        this.isLoading = false;
      },
    });
  }  
  

  mapWeatherData(data: any): any {
    const iconCode = data.weather[0].icon;
    return {
      day: new Date(data.dt * 1000),
      time: this.formatUnixTimestamp(data.dt),
      temperature: data.main.temp,
      weather: data.weather[0].description,
      iconUrl: `https://openweathermap.org/img/wn/${iconCode}@2x.png`,
    };
  }

  addFavorite(userId: string, locationId: string): void {
    if (this.isFavorite) {
      this.favoriteService.removeFavorite(userId, locationId).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (error) => {
          console.error('Error removing favorite:', error);
        },
      });
    } else {
      this.favoriteService.addFavorite(userId, locationId).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (error) => {
          console.error('Error adding favorite:', error);
        },
      });
    }
  }

  getCheckFavorite(userId: string, locationId: string): void {
    this.favoriteService.getFavoritesByUserId(userId).subscribe({
      next: (favorites) => {
        this.isFavorite = favorites.some((favorite: any) => favorite.location_id === locationId);
      },
      error: (error) => {
        console.error('Error fetching favorites:', error);
      },
    });
  }

  storeWeatherData(weatherData: any): void {
    this.locationName = `${weatherData.name}, ${weatherData.sys.country}`;
    this.mainTemperature = weatherData.main.temp;
    this.weatherDescription = weatherData.weather[0].description;
    this.feelsLikeTemperature = weatherData.main.feels_like;
    this.weatherCondition = weatherData.weather[0].description;
    this.windSpeed = weatherData.wind.speed;
    this.humidity = weatherData.main.humidity;
    this.cloudCoverage = weatherData.clouds.all;
    this.minTemperature = weatherData.main.temp_min;
    this.maxTemperature = weatherData.main.temp_max;

    const iconCode = weatherData.weather[0].icon;
    this.currentWeatherIconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  formatUnixTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
