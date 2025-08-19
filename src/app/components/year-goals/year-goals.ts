import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface YearGoal {
  id: number;
  place: string;
  days: number;
  year: number;
  progress: number; // ✅ added
}

@Component({
  selector: 'app-year-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './year-goals.html',
  styleUrls: ['./year-goals.css']
})
export class YearGoals {
  goals: YearGoal[] = [];
  showModal = false;
  editingGoal: YearGoal | null = null;
  currentGoal: YearGoal = this.createEmptyGoal();
  currentYear = new Date().getFullYear(); // ✅ safe for template

  // ✅ Helper
  private createEmptyGoal(): YearGoal {
    return {
      id: Date.now(),
      place: '',
      days: 0,
      year: this.currentYear,
      progress: 0
    };
  }

  // ✅ Summary
  getTotalDays(): number {
    return this.goals.reduce((sum, g) => sum + g.days, 0);
  }

  // ✅ Modal Control
  openAddModal() {
    this.editingGoal = null;
    this.currentGoal = this.createEmptyGoal();
    this.showModal = true;
  }

  editGoal(goal: YearGoal) {
    this.editingGoal = goal;
    this.currentGoal = { ...goal };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveGoal() {
    if (this.editingGoal) {
      const index = this.goals.findIndex(g => g.id === this.editingGoal!.id);
      this.goals[index] = { ...this.currentGoal };
    } else {
      this.goals.push({ ...this.currentGoal });
    }
    this.closeModal();
  }

  deleteGoal(id: number) {
    this.goals = this.goals.filter(g => g.id !== id);
  }

  // ✅ TrackBy
  trackByGoalId(index: number, goal: YearGoal): number {
    return goal.id;
  }
}
