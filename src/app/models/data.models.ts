export interface GymLog {
  id: string;
  date: Date;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number; // in minutes
  notes?: string;
}

export interface WaterIntake {
  id: string;
  date: Date;
  amount: number; // in ml
  time: string;
  target: number; // daily target in ml
}

export interface RunningStatus {
  id: string;
  date: Date;
  distance: number; // in km
  duration: number; // in minutes
  pace: number; // minutes per km
  calories: number;
  route?: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  category: 'work' | 'personal' | 'health' | 'education';
  createdAt: Date;
}

export interface FoodIntake {
  id: string;
  date: Date;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export interface AdventureGoal {
  id: string;
  title: string;
  description: string;
  category: 'travel' | 'outdoor' | 'sports' | 'learning' | 'other';
  status: 'planned' | 'in-progress' | 'completed';
  targetDate: Date;
  progress: number; // percentage
  milestones: string[];
  createdAt: Date;
}

export interface YearGoal {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'health' | 'personal' | 'financial' | 'education';
  targetDate: Date;
  progress: number;
  milestones: Milestone[];
  createdAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export interface TimetableEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: Date;
  category: 'work' | 'personal' | 'health' | 'education' | 'social';
  recurring?: 'daily' | 'weekly' | 'monthly';
}

export interface DashboardStats {
  totalWorkouts: number;
  waterIntakeToday: number;
  totalRuns: number;
  completedTasks: number;
  caloriesConsumed: number;
  adventuresCompleted: number;
  yearGoalsProgress: number;
  todayEvents: number;
}