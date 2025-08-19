import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { GymLog } from '../../models/data.models';

@Component({
  selector: 'app-gym-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gym-logs.component.html',
  styleUrls: ['./gym-logs.component.css']
})
export class GymLogsComponent implements OnInit, OnDestroy {
  gymLogs: GymLog[] = [];
  showModal = false;
  editingLog: GymLog | null = null;
  currentLog: Partial<GymLog> = {};
  currentLogDate = '';
  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.subscription = this.dataService.getGymLogs().subscribe(logs => {
      this.gymLogs = logs.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  trackByLogId(index: number, log: GymLog): string {
    return log.id;
  }

  getTotalDuration(): number {
    return this.gymLogs.reduce((total, log) => total + log.duration, 0);
  }

  getMaxWeight(): number {
    return this.gymLogs.length > 0 
      ? Math.max(...this.gymLogs.map(log => log.weight))
      : 0;
  }

  getThisWeekWorkouts(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.gymLogs.filter(log => 
      new Date(log.date) >= oneWeekAgo
    ).length;
  }

  openAddModal() {
    this.editingLog = null;
    this.currentLog = {
      exercise: '',
      sets: 3,
      reps: 10,
      weight: 0,
      duration: 45,
      notes: ''
    };
    this.currentLogDate = new Date().toISOString().split('T')[0];
    this.showModal = true;
  }

  editLog(log: GymLog) {
    this.editingLog = log;
    this.currentLog = { ...log };
    this.currentLogDate = new Date(log.date).toISOString().split('T')[0];
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingLog = null;
    this.currentLog = {};
  }

  saveLog() {
    if (!this.currentLog.exercise || !this.currentLogDate) {
      return;
    }

    const logData = {
      ...this.currentLog,
      date: new Date(this.currentLogDate),
      sets: Number(this.currentLog.sets),
      reps: Number(this.currentLog.reps),
      weight: Number(this.currentLog.weight),
      duration: Number(this.currentLog.duration)
    } as Omit<GymLog, 'id'>;

    if (this.editingLog) {
      this.dataService.updateGymLog(this.editingLog.id, logData);
    } else {
      this.dataService.addGymLog(logData);
    }

    this.closeModal();
  }

  deleteLog(id: string) {
    if (confirm('Are you sure you want to delete this workout log?')) {
      this.dataService.deleteGymLog(id);
    }
  }
}