import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { WaterIntake } from '../../models/data.models';

interface GroupedIntake {
  date: Date;
  entries: WaterIntake[];
  total: number;
}

@Component({
  selector: 'app-water-intake',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './water-intake.component.html',
  styleUrls: ['./water-intake.component.css']
})
export class WaterIntakeComponent implements OnInit, OnDestroy {
  waterIntakes: WaterIntake[] = [];
  groupedIntakes: GroupedIntake[] = [];
  showModal = false;
  currentIntake: Partial<WaterIntake> = {};
  currentIntakeDate = '';
  selectedFilter = 'This Week';
  filterOptions = ['Today', 'This Week', 'This Month', 'All Time'];
  
  today = new Date();
  todayIntake = 0;
  dailyTarget = 2500;
  todayProgressPercentage = 0;
  remainingIntake = 0;
  
  quickAmounts = [250, 500, 750, 1000];
  bottleMarks = [25, 50, 75, 100];
  
  private subscription: Subscription = new Subscription();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.subscription = this.dataService.getWaterIntake().subscribe(intakes => {
      this.waterIntakes = intakes.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime() ||
        b.time.localeCompare(a.time)
      );
      this.updateTodayStats();
      this.groupIntakesByDate();
    });

    // Initialize current intake
    const now = new Date();
    this.currentIntake = {
      amount: 250,
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      target: this.dailyTarget
    };
    this.currentIntakeDate = now.toISOString().split('T')[0];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  trackByEntryId(index: number, entry: WaterIntake): string {
    return entry.id;
  }

  updateTodayStats() {
    const todayStr = this.today.toDateString();
    const todayIntakes = this.waterIntakes.filter(intake => 
      new Date(intake.date).toDateString() === todayStr
    );
    
    this.todayIntake = todayIntakes.reduce((sum, intake) => sum + intake.amount, 0);
    
    if (todayIntakes.length > 0) {
      this.dailyTarget = todayIntakes[0].target;
    }
    
    this.todayProgressPercentage = Math.min((this.todayIntake / this.dailyTarget) * 100, 100);
    this.remainingIntake = Math.max(this.dailyTarget - this.todayIntake, 0);
  }

  groupIntakesByDate() {
    const grouped = new Map<string, GroupedIntake>();
    
    let filteredIntakes = [...this.waterIntakes];
    
    // Apply date filter
    const now = new Date();
    switch (this.selectedFilter) {
      case 'Today':
        filteredIntakes = filteredIntakes.filter(intake => 
          new Date(intake.date).toDateString() === now.toDateString()
        );
        break;
      case 'This Week':
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        filteredIntakes = filteredIntakes.filter(intake => 
          new Date(intake.date) >= weekAgo
        );
        break;
      case 'This Month':
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        filteredIntakes = filteredIntakes.filter(intake => 
          new Date(intake.date) >= monthAgo
        );
        break;
    }
    
    filteredIntakes.forEach(intake => {
      const dateStr = new Date(intake.date).toDateString();
      if (!grouped.has(dateStr)) {
        grouped.set(dateStr, {
          date: new Date(intake.date),
          entries: [],
          total: 0
        });
      }
      const group = grouped.get(dateStr)!;
      group.entries.push(intake);
      group.total += intake.amount;
    });
    
    this.groupedIntakes = Array.from(grouped.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(group => ({
        ...group,
        entries: group.entries.sort((a, b) => b.time.localeCompare(a.time))
      }));
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
    this.groupIntakesByDate();
  }

  quickAddWater(amount: number) {
    const now = new Date();
    const intake: Omit<WaterIntake, 'id'> = {
      date: now,
      amount: amount,
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      target: this.dailyTarget
    };
    
    this.dataService.addWaterIntake(intake);
  }

  openAddModal() {
    const now = new Date();
    this.currentIntake = {
      amount: 250,
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      target: this.dailyTarget
    };
    this.currentIntakeDate = now.toISOString().split('T')[0];
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentIntake = {};
  }

  saveIntake() {
    if (!this.currentIntake.amount || !this.currentIntake.time || !this.currentIntakeDate) {
      return;
    }

    const intake: Omit<WaterIntake, 'id'> = {
      date: new Date(this.currentIntakeDate),
      amount: Number(this.currentIntake.amount),
      time: this.currentIntake.time,
      target: Number(this.currentIntake.target) || this.dailyTarget
    };

    this.dataService.addWaterIntake(intake);
    this.closeModal();
  }

  deleteIntake(id: string) {
    if (confirm('Are you sure you want to delete this water intake entry?')) {
      this.dataService.deleteWaterIntake(id);
    }
  }
}