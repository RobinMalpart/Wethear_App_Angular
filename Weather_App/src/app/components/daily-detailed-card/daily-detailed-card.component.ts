import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-daily-detailed-card',
  templateUrl: './daily-detailed-card.component.html',
  styleUrls: ['./daily-detailed-card.component.css']
})
export class DailyDetailedCardComponent {
  @Input() locationName: string = '';
  @Input() currentDate: Date = new Date();
  @Input() mainTemperature: number = 0;
  @Input() weatherDescription: string = '';
  @Input() currentWeatherIconUrl: string = '';
  @Input() feelsLikeTemperature: number = 0;
  @Input() weatherCondition: string = '';
  @Input() windSpeed: number = 0;
  @Input() humidity: number = 0;
  @Input() cloudCoverage: number = 0;
  @Input() rain: number = 0;
  @Input() minTemperature: number = 0;
  @Input() maxTemperature: number = 0;
  

  @Input() oneDayWeather: any[] = [];

  @Input() unit: string = 'C';
}
