// src/app/components/location/location.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JsonServerService } from 'src/app/services/jsonServer/user.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { WeatherService } from 'src/app/services/weather/weather.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements OnInit, OnDestroy {
  // Weather Data Properties
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

  hasSearched: boolean = false;
  isLoading: boolean = false;

  currentWeatherIconUrl: string = '';

  oneDayWeather: any[] = [];
  threeDaysWeather: any[] = [];

  currentWeatherType: string = 'daily';
  unit: string = 'C';

  private errorSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private weatherService: WeatherService,
    private sharedService: SharedService,
    private jsonServerService: JsonServerService
  ) {}

  ngOnInit(): void {
    // Subscribe to error messages from SharedService
    this.errorSubscription = this.sharedService.errorMessage$.subscribe(
      (message) => {
        this.errorMessage = message ?? '';
      }
    );

    // Subscribe to query parameters
    this.route.queryParams.subscribe((params) => {
      const city = params['city']?.trim();
      this.unit = params['unit'] === 'F' ? 'F' : 'C';
      const timeOption = params['time'] === '3 Days' ? 'next-3-days' : 'daily';

      this.currentWeatherType = timeOption;

      if (city) {
        this.searchWeather(city, timeOption);
      } else {
        this.sharedService.setErrorMessage('No city specified.');
      }
    });
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }

  searchWeather(city: string, timeOption: string): void {
    // Reset weather data and error message
    this.oneDayWeather = [];
    this.threeDaysWeather = [];
    this.hasSearched = false;
    this.sharedService.setErrorMessage('');

    if (city.length > 0 && timeOption === 'daily') {
      this.weatherService.getCoordinates(city).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            this.getTodayWeatherData(lat, lon);

            // Subscribe to addLocationAndSearch Observable
            // change with userId
            this.jsonServerService
              .addLocationAndSearch('1', city, lat, lon)
              .subscribe({
                next: (result) => {
                  console.log('Location and Search added:', result);
                  // Optionally, display a success message to the user
                },
                error: (error) => {
                  console.error('Error adding Location and Search:', error);
                  this.sharedService.setErrorMessage(
                    'Failed to record your search.'
                  );
                },
              });
          } else {
            this.sharedService.setErrorMessage(
              'City not found. Please try again.'
            );
            this.hasSearched = false;
          }
        },
        error: () => {
          this.sharedService.setErrorMessage(
            'Error fetching data. Please try again.'
          );
          this.hasSearched = false;
        },
      });
    } else if (city.length > 0 && timeOption === 'next-3-days') {
      this.weatherService.getCoordinates(city).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            this.getThreeDaysWeatherData(lat, lon);
            // Subscribe to addLocationAndSearch Observable
            // change with userId
            this.jsonServerService
              .addLocationAndSearch('1', city, lat, lon)
              .subscribe({
                next: (result) => {
                  console.log('Location and Search added:', result);
                  // Optionally, display a success message to the user
                },
                error: (error) => {
                  console.error('Error adding Location and Search:', error);
                  this.sharedService.setErrorMessage(
                    'Failed to record your search.'
                  );
                },
              });
          } else {
            this.sharedService.setErrorMessage(
              'City not found. Please try again.'
            );
            this.hasSearched = false;
          }
        },
        error: (err) => {
          this.sharedService.setErrorMessage(
            'Error fetching data. Please try again.'
          );
          this.hasSearched = false;
        },
      });
    } else {
      if (city.length === 0) {
        this.sharedService.setErrorMessage('Please enter a valid city name.');
      } else {
        this.sharedService.setErrorMessage(
          'Selected weather type is not supported.'
        );
      }
    }
  }

  getTodayWeatherData(lat: number, lon: number): void {
    this.isLoading = true;
    this.weatherService.getWeather(lat, lon).subscribe({
      next: (weatherData) => {
        console.log('Current Weather Data:', weatherData);
        this.storeWeatherData(weatherData);
      },
      error: (err) => {
        console.error('Weather Data Error:', err);
        this.sharedService.setErrorMessage('Error fetching weather data.');
        this.hasSearched = false;
        this.isLoading = false;
      },
    });
    this.weatherService.get5DaysWeather(lat, lon).subscribe({
      next: (fiveDaysWeatherData) => {
        console.log('5 Days Weather Data:', fiveDaysWeatherData);
        fiveDaysWeatherData.list.splice(0, 8).forEach((data: any) => {
          const iconCode = data.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

          this.oneDayWeather.push({
            day: new Date(data.dt * 1000),
            time: this.formatUnixTimestamp(data.dt),
            temperature: data.main.temp,
            weather: data.weather[0].description,
            iconUrl: iconUrl,
          });
        });
        this.hasSearched = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.sharedService.setErrorMessage(
          'Error fetching weather forecast data.'
        );
        this.hasSearched = false;
        this.isLoading = false;
      },
    });
  }

  getThreeDaysWeatherData(lat: number, lon: number): void {
    this.isLoading = true;
    this.weatherService.get5DaysWeather(lat, lon).subscribe({
      next: (fiveDaysWeatherData) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Extracting data for the next 3 days (assuming 8 entries per day)
        this.threeDaysWeather = fiveDaysWeatherData.list
          .filter((data: any) => {
            const dataDate = new Date(data.dt * 1000);
            dataDate.setHours(0, 0, 0, 0);
            return dataDate > today; // Filter out today's data
          })
          .slice(0, 24) // Get the first 24 entries (3 days)
          .map((data: any) => {
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            return {
              day: new Date(data.dt * 1000),
              time: this.formatUnixTimestamp(data.dt),
              temperature: data.main.temp,
              weather: data.weather[0].description,
              iconUrl: iconUrl,
            };
          });
        this.hasSearched = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching 5 days weather data:', err);
        this.sharedService.setErrorMessage(
          'Error fetching weather forecast data.'
        );
        this.hasSearched = false;
        this.isLoading = false;
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

    // Extract the icon code and construct the icon URL
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
