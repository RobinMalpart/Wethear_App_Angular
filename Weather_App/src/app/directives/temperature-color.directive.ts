import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
@Directive({
  selector: '[appTemperatureColor]',
})
export class TemperatureColorDirective implements OnChanges {
  @Input('appTemperatureColor') temperature: number | null = 0; 
  @Input() unit: string = 'C';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    const tempInCelsius = this.unit.toUpperCase() === 'F' ? this.fahrenheitToCelsius(this.temperature ?? 0) : (this.temperature ?? 0);
    const color = this.getTemperatureColor(tempInCelsius);
    if (this.el.nativeElement instanceof SVGElement) {
      this.renderer.setAttribute(this.el.nativeElement, 'fill', color);
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'color', color);
    }
  }

  private fahrenheitToCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5 / 9;
  }

  private getTemperatureColor(temp: number): string {
    if (temp < 0) {
      return '#00f'; // Blue
    } else if (temp >= 0 && temp < 15) {
      return '#0099ff'; // Light blue 
    } else if (temp >= 15 && temp < 25) {
      return '#ffcc00'; // Yellow 
    } else if (temp >= 25 && temp < 35) {
      return '#ff6600'; // Orange
    } else {
      return '#f00'; // Red
    }
  }
}
