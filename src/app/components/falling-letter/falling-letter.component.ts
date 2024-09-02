import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-falling-letter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './falling-letter.component.html',
  styleUrls: ['./falling-letter.component.css']
})
export class FallingLetterComponent {
  @Input() letter!: string;
  @Input() xPosition!: number;
  @Input() speed!: number; // Input for animation speed
}
