/**
 * Test Utilities for Building-Dates Application
 * Common functions and helpers for testing
 */

/**
 * DOM Testing Utilities
 */
export const DOMUtils = {
  /**
   * Create a mock DOM structure for testing
   */
  createMockApp() {
    return `
      <div id="app">
        <header>
          <h1>Escalas de Limpieza</h1>
        </header>
        
        <main>
          <section class="configuration">
            <div class="date-inputs">
              <input id="startDate" type="date" value="2025-06-01">
              <input id="endDate" type="date" value="2025-06-29">
            </div>
            
            <div id="apartmentList">
              <div class="apartment-item" draggable="true">
                <input type="checkbox" value="301" checked>
                <span>Apartamento 301</span>
                <span class="position-indicator">1</span>
                <button class="order-btn" data-direction="up">↑</button>
                <button class="order-btn" data-direction="down">↓</button>
              </div>
              <div class="apartment-item" draggable="true">
                <input type="checkbox" value="302" checked>
                <span>Apartamento 302</span>
                <span class="position-indicator">2</span>
                <button class="order-btn" data-direction="up">↑</button>
                <button class="order-btn" data-direction="down">↓</button>
              </div>
              <div class="apartment-item" draggable="true">
                <input type="checkbox" value="201">
                <span>Apartamento 201</span>
                <span class="position-indicator">3</span>
                <button class="order-btn" data-direction="up">↑</button>
                <button class="order-btn" data-direction="down">↓</button>
              </div>
            </div>
            
            <button id="generateBtn">Generar Escalas</button>
          </section>
          
          <section class="results">
            <div id="scheduleInfo"></div>
            <div id="scheduleContent"></div>
            <button id="downloadBtn" style="display: none;">Descargar PDF</button>
          </section>
        </main>
      </div>
    `;
  },

  /**
   * Setup DOM for testing
   */
  setupDOM(htmlContent = null) {
    document.body.innerHTML = htmlContent || this.createMockApp();
  },

  /**
   * Clean up DOM after testing
   */
  cleanupDOM() {
    document.body.innerHTML = '';
  },

  /**
   * Get selected apartments from DOM
   */
  getSelectedApartments() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
  },

  /**
   * Set apartment selection state
   */
  setApartmentSelection(apartmentNumbers) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.checked = apartmentNumbers.includes(cb.value);
    });
  },

  /**
   * Simulate user input on date fields
   */
  setDateInputs(startDate, endDate) {
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    
    if (startInput) startInput.value = startDate;
    if (endInput) endInput.value = endDate;
  },

  /**
   * Simulate button click with proper event
   */
  clickButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
      const event = new Event('click', { bubbles: true });
      button.dispatchEvent(event);
    }
    return button;
  },

  /**
   * Simulate drag and drop operation
   */
  simulateDragDrop(sourceIndex, targetIndex) {
    const apartmentList = document.getElementById('apartmentList');
    const items = Array.from(apartmentList.children);
    
    if (sourceIndex < items.length && targetIndex < items.length) {
      const sourceItem = items[sourceIndex];
      const targetItem = items[targetIndex];
      
      // Simulate drag start
      sourceItem.classList.add('dragging');
      
      // Perform the move
      if (sourceIndex < targetIndex) {
        apartmentList.insertBefore(sourceItem, targetItem.nextSibling);
      } else {
        apartmentList.insertBefore(sourceItem, targetItem);
      }
      
      // Clean up
      sourceItem.classList.remove('dragging');
      
      return true;
    }
    return false;
  }
};

/**
 * Mock Data Utilities
 */
export const MockData = {
  /**
   * Generate sample apartment list
   */
  createApartments(count = 3) {
    const apartments = [];
    for (let i = 1; i <= count; i++) {
      apartments.push({
        number: `${i}01`,
        selected: i <= 2, // First two selected by default
        position: i
      });
    }
    return apartments;
  },

  /**
   * Generate sample schedule
   */
  createSchedule(apartments = ['301', '302'], datesPerApartment = 2) {
    const schedule = {};
    
    apartments.forEach((apt, index) => {
      schedule[apt] = [];
      for (let i = 0; i < datesPerApartment; i++) {
        const date = new Date('2025-06-01');
        date.setDate(date.getDate() + (index * datesPerApartment) + i);
        schedule[apt].push(date.toLocaleDateString('es', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }));
      }
    });
    
    return { dateAssignments: schedule };
  },

  /**
   * Generate large dataset for performance testing
   */
  createLargeSchedule(apartmentCount = 50, datesPerApartment = 10) {
    const apartments = Array.from({ length: apartmentCount }, (_, i) => `${i + 1}01`);
    return this.createSchedule(apartments, datesPerApartment);
  },

  /**
   * Create mock date range
   */
  createDateRange(startDate = '2025-06-01', dayCount = 28) {
    const dates = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  },

  /**
   * Create invalid test data
   */
  createInvalidData() {
    return {
      emptySchedule: { dateAssignments: {} },
      nullSchedule: null,
      undefinedSchedule: undefined,
      malformedSchedule: {
        dateAssignments: {
          '': ['date1'],
          'null': null,
          'undefined': undefined,
          '301': 'not-an-array'
        }
      },
      invalidDates: {
        dateAssignments: {
          '301': [null, undefined, '', 'invalid-date']
        }
      }
    };
  }
};

/**
 * Event Testing Utilities
 */
export const EventUtils = {
  /**
   * Create mock keyboard event
   */
  createKeyboardEvent(type, key, options = {}) {
    return new KeyboardEvent(type, {
      key,
      bubbles: true,
      cancelable: true,
      ...options
    });
  },

  /**
   * Create mock mouse event
   */
  createMouseEvent(type, options = {}) {
    return new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      ...options
    });
  },

  /**
   * Create mock touch event
   */
  createTouchEvent(type, touches = []) {
    return new TouchEvent(type, {
      touches,
      bubbles: true,
      cancelable: true
    });
  },

  /**
   * Create mock drag event
   */
  createDragEvent(type, dataTransfer = null) {
    const event = new Event(type, { bubbles: true, cancelable: true });
    event.dataTransfer = dataTransfer || {
      setData: jest.fn(),
      getData: jest.fn(),
      effectAllowed: 'move',
      dropEffect: 'move'
    };
    return event;
  },

  /**
   * Simulate user interaction sequence
   */
  async simulateUserFlow(steps) {
    for (const step of steps) {
      await new Promise(resolve => {
        switch (step.type) {
          case 'click':
            DOMUtils.clickButton(step.target);
            break;
          case 'input':
            DOMUtils.setDateInputs(step.startDate, step.endDate);
            break;
          case 'select':
            DOMUtils.setApartmentSelection(step.apartments);
            break;
          case 'wait':
            setTimeout(resolve, step.duration || 100);
            return;
        }
        resolve();
      });
    }
  }
};

/**
 * Assertion Utilities
 */
export const AssertionUtils = {
  /**
   * Check if element exists and is visible
   */
  expectElementVisible(selector) {
    const element = document.querySelector(selector);
    expect(element).toBeTruthy();
    expect(element.style.display).not.toBe('none');
    return element;
  },

  /**
   * Check if element is hidden
   */
  expectElementHidden(selector) {
    const element = document.querySelector(selector);
    if (element) {
      expect(element.style.display).toBe('none');
    }
    return element;
  },

  /**
   * Check schedule content
   */
  expectScheduleContent(expectedApartments) {
    const scheduleContent = document.getElementById('scheduleContent');
    expect(scheduleContent).toBeTruthy();
    
    expectedApartments.forEach(apartment => {
      const apartmentElement = scheduleContent.querySelector(`[data-apartment="${apartment}"]`);
      expect(apartmentElement).toBeTruthy();
    });
  },

  /**
   * Check date range validity
   */
  expectValidDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    expect(start).toBeInstanceOf(Date);
    expect(end).toBeInstanceOf(Date);
    expect(start.getTime()).toBeLessThanOrEqual(end.getTime());
  },

  /**
   * Check schedule statistics
   */
  expectScheduleStats(schedule, expectedApartmentCount, expectedTotalDates) {
    const apartmentCount = Object.keys(schedule.dateAssignments || {}).length;
    const totalDates = Object.values(schedule.dateAssignments || {})
      .reduce((sum, dates) => sum + (dates?.length || 0), 0);
    
    expect(apartmentCount).toBe(expectedApartmentCount);
    expect(totalDates).toBe(expectedTotalDates);
  }
};

/**
 * Performance Testing Utilities
 */
export const PerformanceUtils = {
  /**
   * Measure execution time of a function
   */
  async measureTime(fn, label = 'Operation') {
    const startTime = performance.now();
    await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`${label} took ${duration.toFixed(2)}ms`);
    return duration;
  },

  /**
   * Test function performance with assertion
   */
  async expectPerformance(fn, maxDuration, label = 'Operation') {
    const duration = await this.measureTime(fn, label);
    expect(duration).toBeLessThan(maxDuration);
    return duration;
  },

  /**
   * Test memory usage (simplified)
   */
  measureMemory() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }
};

/**
 * Mock Service Utilities
 */
export const MockServices = {
  /**
   * Create mock ScheduleService
   */
  createScheduleService() {
    return {
      generateDates: jest.fn(),
      assignDatesToApartments: jest.fn(),
      createSchedule: jest.fn(),
      calculateDateAssignments: jest.fn()
    };
  },

  /**
   * Create mock PDFService
   */
  createPDFService() {
    return {
      generatePDF: jest.fn(),
      downloadPDF: jest.fn(),
      createDocument: jest.fn(),
      addPage: jest.fn(),
      save: jest.fn()
    };
  },

  /**
   * Create mock ApartmentManager
   */
  createApartmentManager() {
    return {
      getSelectedApartments: jest.fn(),
      setApartmentOrder: jest.fn(),
      updateDisplay: jest.fn(),
      handleDragDrop: jest.fn()
    };
  },

  /**
   * Create mock ScheduleRenderer
   */
  createScheduleRenderer() {
    return {
      render: jest.fn(),
      renderEmpty: jest.fn(),
      renderError: jest.fn(),
      updateInfo: jest.fn()
    };
  }
};

/**
 * Validation Utilities
 */
export const ValidationUtils = {
  /**
   * Validate date format
   */
  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  },

  /**
   * Validate apartment number format
   */
  isValidApartment(apartmentNumber) {
    return typeof apartmentNumber === 'string' && 
           apartmentNumber.trim().length > 0 &&
           /^\d+$/.test(apartmentNumber.trim());
  },

  /**
   * Validate schedule structure
   */
  isValidSchedule(schedule) {
    if (!schedule || typeof schedule !== 'object') return false;
    if (!schedule.dateAssignments || typeof schedule.dateAssignments !== 'object') return false;
    
    return Object.entries(schedule.dateAssignments).every(([apartment, dates]) => {
      return this.isValidApartment(apartment) && 
             Array.isArray(dates) &&
             dates.every(date => typeof date === 'string' && date.trim().length > 0);
    });
  },

  /**
   * Validate date range
   */
  isValidDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.isValidDate(startDate) && 
           this.isValidDate(endDate) && 
           start <= end;
  }
};

/**
 * Browser Environment Utilities
 */
export const BrowserUtils = {
  /**
   * Mock localStorage
   */
  mockLocalStorage() {
    const storage = {};
    return {
      getItem: jest.fn(key => storage[key] || null),
      setItem: jest.fn((key, value) => { storage[key] = value; }),
      removeItem: jest.fn(key => { delete storage[key]; }),
      clear: jest.fn(() => { Object.keys(storage).forEach(key => delete storage[key]); }),
      get length() { return Object.keys(storage).length; },
      key: jest.fn(index => Object.keys(storage)[index] || null)
    };
  },

  /**
   * Mock window object properties
   */
  mockWindow(properties = {}) {
    const originalWindow = global.window;
    
    Object.keys(properties).forEach(key => {
      Object.defineProperty(window, key, {
        writable: true,
        configurable: true,
        value: properties[key]
      });
    });
    
    return () => {
      global.window = originalWindow;
    };
  },

  /**
   * Mock viewport size
   */
  mockViewport(width, height) {
    return this.mockWindow({
      innerWidth: width,
      innerHeight: height
    });
  }
};

/**
 * Test Data Generators
 */
export const TestDataGenerator = {
  /**
   * Generate random apartment numbers
   */
  randomApartments(count = 5) {
    const apartments = [];
    for (let i = 0; i < count; i++) {
      const floor = Math.floor(Math.random() * 5) + 1;
      const unit = Math.floor(Math.random() * 4) + 1;
      apartments.push(`${floor}0${unit}`);
    }
    return [...new Set(apartments)]; // Remove duplicates
  },

  /**
   * Generate random date range
   */
  randomDateRange(daysFromNow = 0, rangeDays = 30) {
    const start = new Date();
    start.setDate(start.getDate() + daysFromNow);
    
    const end = new Date(start);
    end.setDate(start.getDate() + rangeDays);
    
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  },

  /**
   * Generate stress test data
   */
  stressTestData() {
    return {
      manyApartments: this.randomApartments(100),
      longDateRange: this.randomDateRange(0, 365),
      largeSchedule: MockData.createLargeSchedule(100, 50)
    };
  }
};

// Export all utilities as default
export default {
  DOMUtils,
  MockData,
  EventUtils,
  AssertionUtils,
  PerformanceUtils,
  MockServices,
  ValidationUtils,
  BrowserUtils,
  TestDataGenerator
};