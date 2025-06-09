import { CONFIG } from '../config/constants.js';

/**
 * Schedule Model
 * Represents a schedule with date calculations and validation
 */
export class Schedule {
  constructor(apartments = [], startDate = null, endDate = null) {
    this.apartments = apartments;
    this.startDate = startDate;
    this.endDate = endDate;
    this.dateAssignments = {};
  }

  /**
   * Validate if the schedule configuration is valid
   */
  isValid() {
    return this.apartments.length > 0 && this.startDate && this.endDate;
  }

  /**
   * Get the total number of Sundays in the date range
   */
  getTotalSundays() {
    if (!this.startDate || !this.endDate) return 0;
    
    const date = new Date(this.startDate);
    const finalDate = new Date(this.endDate);
    let count = 0;

    // Move to first Sunday
    while (date.getDay() !== 0) {
      date.setDate(date.getDate() + 1);
    }

    // Count all Sundays
    while (date < finalDate) {
      count++;
      date.setDate(date.getDate() + 7);
    }

    return count;
  }

  /**
   * Get schedule statistics
   */
  getStats() {
    return {
      apartmentCount: this.apartments.length,
      totalDates: Object.values(this.dateAssignments).reduce((sum, dates) => sum + dates.length, 0),
      totalSundays: this.getTotalSundays()
    };
  }
}

/**
 * Apartment Model
 * Represents an apartment with its properties
 */
export class Apartment {
  constructor(number, isSelected = true, position = 0) {
    this.number = number;
    this.isSelected = isSelected;
    this.position = position;
    this.assignedDates = [];
  }

  /**
   * Toggle apartment selection
   */
  toggleSelection() {
    this.isSelected = !this.isSelected;
  }

  /**
   * Add a date assignment to this apartment
   */
  addDate(date) {
    this.assignedDates.push(date);
  }

  /**
   * Clear all date assignments
   */
  clearDates() {
    this.assignedDates = [];
  }

  /**
   * Get apartment display name
   */
  getDisplayName() {
    return `Apartamento ${this.number}`;
  }
}