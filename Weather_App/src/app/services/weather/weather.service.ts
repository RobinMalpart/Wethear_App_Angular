import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  private apiKey = '0e423f765298ca2a90a63f11fd79827c'; // Change into .env mdr -- SEE LATER

  constructor(private http: HttpClient) { }

  getCoordinates(cityName: string): Observable<any> {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`;
    return this.http.get(geoUrl);
  }

  getWeather(lat: number, lon: number): Observable<any> {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&lang=fr&units=metric`;
    return this.http.get(weatherUrl);
  }

  getWeatherByCity(cityName: string): Observable<any> { // See if we can pipe it (optimization)
    return new Observable(observer => {
      this.getCoordinates(cityName).subscribe(
        (data: any[]) => {
          if (data.length > 0) {
            this.getWeather(data[0].lat, data[0].lon).subscribe(
              weatherData => {
                observer.next({
                  weather: weatherData.weather[0].description,
                  temperature: weatherData.main.temp,
                  feelsLike: weatherData.main.feels_like
                });
                observer.complete();
              },
              error => observer.error(error)
            );
          } else {
            observer.error('City not found');
          }
        },
        error => observer.error(error)
      );
    });
  }
}