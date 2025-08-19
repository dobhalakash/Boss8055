import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FinanceEntry {
  id: number;
  type: 'Income' | 'Expense' | 'Saving';
  amount: number;
  category: string;
  date: string;
}

@Component({
  selector: 'app-finance-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finance-tracker.html',
  styleUrls: ['./finance-tracker.css']
})
export class FinanceTracker {
  entries: FinanceEntry[] = [];

  newEntry: FinanceEntry = this.createEmptyEntry();

  private createEmptyEntry(): FinanceEntry {
    return {
      id: Date.now(),
      type: 'Expense',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0]
    };
  }

  addEntry() {
    this.entries.push({ ...this.newEntry, id: Date.now() });
    this.newEntry = this.createEmptyEntry();
  }

  deleteEntry(id: number) {
    this.entries = this.entries.filter(e => e.id !== id);
  }

  getTotal(type: 'Income' | 'Expense' | 'Saving'): number {
    return this.entries
      .filter(e => e.type === type)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  // ✅ Compute Balance dynamically
  getBalance(): number {
    return this.getTotal('Income') - this.getTotal('Expense');
  }

  trackById(index: number, entry: FinanceEntry) {
    return entry.id;
  }
}
