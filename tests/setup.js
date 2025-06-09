import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Setup TextEncoder/TextDecoder for JSDOM compatibility
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Mock jsPDF for testing
global.jsPDF = jest.fn(() => ({
  setFontSize: jest.fn(),
  setFont: jest.fn(),
  setTextColor: jest.fn(),
  setFillColor: jest.fn(),
  setLineWidth: jest.fn(),
  text: jest.fn(),
  rect: jest.fn(),
  line: jest.fn(),
  addPage: jest.fn(),
  save: jest.fn(),
  splitTextToSize: jest.fn().mockReturnValue(['mock text']),
  internal: {
    pageSize: {
      getWidth: () => 210,
      getHeight: () => 297
    }
  }
}));

// Mock window.jsPDF
Object.defineProperty(window, 'jsPDF', {
  value: global.jsPDF,
  writable: true
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  info: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock Date to have consistent tests
const mockDate = new Date('2025-06-09T00:00:00.000Z');
const OriginalDate = Date;

// Only mock Date() constructor when called with no arguments
global.Date = class extends OriginalDate {
  constructor(...args) {
    if (args.length === 0) {
      super(mockDate.getTime());
    } else {
      super(...args);
    }
  }
  
  static now() {
    return mockDate.getTime();
  }
  
  // Preserve all static methods from original Date
  static parse(...args) {
    return OriginalDate.parse(...args);
  }
  
  static UTC(...args) {
    return OriginalDate.UTC(...args);
  }
};

// Preserve prototype methods
Object.setPrototypeOf(global.Date.prototype, OriginalDate.prototype);
Object.setPrototypeOf(global.Date, OriginalDate);