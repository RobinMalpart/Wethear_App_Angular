import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnChanges {
  @Input() city!: string;
  @Input() weather!: string;
  @Input() temperature!: number;
  @Input() feelsLike!: number;

  weatherEmoji: string = '🌍';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weather']) {
      this.setWeatherEmoji();
    }
  }

  private setWeatherEmoji(): void {
    switch (this.weather) {
      case 'nuageux':
        this.weatherEmoji = '☁️';
        break;
      case 'pluie':
        this.weatherEmoji = '🌧️';
        break;
      case 'pluie très fine':
        this.weatherEmoji = '🌧️';
        break;
      case 'neige':
        this.weatherEmoji = '❄️';
        break;
      case 'orage':
        this.weatherEmoji = '⛈️';
        break;
      case 'brouillard':
        this.weatherEmoji = '🌫️';
        break;
      case 'couvert':
        this.weatherEmoji = '🌥️';
        break;
      case 'ciel dégagé':
        this.weatherEmoji = '🌞';
        break;
    }
  }
}