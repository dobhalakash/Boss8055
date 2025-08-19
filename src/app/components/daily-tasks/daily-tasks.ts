import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  priority: string;
  completed: boolean;
}

@Component({
  selector: 'app-daily-tasks',
  templateUrl: './daily-tasks.html',
  styleUrls: ['./daily-tasks.css'],
  standalone: true, // ✅ Important since we are not using NgModule
  imports: [CommonModule, FormsModule, DatePipe] // ✅ Fixes ngIf, ngFor, ngModel, date pipe
})
export class DailyTasks {
  tasks: Task[] = [];
  showModal = false;
  editingTask: Task | null = null;
  currentTask: Task = this.createEmptyTask();
  currentTaskDate: string = '';

  // Create a new empty task
  private createEmptyTask(): Task {
    return {
      id: Date.now(),
      title: '',
      description: '',
      date: '',
      priority: 'Low',
      completed: false
    };
  }

  // ✅ Counters
  getCompletedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  getPendingCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  // ✅ Modal controls
  openAddModal() {
    this.editingTask = null;
    this.currentTask = this.createEmptyTask();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // ✅ Save task (add or edit)
  saveTask() {
    if (this.editingTask) {
      const index = this.tasks.findIndex(t => t.id === this.editingTask!.id);
      this.tasks[index] = { ...this.currentTask };
    } else {
      this.tasks.push({ ...this.currentTask });
    }
    this.closeModal();
  }

  // ✅ Edit task
  editTask(task: Task) {
    this.editingTask = task;
    this.currentTask = { ...task };
    this.showModal = true;
  }

  // ✅ Delete task
  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  // ✅ Toggle completion
  toggleComplete(task: Task) {
    task.completed = !task.completed;
  }

  // ✅ TrackBy for *ngFor
  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}
