import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  GymLog, WaterIntake, RunningStatus, DailyTask, FoodIntake,
  AdventureGoal, YearGoal, TimetableEvent, DashboardStats
} from '../models/data.models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly STORAGE_KEYS = {
    GYM_LOGS: 'surajhub_gym_logs',
    WATER_INTAKE: 'surajhub_water_intake',
    RUNNING_STATUS: 'surajhub_running_status',
    DAILY_TASKS: 'surajhub_daily_tasks',
    FOOD_INTAKE: 'surajhub_food_intake',
    ADVENTURE_GOALS: 'surajhub_adventure_goals',
    YEAR_GOALS: 'surajhub_year_goals',
    TIMETABLE_EVENTS: 'surajhub_timetable_events'
  };

  private gymLogsSubject = new BehaviorSubject<GymLog[]>([]);
  private waterIntakeSubject = new BehaviorSubject<WaterIntake[]>([]);
  private runningStatusSubject = new BehaviorSubject<RunningStatus[]>([]);
  private dailyTasksSubject = new BehaviorSubject<DailyTask[]>([]);
  private foodIntakeSubject = new BehaviorSubject<FoodIntake[]>([]);
  private adventureGoalsSubject = new BehaviorSubject<AdventureGoal[]>([]);
  private yearGoalsSubject = new BehaviorSubject<YearGoal[]>([]);
  private timetableEventsSubject = new BehaviorSubject<TimetableEvent[]>([]);

  constructor() {
    this.loadAllData();
  }

  private loadAllData() {
    this.gymLogsSubject.next(this.loadFromStorage(this.STORAGE_KEYS.GYM_LOGS));
    this.waterIntakeSubject.next(this.loadFromStorage(this.STORAGE_KEYS.WATER_INTAKE));
    this.runningStatusSubject.next(this.loadFromStorage(this.STORAGE_KEYS.RUNNING_STATUS));
    this.dailyTasksSubject.next(this.loadFromStorage(this.STORAGE_KEYS.DAILY_TASKS));
    this.foodIntakeSubject.next(this.loadFromStorage(this.STORAGE_KEYS.FOOD_INTAKE));
    this.adventureGoalsSubject.next(this.loadFromStorage(this.STORAGE_KEYS.ADVENTURE_GOALS));
    this.yearGoalsSubject.next(this.loadFromStorage(this.STORAGE_KEYS.YEAR_GOALS));
    this.timetableEventsSubject.next(this.loadFromStorage(this.STORAGE_KEYS.TIMETABLE_EVENTS));
  }

  private loadFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Gym Logs
  getGymLogs(): Observable<GymLog[]> {
    return this.gymLogsSubject.asObservable();
  }

  addGymLog(gymLog: Omit<GymLog, 'id'>): void {
    const newLog = { ...gymLog, id: this.generateId() };
    const currentLogs = this.gymLogsSubject.value;
    const updatedLogs = [...currentLogs, newLog];
    this.gymLogsSubject.next(updatedLogs);
    this.saveToStorage(this.STORAGE_KEYS.GYM_LOGS, updatedLogs);
  }

  updateGymLog(id: string, updates: Partial<GymLog>): void {
    const currentLogs = this.gymLogsSubject.value;
    const updatedLogs = currentLogs.map(log => 
      log.id === id ? { ...log, ...updates } : log
    );
    this.gymLogsSubject.next(updatedLogs);
    this.saveToStorage(this.STORAGE_KEYS.GYM_LOGS, updatedLogs);
  }

  deleteGymLog(id: string): void {
    const currentLogs = this.gymLogsSubject.value;
    const updatedLogs = currentLogs.filter(log => log.id !== id);
    this.gymLogsSubject.next(updatedLogs);
    this.saveToStorage(this.STORAGE_KEYS.GYM_LOGS, updatedLogs);
  }

  // Water Intake
  getWaterIntake(): Observable<WaterIntake[]> {
    return this.waterIntakeSubject.asObservable();
  }

  addWaterIntake(intake: Omit<WaterIntake, 'id'>): void {
    const newIntake = { ...intake, id: this.generateId() };
    const currentIntake = this.waterIntakeSubject.value;
    const updatedIntake = [...currentIntake, newIntake];
    this.waterIntakeSubject.next(updatedIntake);
    this.saveToStorage(this.STORAGE_KEYS.WATER_INTAKE, updatedIntake);
  }

  deleteWaterIntake(id: string): void {
    const currentIntake = this.waterIntakeSubject.value;
    const updatedIntake = currentIntake.filter(intake => intake.id !== id);
    this.waterIntakeSubject.next(updatedIntake);
    this.saveToStorage(this.STORAGE_KEYS.WATER_INTAKE, updatedIntake);
  }

  // Running Status
  getRunningStatus(): Observable<RunningStatus[]> {
    return this.runningStatusSubject.asObservable();
  }

  addRunningStatus(status: Omit<RunningStatus, 'id'>): void {
    const newStatus = { ...status, id: this.generateId() };
    const currentStatus = this.runningStatusSubject.value;
    const updatedStatus = [...currentStatus, newStatus];
    this.runningStatusSubject.next(updatedStatus);
    this.saveToStorage(this.STORAGE_KEYS.RUNNING_STATUS, updatedStatus);
  }

  updateRunningStatus(id: string, updates: Partial<RunningStatus>): void {
    const currentStatus = this.runningStatusSubject.value;
    const updatedStatus = currentStatus.map(status => 
      status.id === id ? { ...status, ...updates } : status
    );
    this.runningStatusSubject.next(updatedStatus);
    this.saveToStorage(this.STORAGE_KEYS.RUNNING_STATUS, updatedStatus);
  }

  deleteRunningStatus(id: string): void {
    const currentStatus = this.runningStatusSubject.value;
    const updatedStatus = currentStatus.filter(status => status.id !== id);
    this.runningStatusSubject.next(updatedStatus);
    this.saveToStorage(this.STORAGE_KEYS.RUNNING_STATUS, updatedStatus);
  }

  // Daily Tasks
  getDailyTasks(): Observable<DailyTask[]> {
    return this.dailyTasksSubject.asObservable();
  }

  addDailyTask(task: Omit<DailyTask, 'id' | 'createdAt'>): void {
    const newTask = { 
      ...task, 
      id: this.generateId(),
      createdAt: new Date()
    };
    const currentTasks = this.dailyTasksSubject.value;
    const updatedTasks = [...currentTasks, newTask];
    this.dailyTasksSubject.next(updatedTasks);
    this.saveToStorage(this.STORAGE_KEYS.DAILY_TASKS, updatedTasks);
  }

  updateDailyTask(id: string, updates: Partial<DailyTask>): void {
    const currentTasks = this.dailyTasksSubject.value;
    const updatedTasks = currentTasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    );
    this.dailyTasksSubject.next(updatedTasks);
    this.saveToStorage(this.STORAGE_KEYS.DAILY_TASKS, updatedTasks);
  }

  deleteDailyTask(id: string): void {
    const currentTasks = this.dailyTasksSubject.value;
    const updatedTasks = currentTasks.filter(task => task.id !== id);
    this.dailyTasksSubject.next(updatedTasks);
    this.saveToStorage(this.STORAGE_KEYS.DAILY_TASKS, updatedTasks);
  }

  // Food Intake
  getFoodIntake(): Observable<FoodIntake[]> {
    return this.foodIntakeSubject.asObservable();
  }

  addFoodIntake(intake: Omit<FoodIntake, 'id'>): void {
    const newIntake = { ...intake, id: this.generateId() };
    const currentIntake = this.foodIntakeSubject.value;
    const updatedIntake = [...currentIntake, newIntake];
    this.foodIntakeSubject.next(updatedIntake);
    this.saveToStorage(this.STORAGE_KEYS.FOOD_INTAKE, updatedIntake);
  }

  updateFoodIntake(id: string, updates: Partial<FoodIntake>): void {
    const currentIntake = this.foodIntakeSubject.value;
    const updatedIntake = currentIntake.map(intake => 
      intake.id === id ? { ...intake, ...updates } : intake
    );
    this.foodIntakeSubject.next(updatedIntake);
    this.saveToStorage(this.STORAGE_KEYS.FOOD_INTAKE, updatedIntake);
  }

  deleteFoodIntake(id: string): void {
    const currentIntake = this.foodIntakeSubject.value;
    const updatedIntake = currentIntake.filter(intake => intake.id !== id);
    this.foodIntakeSubject.next(updatedIntake);
    this.saveToStorage(this.STORAGE_KEYS.FOOD_INTAKE, updatedIntake);
  }

  // Adventure Goals
  getAdventureGoals(): Observable<AdventureGoal[]> {
    return this.adventureGoalsSubject.asObservable();
  }

  addAdventureGoal(goal: Omit<AdventureGoal, 'id' | 'createdAt'>): void {
    const newGoal = { 
      ...goal, 
      id: this.generateId(),
      createdAt: new Date()
    };
    const currentGoals = this.adventureGoalsSubject.value;
    const updatedGoals = [...currentGoals, newGoal];
    this.adventureGoalsSubject.next(updatedGoals);
    this.saveToStorage(this.STORAGE_KEYS.ADVENTURE_GOALS, updatedGoals);
  }

  updateAdventureGoal(id: string, updates: Partial<AdventureGoal>): void {
    const currentGoals = this.adventureGoalsSubject.value;
    const updatedGoals = currentGoals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    );
    this.adventureGoalsSubject.next(updatedGoals);
    this.saveToStorage(this.STORAGE_KEYS.ADVENTURE_GOALS, updatedGoals);
  }

  deleteAdventureGoal(id: string): void {
    const currentGoals = this.adventureGoalsSubject.value;
    const updatedGoals = currentGoals.filter(goal => goal.id !== id);
    this.adventureGoalsSubject.next(updatedGoals);
    this.saveToStorage(this.STORAGE_KEYS.ADVENTURE_GOALS, updatedGoals);
  }

  // Year Goals
  getYearGoals(): Observable<YearGoal[]> {
    return this.yearGoalsSubject.asObservable();
  }

  addYearGoal(goal: Omit<YearGoal, 'id' | 'createdAt'>): void {
    const newGoal = { 
      ...goal, 
      id: this.generateId(),
      createdAt: new Date()
    };
    const currentGoals = this.yearGoalsSubject.value;
    const updatedGoals = [...currentGoals, newGoal];
    this.yearGoalsSubject.next(updatedGoals);
    this.saveToStorage(this.STORAGE_KEYS.YEAR_GOALS, updatedGoals);
  }

  updateYearGoal(id: string, updates: Partial<YearGoal>): void {
    const currentGoals = this.yearGoalsSubject.value;
    const updatedGoals = currentGoals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    );
    this.yearGoalsSubject.next(updatedGoals);
    this.saveToStorage(this.STORAGE_KEYS.YEAR_GOALS, updatedGoals);
  }

  deleteYearGoal(id: string): void {
    const currentGoals = this.yearGoalsSubject.value;
    const updatedGoals = currentGoals.filter(goal => goal.id !== id);
    this.yearGoalsSubject.next(updatedGoals);
    this.saveToStorage(this.STORAGE_KEYS.YEAR_GOALS, updatedGoals);
  }

  // Timetable Events
  getTimetableEvents(): Observable<TimetableEvent[]> {
    return this.timetableEventsSubject.asObservable();
  }

  addTimetableEvent(event: Omit<TimetableEvent, 'id'>): void {
    const newEvent = { ...event, id: this.generateId() };
    const currentEvents = this.timetableEventsSubject.value;
    const updatedEvents = [...currentEvents, newEvent];
    this.timetableEventsSubject.next(updatedEvents);
    this.saveToStorage(this.STORAGE_KEYS.TIMETABLE_EVENTS, updatedEvents);
  }

  updateTimetableEvent(id: string, updates: Partial<TimetableEvent>): void {
    const currentEvents = this.timetableEventsSubject.value;
    const updatedEvents = currentEvents.map(event => 
      event.id === id ? { ...event, ...updates } : event
    );
    this.timetableEventsSubject.next(updatedEvents);
    this.saveToStorage(this.STORAGE_KEYS.TIMETABLE_EVENTS, updatedEvents);
  }

  deleteTimetableEvent(id: string): void {
    const currentEvents = this.timetableEventsSubject.value;
    const updatedEvents = currentEvents.filter(event => event.id !== id);
    this.timetableEventsSubject.next(updatedEvents);
    this.saveToStorage(this.STORAGE_KEYS.TIMETABLE_EVENTS, updatedEvents);
  }

  // Dashboard Stats
  getDashboardStats(): Observable<DashboardStats> {
    return new Observable(observer => {
      const calculateStats = () => {
        const today = new Date().toDateString();
        
        const gymLogs = this.gymLogsSubject.value;
        const waterIntake = this.waterIntakeSubject.value;
        const runningStatus = this.runningStatusSubject.value;
        const dailyTasks = this.dailyTasksSubject.value;
        const foodIntake = this.foodIntakeSubject.value;
        const adventureGoals = this.adventureGoalsSubject.value;
        const yearGoals = this.yearGoalsSubject.value;
        const timetableEvents = this.timetableEventsSubject.value;

        const stats: DashboardStats = {
          totalWorkouts: gymLogs.length,
          waterIntakeToday: waterIntake
            .filter(intake => new Date(intake.date).toDateString() === today)
            .reduce((sum, intake) => sum + intake.amount, 0),
          totalRuns: runningStatus.length,
          completedTasks: dailyTasks.filter(task => task.status === 'completed').length,
          caloriesConsumed: foodIntake
            .filter(intake => new Date(intake.date).toDateString() === today)
            .reduce((sum, intake) => sum + intake.calories, 0),
          adventuresCompleted: adventureGoals.filter(goal => goal.status === 'completed').length,
          yearGoalsProgress: yearGoals.length > 0 ? 
            yearGoals.reduce((sum, goal) => sum + goal.progress, 0) / yearGoals.length : 0,
          todayEvents: timetableEvents
            .filter(event => new Date(event.date).toDateString() === today).length
        };

        observer.next(stats);
      };

      calculateStats();
      
      // Subscribe to all data changes to recalculate stats
      const subscriptions = [
        this.gymLogsSubject.subscribe(calculateStats),
        this.waterIntakeSubject.subscribe(calculateStats),
        this.runningStatusSubject.subscribe(calculateStats),
        this.dailyTasksSubject.subscribe(calculateStats),
        this.foodIntakeSubject.subscribe(calculateStats),
        this.adventureGoalsSubject.subscribe(calculateStats),
        this.yearGoalsSubject.subscribe(calculateStats),
        this.timetableEventsSubject.subscribe(calculateStats)
      ];

      return () => subscriptions.forEach(sub => sub.unsubscribe());
    });
  }
}