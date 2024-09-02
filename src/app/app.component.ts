import { Component, HostListener, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FallingLetterComponent } from './components/falling-letter/falling-letter.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FallingLetterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'spel';
  score = 0;
  health = 5;
  letters: { letter: string; xPosition: number; startTime: number; id: number; speed: number }[] = [];
  intervalId: any;
  isBrowser: boolean;
  click_count = 0;
  load_speed = 1000;
  letterTimeouts: Map<number, any> = new Map(); // Map to store timeouts for each letter

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isBrowser) {
      const pressedKey = event.key.toUpperCase();
      const letterFurthestDown = this.getLetterFurthestDown();

      if (letterFurthestDown && pressedKey === letterFurthestDown.letter) {
        this.removeLetter(letterFurthestDown.id, true); // Indicate the letter was clicked
        this.score++;
        this.click_count++;
        this.adjustLoadSpeed(); // Adjust the speed of letter loading
      } else if (letterFurthestDown) {
        this.health--;
        this.score = Math.max(0, this.score - 1);
      }
    }
  }

  getLetterFurthestDown(): { letter: string; xPosition: number; startTime: number; id: number; speed: number } | undefined {
    if (this.letters.length === 0) {
      return undefined;
    }

    // Find the letter that has been falling the longest
    const now = Date.now();
    return this.letters.reduce((furthest, letter) => {
      const letterFallDuration = now - letter.startTime;
      const furthestFallDuration = now - furthest.startTime;
      return letterFallDuration > furthestFallDuration ? letter : furthest;
    });
  }

  removeLetter(id: number, wasClicked: boolean = false) {
    const index = this.letters.findIndex((letter) => letter.id === id);
    if (index > -1) {
      this.letters.splice(index, 1); // Remove the letter from the array

      // Clear the timeout for this letter if it exists
      if (this.letterTimeouts.has(id)) {
        clearTimeout(this.letterTimeouts.get(id));
        this.letterTimeouts.delete(id);
      }

      if (!wasClicked) {
        // The letter was not clicked and hit the ground
        this.health--;
        this.score = Math.max(0, this.score - 1);
      }
    }
  }

  calculateFallingSpeed(): number {
    // Calculate speed based on click count, reducing to a minimum of 1 second
    return Math.max(1, 5 - this.click_count * 0.1); // Adjust speed calculation as needed
  }

  adjustLoadSpeed() {
    // Decrease load speed (increase difficulty) as click count increases
    this.load_speed = Math.max(500, 1000 - this.click_count * 50); // Adjust values as needed

    // Restart the interval with the new load speed
    this.restartInterval();
  }

  restartInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.startInterval();
  }

  startInterval() {
    let letterIdCounter = 0; // Unique identifier for each letter
    this.intervalId = setInterval(() => {
      const newLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const xPosition = Math.floor(Math.random() * 100);
      const startTime = Date.now();
      const id = letterIdCounter++; // Assign a unique ID to each letter
      const speed = this.calculateFallingSpeed(); // Calculate the speed based on click_count

      // Add new letter to the array
      this.letters = [...this.letters, { letter: newLetter, xPosition, startTime, id, speed }];

      // Set a timeout to remove the letter after it has finished falling
      const timeoutId = setTimeout(() => {
        this.removeLetter(id, false); // Indicate the letter hit the ground
      }, speed * 1000); // Convert speed from seconds to milliseconds

      // Store the timeout ID for this letter in the Map
      this.letterTimeouts.set(id, timeoutId);
    }, this.load_speed); // Use the dynamically adjusted load speed
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.startInterval();
    }
  }

  restartGame() {
    this.score = 0;
    this.health = 5;
    this.letters = [];
    this.click_count = 0; // Reset click count
    this.load_speed = 1000; // Reset load speed

    // Clear all existing letter timeouts
    this.letterTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.letterTimeouts.clear();

    this.restartInterval(); // Restart the interval with initial settings
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear interval when component is destroyed
    }

    // Clear all existing letter timeouts
    this.letterTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  }
}
