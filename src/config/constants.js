/**
 * Application Configuration
 * Contains all configuration constants used throughout the application
 */

export const CONFIG = {
  DATE_OPTIONS: { year: "numeric", month: "long", day: "numeric", hour12: false },
  LOCALE: "es",
  PDF_CONFIG: {
    PAGE_WIDTH: 210,
    PAGE_HEIGHT: 297,
    MARGIN: 15,
    MIN_TABLE_HEIGHT: 80,
    MAX_TABLE_HEIGHT: 120
  }
};

export const UI_CONSTANTS = {
  SELECTORS: {
    SCHEDULE_CONTENT: '#scheduleContent',
    SCHEDULE_INFO: '#scheduleInfo',
    APARTMENT_LIST: '#apartmentList',
    START_DATE: '#startDate',
    END_DATE: '#endDate',
    GENERATE_BTN: '#generateBtn',
    DOWNLOAD_BTN: '#downloadBtn'
  },
  CLASSES: {
    APARTMENT_ITEM: 'apartment-item',
    DRAGGING: 'dragging',
    DRAG_OVER: 'drag-over',
    ORDER_BTN: 'order-btn',
    POSITION_INDICATOR: 'position-indicator'
  }
};