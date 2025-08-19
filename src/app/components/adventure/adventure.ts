import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interface for adventure items
interface AdventureItem {
  name: string;
  location: string;
  date: string;
  completed: boolean;
}

@Component({
  selector: 'app-adventure',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adventure.html',
  styleUrls: ['./adventure.css']
})
export class Adventure {
  // Sample adventures
  adventures: AdventureItem[] = [
    { name: 'Mountain Trekking', location: 'Himalayas', date: '2025-09-15', completed: false },
    { name: 'Scuba Diving', location: 'Andaman', date: '2025-11-05', completed: false },
    { name: 'Desert Safari', location: 'Rajasthan', date: '2026-01-10', completed: false }
  ];

  // New adventure model
  newAdventure: AdventureItem = { name: '', location: '', date: '', completed: false };

  // Add adventure
  addAdventure() {
    if (this.newAdventure.name && this.newAdventure.location && this.newAdventure.date) {
      this.adventures.push({ ...this.newAdventure, completed: false });
      this.newAdventure = { name: '', location: '', date: '', completed: false };
    }
  }

  // Toggle completed status
  toggleCompleted(index: number) {
    this.adventures[index].completed = !this.adventures[index].completed;
  }

  // Remove adventure
  removeAdventure(index: number) {
    this.adventures.splice(index, 1);
  }
}
