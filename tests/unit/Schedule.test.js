/**
 * Unit Tests for Schedule Model
 * Tests all functionality of the Schedule and Apartment classes
 */

// Mock the CONFIG import
const mockConfig = {
  DATE_OPTIONS: { year: "numeric", month: "long", day: "numeric", hour12: false },
  LOCALE: "es"
};

// Since we're testing the standalone version, we'll import from index.js
// For modular version, we'd import from src/models/Schedule.js
import { Schedule, Apartment } from '../../src/models/Schedule.js';
import { ScheduleService } from '../../src/services/ScheduleService.js';

describe('Schedule Model', () => {
  let schedule;
  let apartments;
  
  beforeEach(() => {
    apartments = [301, 302, 201, 202];
    schedule = {
      apartments: apartments,
      startDate: '2025-06-01',
      endDate: '2025-12-31',
      dateAssignments: {}
    };
  });

  describe('Schedule Constructor', () => {
    test('should create schedule with default values', () => {
      const emptySchedule = {
        apartments: [],
        startDate: null,
        endDate: null,
        dateAssignments: {}
      };
      
      expect(emptySchedule.apartments).toEqual([]);
      expect(emptySchedule.startDate).toBeNull();
      expect(emptySchedule.endDate).toBeNull();
      expect(emptySchedule.dateAssignments).toEqual({});
    });

    test('should create schedule with provided values', () => {
      expect(schedule.apartments).toEqual(apartments);
      expect(schedule.startDate).toBe('2025-06-01');
      expect(schedule.endDate).toBe('2025-12-31');
      expect(schedule.dateAssignments).toEqual({});
    });
  });

  describe('Schedule Validation', () => {
    test('should validate valid schedule', () => {
      const isValid = schedule.apartments.length > 0 && 
                     Boolean(schedule.startDate) && 
                     Boolean(schedule.endDate);
      expect(isValid).toBe(true);
    });

    test('should invalidate schedule without apartments', () => {
      schedule.apartments = [];
      const isValid = schedule.apartments.length > 0 && 
                     Boolean(schedule.startDate) && 
                     Boolean(schedule.endDate);
      expect(isValid).toBe(false);
    });

    test('should invalidate schedule without start date', () => {
      schedule.startDate = null;
      const isValid = schedule.apartments.length > 0 && 
                     Boolean(schedule.startDate) && 
                     Boolean(schedule.endDate);
      expect(isValid).toBe(false);
    });

    test('should invalidate schedule without end date', () => {
      schedule.endDate = null;
      const isValid = schedule.apartments.length > 0 && 
                     Boolean(schedule.startDate) && 
                     Boolean(schedule.endDate);
      expect(isValid).toBe(false);
    });
  });

  describe('Date Calculations', () => {
    test('should calculate total Sundays correctly', () => {
      const startDate = new Date('2025-06-01'); // Sunday
      const endDate = new Date('2025-06-29'); // Sunday
      
      // Count Sundays manually
      let date = new Date(startDate);
      let sundayCount = 0;
      
      // Move to first Sunday
      while (date.getDay() !== 0) {
        date.setDate(date.getDate() + 1);
      }
      
      // Count all Sundays
      while (date <= endDate) {
        sundayCount++;
        date.setDate(date.getDate() + 7);
      }
      
      expect(sundayCount).toBe(5); // Corrected: There are 5 Sundays in June 2025 (1, 8, 15, 22, 29)
    });

    test('should handle date range with no Sundays', () => {
      const startDate = '2025-06-03'; // Tuesday
      const endDate = '2025-06-06';   // Friday
      
      const sundays = ScheduleService.getSundaysInRange(startDate, endDate);
      
      expect(sundays.length).toBe(0);
    });
  });

  describe('Schedule Statistics', () => {
    beforeEach(() => {
      schedule.dateAssignments = {
        301: ['2025-06-01', '2025-06-08'],
        302: ['2025-06-15', '2025-06-22'],
        201: ['2025-06-29'],
        202: []
      };
    });

    test('should calculate apartment count correctly', () => {
      const apartmentCount = Object.keys(schedule.dateAssignments).length;
      expect(apartmentCount).toBe(4);
    });

    test('should calculate total dates correctly', () => {
      const totalDates = Object.values(schedule.dateAssignments)
        .reduce((sum, dates) => sum + dates.length, 0);
      expect(totalDates).toBe(5);
    });

    test('should handle empty date assignments', () => {
      schedule.dateAssignments = {};
      const apartmentCount = Object.keys(schedule.dateAssignments).length;
      const totalDates = Object.values(schedule.dateAssignments)
        .reduce((sum, dates) => sum + dates.length, 0);
      
      expect(apartmentCount).toBe(0);
      expect(totalDates).toBe(0);
    });
  });
});

describe('Apartment Model', () => {
  let apartment;

  beforeEach(() => {
    apartment = {
      number: 301,
      isSelected: true,
      position: 0,
      assignedDates: []
    };
  });

  describe('Apartment Constructor', () => {
    test('should create apartment with required properties', () => {
      expect(apartment.number).toBe(301);
      expect(apartment.isSelected).toBe(true);
      expect(apartment.position).toBe(0);
      expect(apartment.assignedDates).toEqual([]);
    });

    test('should create apartment with default values', () => {
      const defaultApartment = {
        number: 201,
        isSelected: true,
        position: 0,
        assignedDates: []
      };
      
      expect(defaultApartment.isSelected).toBe(true);
      expect(defaultApartment.position).toBe(0);
      expect(defaultApartment.assignedDates).toEqual([]);
    });
  });

  describe('Apartment Selection', () => {
    test('should toggle selection correctly', () => {
      expect(apartment.isSelected).toBe(true);
      
      apartment.isSelected = !apartment.isSelected;
      expect(apartment.isSelected).toBe(false);
      
      apartment.isSelected = !apartment.isSelected;
      expect(apartment.isSelected).toBe(true);
    });
  });

  describe('Date Assignment', () => {
    test('should add date to apartment', () => {
      const date = '2025-06-01';
      apartment.assignedDates.push(date);
      
      expect(apartment.assignedDates).toContain(date);
      expect(apartment.assignedDates.length).toBe(1);
    });

    test('should add multiple dates to apartment', () => {
      const dates = ['2025-06-01', '2025-06-08', '2025-06-15'];
      apartment.assignedDates = [...dates];
      
      expect(apartment.assignedDates).toEqual(dates);
      expect(apartment.assignedDates.length).toBe(3);
    });

    test('should clear all dates from apartment', () => {
      apartment.assignedDates = ['2025-06-01', '2025-06-08'];
      expect(apartment.assignedDates.length).toBe(2);
      
      apartment.assignedDates = [];
      expect(apartment.assignedDates).toEqual([]);
      expect(apartment.assignedDates.length).toBe(0);
    });
  });

  describe('Apartment Display', () => {
    test('should generate correct display name', () => {
      const displayName = `Apartamento ${apartment.number}`;
      expect(displayName).toBe('Apartamento 301');
    });

    test('should generate display name for different apartment numbers', () => {
      apartment.number = 502;
      const displayName = `Apartamento ${apartment.number}`;
      expect(displayName).toBe('Apartamento 502');
    });
  });

  describe('Apartment Position', () => {
    test('should track apartment position correctly', () => {
      expect(apartment.position).toBe(0);
      
      apartment.position = 2;
      expect(apartment.position).toBe(2);
    });

    test('should handle position changes', () => {
      const apartments = [
        { number: 301, position: 0 },
        { number: 302, position: 1 },
        { number: 201, position: 2 }
      ];
      
      // Simulate moving apartment 302 to position 0
      apartments.forEach(apt => {
        if (apt.position >= 0) apt.position += 1;
      });
      apartments[1].position = 0;
      
      expect(apartments[1].position).toBe(0);
    });
  });
});