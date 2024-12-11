import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-three-days-card',
  templateUrl: './three-days-card.component.html',
  styleUrls: ['./three-days-card.component.css']
})
export class ThreeDaysCardComponent {
  @Input() locationName: string = '';
  @Input() currentDate: Date = new Date();
  @Input() mainTemperature: number = 0;
  @Input() weatherDescription: string = '';
  @Input() currentWeatherIconUrl: string = '';

  @Input() threeDaysWeather: any[] = [];
}
