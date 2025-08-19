import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GymLogsComponent } from './components/gym-logs/gym-logs.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'gym', component: GymLogsComponent },
  { 
    path: 'water', 
    loadComponent: () => import('./components/water-intake/water-intake.component').then(m => m.WaterIntakeComponent) 
  },
  { 
    path: 'running', 
    loadComponent: () => import('./components/running-status/running-status.component').then(m => m.RunningStatusComponent) 
  },
  { 
    path: 'tasks', 
    loadComponent: () => import('./components/daily-tasks/daily-tasks').then(m => m.DailyTasks) 
  },
  { 
    path: 'food', 
    loadComponent: () => import('./components/food-intake/food-intake').then(m => m.FoodIntake) 
  },
  { 
    path: 'goals', 
    loadComponent: () => import('./components/year-goals/year-goals').then(m => m.YearGoals) 
  },{ 
    path: 'timetable', 
    loadComponent: () => import('./components/timetable/timetable').then(m => m.Timetable) 
  },
 { 
    path: 'adventures', 
    loadComponent: () => import('./components/adventure/adventure')
      .then(m => m.Adventure) 
  },
  { 
    path: 'FinanceTracker', 
    loadComponent: () => import('./components/finance-tracker/finance-tracker')
      .then(m => m.FinanceTracker) 
  },
];
