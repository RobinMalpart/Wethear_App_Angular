import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tempConverter'
})
export class TemperatureConverterPipe implements PipeTransform {

  transform(value: number, unit: string = 'C'): number | null {
    if (value == null || isNaN(value)) {
      return null;
    }

    if (unit.toUpperCase() === 'F') {
      return this.celsiusToFahrenheit(value);
    } else if (unit.toUpperCase() === 'C') {
      return value;
    } else {
      return null;
    }
  }

  private celsiusToFahrenheit(celsius: number): number {
    return Math.round((celsius * 9/5) + 32);
  }
}
