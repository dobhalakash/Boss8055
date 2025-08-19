import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { DashboardStats, TimetableEvent, AdventureGoal, YearGoal } from '../../models/data.models';

interface QuickStat {
  icon: string;
  value: number | string;
  label: string;
  gradient: string;
}

interface ProgressItem {
  label: string;
  current: number;
  target: number;
  unit: string;
  percentage: number;
}

interface ActivityItem {
  icon: string;
  title: string;
  time: string;
  color: string;
}

interface QuickAction {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  currentTime = '';
  private timeInterval: any;
  private subscriptions: Subscription[] = [];

  quickStats: QuickStat[] = [];
  todayProgress: ProgressItem[] = [];
  recentActivities: ActivityItem[] = [];
  todaySchedule: TimetableEvent[] = [];
  adventureGoals: AdventureGoal[] = [];
  yearGoals: YearGoal[] = [];

  quickActions: QuickAction[] = [
   { icon: '🏋️', label: 'Log Workout', route: 'gym' },
{ icon: '💧', label: 'Add Water', route: 'water' },
{ icon: '🏃', label: 'Log Run', route: 'running' },
{ icon: '📋', label: 'New Task', route: 'tasks' },
{ icon: '🍽️', label: 'Log Meal', route: 'food' },
{ icon: '🎯', label: 'Set Goal', route: 'goals' },
{ icon: '💰', label: 'Finance', route: 'FinanceTracker' },
{ icon: '🌍', label: 'Adventure', route: 'adventures' },
{ icon: '📅', label: 'Timetable', route: 'timetable' },
{ icon: '⚖️', label: 'Weight', route: 'weight' }
  ];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
    this.loadDashboardData();
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  private loadDashboardData() {
    // Load dashboard stats
    const statsSub = this.dataService.getDashboardStats().subscribe(stats => {
      this.updateQuickStats(stats);
      this.updateTodayProgress(stats);
    });
    this.subscriptions.push(statsSub);

    // Load today's schedule
    const eventsSub = this.dataService.getTimetableEvents().subscribe(events => {
      const today = new Date().toDateString();
      this.todaySchedule = events
        .filter(event => new Date(event.date).toDateString() === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .slice(0, 5);
    });
    this.subscriptions.push(eventsSub);

    // Load goals
    const adventureSub = this.dataService.getAdventureGoals().subscribe(goals => {
      this.adventureGoals = goals
        .filter(goal => goal.status !== 'completed')
        .slice(0, 3);
    });
    this.subscriptions.push(adventureSub);

    const yearSub = this.dataService.getYearGoals().subscribe(goals => {
      this.yearGoals = goals.slice(0, 3);
    });
    this.subscriptions.push(yearSub);

    this.loadRecentActivities();
  }

  private updateQuickStats(stats: DashboardStats) {
    this.quickStats = [
      {
        icon: '🏋️',
        value: stats.totalWorkouts,
        label: 'Workouts',
        gradient: 'var(--primary-gradient)'
      },
      {
        icon: '💧',
        value: `${(stats.waterIntakeToday / 1000).toFixed(1)}L`,
        label: 'Water Today',
        gradient: 'var(--accent-gradient)'
      },
      {
        icon: '✅',
        value: stats.completedTasks,
        label: 'Tasks Done',
        gradient: 'var(--success-gradient)'
      },
      {
        icon: '🔥',
        value: stats.caloriesConsumed,
        label: 'Calories',
        gradient: 'var(--secondary-gradient)'
      }
    ];
  }

  private updateTodayProgress(stats: DashboardStats) {
    this.todayProgress = [
      {
        label: 'Water Intake',
        current: stats.waterIntakeToday,
        target: 2500,
        unit: 'ml',
        percentage: Math.min((stats.waterIntakeToday / 2500) * 100, 100)
      },
      {
        label: 'Daily Tasks',
        current: stats.completedTasks,
        target: 8,
        unit: 'tasks',
        percentage: Math.min((stats.completedTasks / 8) * 100, 100)
      },
      {
        label: 'Calories Goal',
        current: stats.caloriesConsumed,
        target: 2200,
        unit: 'cal',
        percentage: Math.min((stats.caloriesConsumed / 2200) * 100, 100)
      }
    ];
  }

  private loadRecentActivities() {
    // This would be more sophisticated in a real app
    // For now, we'll create some sample activities based on recent data
    this.recentActivities = [
      {
        icon: '🏋️',
        title: 'Completed chest workout',
        time: '2 hours ago',
        color: 'var(--primary-gradient)'
      },
      {
        icon: '💧',
        title: 'Drank 500ml water',
        time: '30 minutes ago',
        color: 'var(--accent-gradient)'
      },
      {
        icon: '✅',
        title: 'Finished project review',
        time: '1 hour ago',
        color: 'var(--success-gradient)'
      },
      {
        icon: '🍽️',
        title: 'Logged lunch meal',
        time: '3 hours ago',
        color: 'var(--secondary-gradient)'
      }
    ];
  }

  navigateToSection(route: string) {
    this.router.navigate([`/${route}`]);
  }
}