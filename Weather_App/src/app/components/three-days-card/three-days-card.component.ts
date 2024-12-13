import { Component, Input, SimpleChanges } from '@angular/core';

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

  firstDayWeather: any[] = [];
  secondDayWeather: any[] = [];
  thirdDayWeather: any[] = [];

  @Input() unit: string = 'C';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['threeDaysWeather'] && this.threeDaysWeather.length > 0) {
      this.splitThreeDaysWeather();
    }
  }

  private splitThreeDaysWeather(): void {
    if (this.threeDaysWeather.length < 24) {
      console.warn('threeDaysWeather array has less than 24 elements.');
    }

    this.firstDayWeather = this.threeDaysWeather.slice(0, 8);
    this.secondDayWeather = this.threeDaysWeather.slice(8, 16);
    this.thirdDayWeather = this.threeDaysWeather.slice(16, 24);

    console.log('First Day Weather:', this.firstDayWeather);
    console.log('Second Day Weather:', this.secondDayWeather);
    console.log('Third Day Weather:', this.thirdDayWeather);
  }
}
