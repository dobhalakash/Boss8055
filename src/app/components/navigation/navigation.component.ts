import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  isMobileMenuOpen = false;

  navigationItems: NavigationItem[] = [
    { label: 'Dashboard', icon: '🏠', route: '/', exact: true },
    { label: 'Gym Logs', icon: '🏋️', route: '/gym' },
    { label: 'Water Intake', icon: '💧', route: '/water' },
    { label: 'Running', icon: '🏃', route: '/running' },
    { label: 'Tasks', icon: '📋', route: '/tasks' },
    { label: 'Food', icon: '🍽️', route: '/food' },
    { label: 'Adventures', icon: '🎯', route: '/adventures' },
    { label: 'Year Goals', icon: '📅', route: '/goals' },
    { label: 'Timetable', icon: '⏰', route: '/timetable' },
        { label: 'Finance', icon: '₹', route: '/FinanceTracker' }
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}