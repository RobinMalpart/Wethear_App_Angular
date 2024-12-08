import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() city!: string;
  @Input() weather!: string;
  @Input() temperature!: number;
  @Input() feelsLike!: number;
}