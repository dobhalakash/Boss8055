import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FoodEntry {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

@Component({
  selector: 'app-food-intake',
  templateUrl: './food-intake.html',
  styleUrls: ['./food-intake.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe]
})
export class FoodIntake {
  foodEntries: FoodEntry[] = [];
  showModal = false;
  editingEntry: FoodEntry | null = null;
  currentEntry: FoodEntry = this.createEmptyEntry();

  // ✅ Create empty entry
  private createEmptyEntry(): FoodEntry {
    return {
      id: Date.now(),
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      date: new Date().toISOString().split('T')[0]
    };
  }

  // ✅ Totals
  getTotalCalories(): number {
    return this.foodEntries.reduce((sum, f) => sum + f.calories, 0);
  }

  getTotalProtein(): number {
    return this.foodEntries.reduce((sum, f) => sum + f.protein, 0);
  }

  getTotalCarbs(): number {
    return this.foodEntries.reduce((sum, f) => sum + f.carbs, 0);
  }

  getTotalFat(): number {
    return this.foodEntries.reduce((sum, f) => sum + f.fat, 0);
  }

  // ✅ Modal Controls
  openAddModal() {
    this.editingEntry = null;
    this.currentEntry = this.createEmptyEntry();
    this.showModal = true;
  }

  editEntry(entry: FoodEntry) {
    this.editingEntry = entry;
    this.currentEntry = { ...entry };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveEntry() {
    if (this.editingEntry) {
      const index = this.foodEntries.findIndex(f => f.id === this.editingEntry!.id);
      this.foodEntries[index] = { ...this.currentEntry };
    } else {
      this.foodEntries.push({ ...this.currentEntry });
    }
    this.closeModal();
  }

  deleteEntry(id: number) {
    this.foodEntries = this.foodEntries.filter(f => f.id !== id);
  }

  // ✅ TrackBy
  trackByFoodId(index: number, entry: FoodEntry): number {
    return entry.id;
  }
}
