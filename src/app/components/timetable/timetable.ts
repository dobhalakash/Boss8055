import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface Activity {
  name: string;
  completed: boolean;
}

interface TimetableEntry {
  day: string;
  activities: Activity[];
}

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timetable.html',
  styleUrls: ['./timetable.css'],
  animations: [
    // Fade In + Slide Up for container
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Staggered animation for timetable items
    trigger('listStagger', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger(100, animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class Timetable {
  timetable: TimetableEntry[] = [
    { day: 'Monday', activities: [{ name: 'Gym - Upper Body', completed: false }] },
    { day: 'Tuesday', activities: [{ name: 'Yoga', completed: false }] },
    { day: 'Wednesday', activities: [{ name: 'Gym - Lower Body', completed: false }] },
    { day: 'Thursday', activities: [{ name: 'Cycling - 10 km', completed: false }] },
    { day: 'Friday', activities: [{ name: 'Running - 10 km', completed: false }] },
    { day: 'Saturday', activities: [{ name: 'Adventure Trip', completed: false }] },
    { day: 'Sunday', activities: [{ name: 'Rest Day', completed: false }] },
  ];

  newActivity: string = '';
  selectedDay: string = 'Monday';

  addActivity() {
    if (!this.newActivity.trim()) return;
    const dayEntry = this.timetable.find(d => d.day === this.selectedDay);
    if (dayEntry) {
      dayEntry.activities.push({ name: this.newActivity, completed: false });
      this.newActivity = '';
    }
  }

  removeActivity(day: string, index: number) {
    const dayEntry = this.timetable.find(d => d.day === day);
    if (dayEntry) {
      dayEntry.activities.splice(index, 1);
    }
  }

  toggleCompleted(day: string, index: number) {
    const dayEntry = this.timetable.find(d => d.day === day);
    if (dayEntry) {
      dayEntry.activities[index].completed = !dayEntry.activities[index].completed;
    }
  }
}
