import { UI_CONSTANTS } from './config/constants.js';
import { ScheduleService } from './services/ScheduleService.js';
import { PDFService } from './services/PDFService.js';
import { ScheduleRenderer } from './ui/ScheduleRenderer.js';
import { ApartmentManager } from './ui/ApartmentManager.js';
import { UIUtils } from './utils/index.js';

/**
 * Building Schedule Application
 * Main application controller that coordinates all components
 */
class ScheduleApp {
  constructor() {
    this.currentSchedule = null;
    this.scheduleRenderer = new ScheduleRenderer();
    this.apartmentManager = new ApartmentManager(() => this.generateSchedule());
    this.pdfService = new PDFService();
    
    this._initializeApp();
  }

  /**
   * Initialize the application
   */
  _initializeApp() {
    this._setupEventListeners();
    this._setupScrollObserver();
    this.generateSchedule();
  }

  /**
   * Setup main event listeners
   */
  _setupEventListeners() {
    const generateBtn = document.querySelector(UI_CONSTANTS.SELECTORS.GENERATE_BTN);
    const downloadBtn = document.querySelector(UI_CONSTANTS.SELECTORS.DOWNLOAD_BTN);
    const startDateInput = document.querySelector(UI_CONSTANTS.SELECTORS.START_DATE);
    const endDateInput = document.querySelector(UI_CONSTANTS.SELECTORS.END_DATE);

    generateBtn?.addEventListener('click', () => {
      UIUtils.addButtonFeedback(generateBtn);
      this.generateSchedule();
    });

    downloadBtn?.addEventListener('click', () => {
      UIUtils.addButtonFeedback(downloadBtn);
      this.downloadPDF();
    });

    startDateInput?.addEventListener('change', () => this.generateSchedule());
    endDateInput?.addEventListener('change', () => this.generateSchedule());
  }

  /**
   * Generate schedule based on current selections
   */
  generateSchedule() {
    try {
      const selectedApartments = this.apartmentManager.getSelectedApartments();
      const startDate = document.querySelector(UI_CONSTANTS.SELECTORS.START_DATE)?.value;
      const endDate = document.querySelector(UI_CONSTANTS.SELECTORS.END_DATE)?.value;

      if (!startDate || !endDate) {
        UIUtils.showErrorMessage('Por favor selecciona las fechas de inicio y fin');
        this.scheduleRenderer.render(null);
        return;
      }

      // Validate date range
      ScheduleService.validateDateRange(startDate, endDate);

      if (selectedApartments.length > 0) {
        this.currentSchedule = ScheduleService.generateSchedule(selectedApartments, startDate, endDate);
      } else {
        this.currentSchedule = null;
      }

      this.scheduleRenderer.render(this.currentSchedule);
      
      // Show debug info in console
      console.log('Schedule generated:', {
        apartments: selectedApartments,
        schedule: this.currentSchedule,
        dateRange: `${startDate} - ${endDate}`
      });
      
    } catch (error) {
      console.error('Error generating schedule:', error);
      UIUtils.showErrorMessage(error.message);
      this.scheduleRenderer.render(null);
    }
  }

  /**
   * Download PDF of current schedule
   */
  downloadPDF() {
    try {
      const selectedApartments = this.apartmentManager.getSelectedApartments();
      const startDate = document.querySelector(UI_CONSTANTS.SELECTORS.START_DATE)?.value;
      const endDate = document.querySelector(UI_CONSTANTS.SELECTORS.END_DATE)?.value;

      if (selectedApartments.length === 0) {
        UIUtils.showErrorMessage('Selecciona al menos un apartamento para generar el PDF');
        return;
      }

      if (!startDate || !endDate) {
        UIUtils.showErrorMessage('Por favor selecciona las fechas de inicio y fin');
        return;
      }

      const schedule = ScheduleService.generateSchedule(selectedApartments, startDate, endDate);
      this.pdfService.generatePDF(schedule, startDate, endDate);
      
      UIUtils.showSuccessMessage('PDF generado correctamente');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      UIUtils.showErrorMessage(error.message);
    }
  }

  /**
   * Setup scroll observer for schedule content
   */
  _setupScrollObserver() {
    UIUtils.setupScrollObserver('scheduleContent');
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ScheduleApp();
});