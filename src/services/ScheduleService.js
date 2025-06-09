import { CONFIG } from '../config/constants.js';
import { Schedule } from '../models/Schedule.js';

/**
 * Schedule Service
 * Handles business logic for schedule generation and date calculations
 */
export class ScheduleService {
  /**
   * Get all Sundays between start and end date
   */
  static getSundaysInRange(startDate, endDate) {
    const date = new Date(startDate);
    const finalDate = new Date(endDate);
    const sundays = [];

    // Move to first Sunday
    while (date.getDay() !== 0) {
      date.setDate(date.getDate() + 1);
    }

    // Collect all Sundays
    while (date < finalDate) {
      sundays.push(date.toLocaleDateString(CONFIG.LOCALE, CONFIG.DATE_OPTIONS));
      date.setDate(date.getDate() + 7);
    }

    return sundays;
  }

  /**
   * Generate schedule by distributing dates among apartments in rotation
   */
  static generateSchedule(apartments, startDate, endDate) {
    const dates = this.getSundaysInRange(startDate, endDate);
    const schedule = new Schedule(apartments, startDate, endDate);

    // Initialize empty arrays for each apartment
    apartments.forEach(apt => {
      schedule.dateAssignments[apt] = [];
    });

    // Distribute dates in rotation
    dates.forEach((date, index) => {
      const apartmentIndex = index % apartments.length;
      const apartment = apartments[apartmentIndex];
      schedule.dateAssignments[apartment].push(date);
    });

    return schedule;
  }

  /**
   * Validate date range
   */
  static validateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha final');
    }

    if (start < new Date()) {
      console.warn('La fecha de inicio es anterior a hoy');
    }

    return true;
  }
}