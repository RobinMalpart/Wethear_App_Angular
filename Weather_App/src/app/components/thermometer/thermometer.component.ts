import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-thermometer',
  templateUrl: './thermometer.component.html',
  styleUrls: ['./thermometer.component.css'],
})
export class ThermometerComponent {
  @Input() temperature: number | null = 0;
  @Input() unit: string = 'C';

  get validTemperature(): number {
    return this.temperature ?? 0;
  }
}
