import { Component, Input, Output, EventEmitter } from '@angular/core';

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

  @Input() isFavorite: boolean = false;
  @Input() userId: string = '';
  @Input() locationId: string = '';

  @Output() toggleFavorite = new EventEmitter<{ userId: string; locationId: string }>();

  onToggleFavorite(): void {
    this.toggleFavorite.emit({ userId: this.userId, locationId: this.locationId });
  }
}
