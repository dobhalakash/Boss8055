import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Run {
  id: number;
  date: string;
  distance: number;
  duration: number; // in minutes
  pace: number; // min/km
  calories: number;
  route?: string;
  weight?: number; // ✅ added
}

@Component({
  selector: 'app-running-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './running-status.component.html',
  styleUrls: ['./running-status.component.css']
})
export class RunningStatusComponent {
  runningData: Run[] = [];
  showModal = false;
  editingRun: Run | null = null;

  // For form binding
  currentRun: Partial<Run> = {};
  currentRunDate: string = '';

  // Generate ID
  private nextId = 1;

  // Open Add Modal
  openAddModal() {
    this.showModal = true;
    this.editingRun = null;
    this.currentRun = {};
    this.currentRunDate = new Date().toISOString().split('T')[0];
  }

  // Open Edit Modal
  editRun(run: Run) {
    this.showModal = true;
    this.editingRun = run;
    this.currentRun = { ...run };
    this.currentRunDate = run.date;
  }

  // Close Modal
  closeModal() {
    this.showModal = false;
    this.editingRun = null;
    this.currentRun = {};
    this.currentRunDate = '';
  }

  // Save Run
  saveRun() {
    if (!this.currentRunDate || !this.currentRun.distance || !this.currentRun.duration || !this.currentRun.pace || !this.currentRun.calories) {
      return;
    }

    if (this.editingRun) {
      // Update existing run
      this.editingRun.date = this.currentRunDate;
      this.editingRun.distance = this.currentRun.distance;
      this.editingRun.duration = this.currentRun.duration;
      this.editingRun.pace = this.currentRun.pace;
      this.editingRun.calories = this.currentRun.calories;
      this.editingRun.route = this.currentRun.route;
      this.editingRun.weight = this.currentRun.weight; // ✅ include weight
    } else {
      // Add new run
      const newRun: Run = {
        id: this.nextId++,
        date: this.currentRunDate,
        distance: this.currentRun.distance!,
        duration: this.currentRun.duration!,
        pace: this.currentRun.pace!,
        calories: this.currentRun.calories!,
        route: this.currentRun.route,
        weight: this.currentRun.weight // ✅ include weight
      };
      this.runningData.unshift(newRun);
    }

    this.closeModal();
  }

  // Delete Run
  deleteRun(id: number) {
    this.runningData = this.runningData.filter(run => run.id !== id);
  }

  // Stats
  getTotalDistance(): number {
    return this.runningData.reduce((sum, run) => sum + run.distance, 0);
  }

  getAveragePace(): string {
    if (this.runningData.length === 0) return '-';
    const avg = this.runningData.reduce((sum, run) => sum + run.pace, 0) / this.runningData.length;
    return avg.toFixed(1);
  }

  getTotalCalories(): number {
    return this.runningData.reduce((sum, run) => sum + run.calories, 0);
  }

  // Helpers
  formatDuration(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  }

  trackByRunId(index: number, run: Run): number {
    return run.id;
  }
}
