import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

interface Run {
  id: number;
  date: string;
  distance: number; // km
  duration: number; // minutes
  pace: number;     // min/km
  calories: number;
  route?: string;
  weight?: number;
}

@Component({
  selector: 'app-running-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './running-status.component.html',
  styleUrls: ['./running-status.component.css'],
  animations: [
    trigger('slideFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RunningStatusComponent implements OnInit, OnDestroy {
  runningData: Run[] = [];
  showModal = false;
  editingRun: Run | null = null;

  currentRun: Partial<Run> = {};
  currentRunDate: string = '';
  private nextId = 1;

  // Targets
  weeklyTarget = 20;
  monthlyTarget = 80;

  // SVG circle config
  radius = 60;
  circumference = 2 * Math.PI * this.radius;

  // Track rim config
  rimRadius = 65;
  rimCircumference = 2 * Math.PI * this.rimRadius;

  // Time and ticker
  currentTime = '';
  timeInterval: any;
  newsItems: string[] = [
    'UPCOMING MARATHON : 22 Sept TATA Marathon | registration open now!'
    
  ];
  newsTranslateX = 0;
  tickerInterval: any;
  subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit() {
    // Load saved running data
    const saved = localStorage.getItem('runningData');
    if (saved) {
      this.runningData = JSON.parse(saved);
      this.nextId = this.runningData.length
        ? Math.max(...this.runningData.map(r => r.id)) + 1
        : 1;
    }

    // Start clock
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);

    // Start news ticker
    this.startTicker();
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
      this.tickerInterval = null;
    }
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = [];
    }
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  startTicker() {
    let pos = 100; // start outside of view
    this.tickerInterval = setInterval(() => {
      pos -= 0.2; // adjust speed
      if (pos <= -100) pos = 100;
      this.newsTranslateX = pos;
    }, 20);
  }

  getCircleOffset(progress: number): number {
    return this.circumference - (progress / 100) * this.circumference;
  }

  // Modal methods
  openAddModal() {
    this.showModal = true;
    this.editingRun = null;
    this.currentRun = {};
    this.currentRunDate = new Date().toISOString().split('T')[0];
  }

  editRun(run: Run) {
    this.showModal = true;
    this.editingRun = run;
    this.currentRun = { ...run };
    this.currentRunDate = run.date;
  }

  closeModal() {
    this.showModal = false;
    this.editingRun = null;
    this.currentRun = {};
    this.currentRunDate = '';
  }

  saveRun() {
    if (!this.currentRunDate || !this.currentRun.distance || !this.currentRun.duration || !this.currentRun.calories) return;

    const pace = +(this.currentRun.duration! / this.currentRun.distance!).toFixed(2);

    if (this.editingRun) {
      Object.assign(this.editingRun, {
        date: this.currentRunDate,
        distance: this.currentRun.distance!,
        duration: this.currentRun.duration!,
        pace,
        calories: this.currentRun.calories!,
        route: this.currentRun.route,
        weight: this.currentRun.weight
      });
    } else {
      const newRun: Run = {
        id: this.nextId++,
        date: this.currentRunDate,
        distance: this.currentRun.distance!,
        duration: this.currentRun.duration!,
        pace,
        calories: this.currentRun.calories!,
        route: this.currentRun.route,
        weight: this.currentRun.weight
      };
      this.runningData.unshift(newRun);
    }

    this.persistData();
    this.closeModal();
  }

  deleteRun(id: number) {
    this.runningData = this.runningData.filter(r => r.id !== id);
    this.persistData();
  }

  persistData() {
    localStorage.setItem('runningData', JSON.stringify(this.runningData));
  }

  getTotalDistance(): number {
    return this.runningData.reduce((s, r) => s + r.distance, 0);
  }

  getAveragePace(): string {
    if (!this.runningData.length) return '-';
    const avg = this.runningData.reduce((s, r) => s + r.pace, 0) / this.runningData.length;
    return avg.toFixed(1);
  }

  getTotalCalories(): number {
    return this.runningData.reduce((s, r) => s + r.calories, 0);
  }

  formatDuration(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  trackByRunId(i: number, r: Run): number {
    return r.id;
  }

  getWeeklyDistance(): number {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    return this.runningData.filter(r => new Date(r.date) >= start && new Date(r.date) <= today)
      .reduce((s, r) => s + r.distance, 0);
  }

  getMonthlyDistance(): number {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return this.runningData.filter(r => new Date(r.date) >= start && new Date(r.date) <= today)
      .reduce((s, r) => s + r.distance, 0);
  }

  getWeeklyProgress(): number {
    return Math.min((this.getWeeklyDistance() / this.weeklyTarget) * 100, 100);
  }

  getMonthlyProgress(): number {
    return Math.min((this.getMonthlyDistance() / this.monthlyTarget) * 100, 100);
  }
}
