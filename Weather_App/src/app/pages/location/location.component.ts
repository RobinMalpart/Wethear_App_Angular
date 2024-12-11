// location.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from 'src/app/services/weather/weather.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements OnInit {
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

  // Flag to indicate if a search has been performed
  hasSearched: boolean = false;

  // Property to store the current weather icon URL
  currentWeatherIconUrl: string = '';

  // Detailed weather data with icon URLs
  oneDayWeather: any[] = [];
  threeDaysWeather: any[] = [];

  // Loading Indicator
  isLoading: boolean = false;

  // Property to track the current weather type ('daily' or 'next-3-days')
  currentWeatherType: string = 'daily';

  constructor(private route: ActivatedRoute, private weatherService: WeatherService) {}

  ngOnInit(): void {
    // Subscribe to query parameters
    this.route.queryParams.subscribe(params => {
      const city = params['city']?.trim();
      const unit = params['unit'] === 'F' ? 'F' : 'C'; // Default to 'C' if not 'F'
      const timeOption = params['time'] === '3 Days' ? 'next-3-days' : 'daily'; // Map 'Daily' and '3 Days' to internal options

      // Set the current weather type
      this.currentWeatherType = timeOption;
      
      console.log(`Received Query Params - City: ${city}, Unit: ${unit}, Time Option: ${timeOption}`);

      if (city) {
        this.searchWeather(city, timeOption);
      } else {
        this.errorMessage = 'No city specified.';
      }
    });
  }

  searchWeather(city: string, timeOption: string): void {
    console.log('Starting Weather Search'); // Debugging statement

    // Reset weather data and error message
    this.oneDayWeather = [];
    this.threeDaysWeather = [];
    this.hasSearched = false;
    this.errorMessage = '';

    if (city.length > 0 && timeOption === 'daily') {
      console.log('Fetching Daily Weather Data'); // Debugging
      // Fetch daily weather data
      this.weatherService.getCoordinates(city).subscribe({
        next: (data) => {
          console.log('Geocoding Data:', data); // Debugging
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            this.getTodayWeatherData(lat, lon);
          } else {
            this.errorMessage = 'City not found.';
            this.hasSearched = false;
          }
        },
        error: (err) => {
          console.error('Geocoding Error:', err); // Debugging
          this.errorMessage = 'Error fetching data. Please try again.';
          this.hasSearched = false;
        },
      });
    } else if (city.length > 0 && timeOption === 'next-3-days') {
      console.log('Fetching Next 3 Days Weather Data'); // Debugging
      // Fetch three days weather data
      this.weatherService.getCoordinates(city).subscribe({
        next: (data) => {
          console.log('Geocoding Data:', data); // Debugging
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            this.getThreeDaysWeatherData(lat, lon);
          } else {
            this.errorMessage = 'City not found.';
            this.hasSearched = false;
          }
        },
        error: (err) => {
          console.error('Geocoding Error:', err); // Debugging
          this.errorMessage = 'Error fetching data. Please try again.';
          this.hasSearched = false;
        },
      });
    } else {
      console.log('Invalid Input'); // Debugging
      if (city.length === 0) {
        this.errorMessage = 'Please enter a city name.';
      } else {
        this.errorMessage = 'Selected weather type is not supported.';
      }
    }
  }

  getTodayWeatherData(lat: number, lon: number): void {
    // Fetch current weather data
    this.weatherService.getWeather(lat, lon).subscribe({
      next: (weatherData) => {
        console.log('Current Weather Data:', weatherData);
        this.storeWeatherData(weatherData);
      },
      error: (err) => {
        console.error('Weather Data Error:', err);
        this.errorMessage = 'Error fetching weather data.';
        this.hasSearched = false;
      },
    });

    // Fetch 5-day weather forecast data
    this.weatherService.get5DaysWeather(lat, lon).subscribe({
      next: (fiveDaysWeatherData) => {
        console.log('5 Days Weather Data:', fiveDaysWeatherData);
        // Assuming data.dt is a Unix timestamp in seconds
        fiveDaysWeatherData.list.splice(0, 8).forEach((data: any) => {
          const iconCode = data.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

          this.oneDayWeather.push({
            day: new Date(data.dt * 1000), // Store as Date object
            time: this.formatUnixTimestamp(data.dt),
            temperature: data.main.temp,
            weather: data.weather[0].description,
            iconUrl: iconUrl, // Add the icon URL
          });
        });
        console.log('Detailed Weather Data:', this.oneDayWeather);
        // Set the flag to true as data has been successfully fetched and stored
        this.hasSearched = true;
      },
      error: (err) => {
        console.error('Error fetching 5 days weather data:', err);
        this.errorMessage = 'Error fetching weather forecast data.';
        this.hasSearched = false;
      },
    });
  }

  getThreeDaysWeatherData(lat: number, lon: number,): void {
    // Fetch 5-day weather forecast data and extract next 3 days
    this.weatherService.get5DaysWeather(lat, lon).subscribe({
      next: (fiveDaysWeatherData) => {
        console.log('5 Days Weather Data:', fiveDaysWeatherData);
        
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight to compare only the date part
  
        // Extracting data for the next 3 days (assuming 8 entries per day)
        this.threeDaysWeather = fiveDaysWeatherData.list
          .filter((data: any) => {
            const dataDate = new Date(data.dt * 1000);
            dataDate.setHours(0, 0, 0, 0); // Set to midnight to compare only the date part
            return dataDate > today; // Filter out today's date
          })
          .slice(0, 24) // Get the first 24 entries (3 days)
          .map((data: any) => {
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
            return {
              day: new Date(data.dt * 1000), // Store as Date object
              time: this.formatUnixTimestamp(data.dt),
              temperature: data.main.temp,
              weather: data.weather[0].description,
              iconUrl: iconUrl, // Add the icon URL
            };
          });
  
        console.log('Detailed Weather Data for 3 Days:', this.threeDaysWeather);
        // Set the flag to true as data has been successfully fetched and stored
        this.hasSearched = true;
      },
      error: (err) => {
        console.error('Error fetching 5 days weather data:', err);
        this.errorMessage = 'Error fetching weather forecast data.';
        this.hasSearched = false;
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
