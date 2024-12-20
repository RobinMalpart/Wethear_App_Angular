import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTemperatureColor]',
})
export class TemperatureColorDirective implements OnChanges {
  @Input('appTemperatureColor') temperature: number | null = 0; // Allow null

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    const color = this.getTemperatureColor(this.temperature ?? 0); // Fallback to 0
    if (this.el.nativeElement instanceof SVGElement) {
      this.renderer.setAttribute(this.el.nativeElement, 'fill', color);
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'color', color);
    }
  }

  private getTemperatureColor(temp: number): string {
    if (temp < 0) {
      return '#00f';
    } else if (temp >= 0 && temp < 15) {
      return '#0099ff';
    } else if (temp >= 15 && temp < 25) {
      return '#ffcc00';
    } else if (temp >= 25 && temp < 35) {
      return '#ff6600';
    } else {
      return '#f00';
    }
  }
}
