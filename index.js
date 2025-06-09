/**
 * Building Schedule Manager - Standalone Version
 * This version works without ES6 modules for direct file access
 */

console.info('✅ Loading standalone version for file:// protocol');

// Configuration constants
const CONFIG = {
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

/**
 * Manages apartment schedules and date calculations
 */
class ScheduleManager {
  constructor(selectedApartments = [301, 202, 201, 302]) {
    this.apartments = selectedApartments;
  }

  /**
   * Get all Sundays between start and end date
   */
  getSundaysInRange(startDate, endDate) {
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
   * Distribute dates among apartments in rotation
   */
  generateSchedule(startDate, endDate) {
    const dates = this.getSundaysInRange(startDate, endDate);
    const schedule = {};

    // Initialize empty arrays for each apartment
    this.apartments.forEach(apt => {
      schedule[apt] = [];
    });

    // Distribute dates in rotation
    dates.forEach((date, index) => {
      const apartmentIndex = index % this.apartments.length;
      const apartment = this.apartments[apartmentIndex];
      schedule[apartment].push(date);
    });

    return schedule;
  }
}

/**
 * Handles UI rendering and updates
 */
class UIRenderer {
  constructor() {
    this.scheduleContainer = document.getElementById("scheduleContent");
    this.scheduleInfo = document.getElementById('scheduleInfo');
  }

  /**
   * Render the complete schedule view
   */
  renderSchedule(schedules) {
    this.clearContainer();
    this.updateScheduleInfo(schedules);

    if (this.isEmpty(schedules)) {
      this.renderEmptyState();
      return;
    }

    this.renderApartmentTables(schedules);
  }

  /**
   * Clear the schedule container
   */
  clearContainer() {
    this.scheduleContainer.innerHTML = '';
  }

  /**
   * Check if schedules object is empty
   */
  isEmpty(schedules) {
    return Object.keys(schedules).length === 0;
  }

  /**
   * Render empty state when no apartments selected
   */
  renderEmptyState() {
    this.scheduleContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #666;">
        <i class="fas fa-info-circle" style="font-size: 3rem; margin-bottom: 1rem; color: #ccc;"></i>
        <h3 style="margin-bottom: 1rem; color: #999;">No hay apartamentos seleccionados</h3>
        <p>Selecciona al menos un apartamento en el panel de configuración para generar las escalas.</p>
      </div>
    `;
  }

  /**
   * Render individual apartment tables
   */
  renderApartmentTables(schedules) {
    Object.entries(schedules).forEach(([apartment, dates]) => {
      const tableElement = this.createApartmentTable(apartment, dates);
      this.scheduleContainer.appendChild(tableElement);
    });
  }

  /**
   * Create a single apartment table element
   */
  createApartmentTable(apartment, dates) {
    const container = document.createElement("div");
    container.className = "apartment-table";

    const header = this.createTableHeader(apartment);
    const dateList = this.createDateList(dates);

    container.appendChild(header);
    container.appendChild(dateList);

    return container;
  }

  /**
   * Create table header for apartment
   */
  createTableHeader(apartment) {
    const header = document.createElement("h3");
    header.innerHTML = `<i class="fas fa-home"></i> APARTAMENTO ${apartment}`;
    return header;
  }

  /**
   * Create the list of dates for an apartment
   */
  createDateList(dates) {
    const dateList = document.createElement("ul");

    if (dates.length === 0) {
      dateList.appendChild(this.createEmptyDateItem());
    } else {
      dates.forEach((date, index) => {
        dateList.appendChild(this.createDateItem(date, index + 1));
      });
    }

    return dateList;
  }

  /**
   * Create empty date item when no dates assigned
   */
  createEmptyDateItem() {
    const item = document.createElement("li");
    item.textContent = "No hay fechas asignadas en este período";
    item.style.fontStyle = "italic";
    item.style.color = "#999";
    return item;
  }

  /**
   * Create individual date item
   */
  createDateItem(date, position) {
    const item = document.createElement("li");
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>${date}</span>
        <small style="color: #666; font-size: 0.8rem;">#${position}</small>
      </div>
    `;
    return item;
  }

  /**
   * Update schedule information in header
   */
  updateScheduleInfo(schedules) {
    if (!this.scheduleInfo) return;

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const stats = this.calculateScheduleStats(schedules);

    const dateRange = this.formatDateRange(startDate, endDate);
    const countInfo = this.formatCountInfo(stats);

    this.scheduleInfo.innerHTML = `
      <div class="schedule-dates">
        <i class="fas fa-calendar-alt"></i>
        ${dateRange}
      </div>
      <div class="schedule-count">
        ${countInfo}
      </div>
    `;
  }

  /**
   * Calculate statistics for schedule
   */
  calculateScheduleStats(schedules) {
    const apartmentCount = Object.keys(schedules).length;
    const totalDates = Object.values(schedules).reduce((sum, dates) => sum + dates.length, 0);
    return { apartmentCount, totalDates };
  }

  /**
   * Format date range for display
   */
  formatDateRange(startDate, endDate) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString('es-ES', options);
    const end = new Date(endDate).toLocaleDateString('es-ES', options);
    return `${start} - ${end}`;
  }

  /**
   * Format count information for display
   */
  formatCountInfo({ apartmentCount, totalDates }) {
    const apartmentText = apartmentCount !== 1 ? 's' : '';
    const datesText = totalDates !== 1 ? 's' : '';
    const totalText = totalDates !== 1 ? 'es' : '';

    return `
      <i class="fas fa-home"></i>
      ${apartmentCount} apartamento${apartmentText} • 
      <i class="fas fa-list"></i>
      ${totalDates} fecha${datesText} total${totalText}
    `;
  }
}

/**
 * Manages apartment ordering and selection
 */
class ApartmentManager {
  constructor() {
    this.apartmentList = document.getElementById('apartmentList');
    this.setupEventListeners();
  }

  /**
   * Setup all event listeners for apartment management
   */
  setupEventListeners() {
    this.setupDragAndDrop();
    this.setupOrderButtons();
    this.setupCheckboxes();
    this.setupKeyboardShortcuts();
    this.preventDragOnInteractiveElements();
    this.updatePositionIndicators();
  }

  /**
   * Get currently selected apartments in order
   */
  getSelectedApartments() {
    const apartmentItems = document.querySelectorAll('.apartment-item');
    return Array.from(apartmentItems)
      .filter(item => item.querySelector('input[type="checkbox"]').checked)
      .map(item => parseInt(item.querySelector('input[type="checkbox"]').value));
  }

  /**
   * Update position indicators for all apartments
   */
  updatePositionIndicators() {
    const apartmentItems = document.querySelectorAll('.apartment-item');
    apartmentItems.forEach((item, index) => {
      const indicator = item.querySelector('.position-indicator');
      if (indicator) {
        indicator.textContent = index + 1;
      }
    });
  }

  /**
   * Move apartment up or down in the list
   */
  moveApartment(apartmentItem, direction) {
    const parent = apartmentItem.parentNode;
    
    if (direction === 'up' && apartmentItem.previousElementSibling) {
      parent.insertBefore(apartmentItem, apartmentItem.previousElementSibling);
    } else if (direction === 'down' && apartmentItem.nextElementSibling) {
      parent.insertBefore(apartmentItem.nextElementSibling, apartmentItem);
    }
    
    this.updatePositionIndicators();
  }

  /**
   * Setup drag and drop functionality
   */
  setupDragAndDrop() {
    let draggedElement = null;

    this.apartmentList.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('apartment-item')) {
        draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    this.apartmentList.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('apartment-item')) {
        e.target.classList.remove('dragging');
        this.clearDragOverClasses();
        draggedElement = null;
        this.updatePositionIndicators();
        this.triggerScheduleUpdate();
      }
    });

    this.apartmentList.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      this.handleDragOver(e);
    });

    this.apartmentList.addEventListener('drop', (e) => {
      e.preventDefault();
      this.handleDrop(e);
      this.clearDragOverClasses();
    });
  }

  /**
   * Handle drag over events
   */
  handleDragOver(e) {
    const afterElement = this.getDragAfterElement(e.clientY);
    const dragging = document.querySelector('.dragging');
    
    this.clearDragOverClasses();
    
    if (afterElement == null) {
      if (dragging && this.apartmentList.lastElementChild !== dragging) {
        this.apartmentList.lastElementChild.classList.add('drag-over');
      }
    } else if (dragging && afterElement !== dragging) {
      afterElement.classList.add('drag-over');
    }
  }

  /**
   * Handle drop events
   */
  handleDrop(e) {
    const afterElement = this.getDragAfterElement(e.clientY);
    const dragging = document.querySelector('.dragging');
    
    if (dragging) {
      if (afterElement == null) {
        this.apartmentList.appendChild(dragging);
      } else {
        this.apartmentList.insertBefore(dragging, afterElement);
      }
    }
  }

  /**
   * Clear drag-over classes from all items
   */
  clearDragOverClasses() {
    document.querySelectorAll('.apartment-item').forEach(item => {
      item.classList.remove('drag-over');
    });
  }

  /**
   * Determine where to drop the element
   */
  getDragAfterElement(y) {
    const draggableElements = [...this.apartmentList.querySelectorAll('.apartment-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  /**
   * Setup order button event listeners
   */
  setupOrderButtons() {
    this.apartmentList.addEventListener('click', (e) => {
      const button = e.target.closest('.order-btn');
      if (button) {
        const direction = button.dataset.direction;
        const apartmentItem = button.closest('.apartment-item');
        
        this.moveApartment(apartmentItem, direction);
        this.addVisualFeedback(apartmentItem);
        this.triggerScheduleUpdate();
      }
    });
  }

  /**
   * Setup checkbox event listeners
   */
  setupCheckboxes() {
    this.apartmentList.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        const apartmentItem = e.target.closest('.apartment-item');
        this.addCheckboxFeedback(apartmentItem, e.target.checked);
        this.triggerScheduleUpdate();
      }
    });
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        const focusedItem = document.querySelector('.apartment-item:focus-within');
        if (focusedItem) {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.moveApartment(focusedItem, 'up');
            this.triggerScheduleUpdate();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.moveApartment(focusedItem, 'down');
            this.triggerScheduleUpdate();
          }
        }
      }
    });
  }

  /**
   * Add visual feedback for apartment movement
   */
  addVisualFeedback(apartmentItem) {
    apartmentItem.style.transform = 'scale(1.05)';
    setTimeout(() => {
      apartmentItem.style.transform = '';
    }, 200);
  }

  /**
   * Add visual feedback for checkbox changes
   */
  addCheckboxFeedback(apartmentItem, checked) {
    apartmentItem.style.borderColor = checked ? '#4caf50' : '#f44336';
    setTimeout(() => {
      apartmentItem.style.borderColor = '';
    }, 500);
  }

  /**
   * Trigger schedule update
   */
  triggerScheduleUpdate() {
    // This will be connected to the main app
    if (window.scheduleApp) {
      window.scheduleApp.generateSchedule();
    }
  }

  /**
   * Prevent dragging when clicking interactive elements
   */
  preventDragOnInteractiveElements() {
    this.apartmentList.addEventListener('mousedown', (e) => {
      if (e.target.type === 'checkbox' || e.target.closest('.order-btn')) {
        const apartmentItem = e.target.closest('.apartment-item');
        if (apartmentItem) {
          apartmentItem.draggable = false;
          setTimeout(() => {
            apartmentItem.draggable = true;
          }, 100);
        }
      }
    });
  }
}

/**
 * Handles PDF generation
 */
class PDFGenerator {
  constructor() {
    this.config = CONFIG.PDF_CONFIG;
  }

  /**
   * Generate and download PDF
   */
  generatePDF(schedules, startDate, endDate) {
    if (Object.keys(schedules).length === 0) {
      alert('Selecciona al menos un apartamento para generar el PDF');
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      this.addTitle(doc);
      this.addApartmentTables(doc, schedules);
      this.addNote(doc);
      this.savePDF(doc, startDate, endDate);
      
      this.showSuccessMessage('PDF generado correctamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  }

  /**
   * Add title to PDF
   */
  addTitle(doc) {
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('LAVADA DE ESCALAS', 105, 20, { align: 'center' });
  }

  /**
   * Add apartment tables to PDF
   */
  addApartmentTables(doc, schedules) {
    const apartmentCount = Object.keys(schedules).length;
    const columns = apartmentCount <= 2 ? apartmentCount : 2;
    const maxDates = Math.max(...Object.values(schedules).map(dates => dates.length));
    
    const tableWidth = (this.config.PAGE_WIDTH - (this.config.MARGIN * 2) - 10) / columns;
    const tableHeight = Math.max(
      this.config.MIN_TABLE_HEIGHT, 
      Math.min(this.config.MAX_TABLE_HEIGHT, 20 + (maxDates * 6))
    );

    let apartmentIndex = 0;
    const currentY = 40;

    Object.entries(schedules).forEach(([apartment, dates]) => {
      const position = this.calculateTablePosition(apartmentIndex, columns, tableWidth, tableHeight, currentY);
      
      if (this.needsNewPage(position.y, tableHeight)) {
        doc.addPage();
        this.addTitle(doc);
        apartmentIndex = 0;
        const newPosition = this.calculateTablePosition(0, columns, tableWidth, tableHeight, 40);
        this.drawApartmentTable(doc, apartment, dates, newPosition.x, newPosition.y, tableWidth, tableHeight);
      } else {
        this.drawApartmentTable(doc, apartment, dates, position.x, position.y, tableWidth, tableHeight);
      }
      
      apartmentIndex++;
    });
  }

  /**
   * Calculate table position on page
   */
  calculateTablePosition(apartmentIndex, columns, tableWidth, tableHeight, startY) {
    const col = apartmentIndex % columns;
    const row = Math.floor(apartmentIndex / columns);
    
    return {
      x: this.config.MARGIN + (col * (tableWidth + 5)),
      y: startY + (row * (tableHeight + 15))
    };
  }

  /**
   * Check if new page is needed
   */
  needsNewPage(y, tableHeight) {
    return y + tableHeight > this.config.PAGE_HEIGHT - 60;
  }

  /**
   * Draw individual apartment table
   */
  drawApartmentTable(doc, apartment, dates, x, y, width, height) {
    // Draw borders and background
    this.drawTableBorders(doc, x, y, width, height);
    this.drawTableHeader(doc, apartment, x, y, width);
    this.drawTableDates(doc, dates, x, y, width, height);
  }

  /**
   * Draw table borders
   */
  drawTableBorders(doc, x, y, width, height) {
    doc.setLineWidth(0.5);
    doc.rect(x, y, width, height);
    
    doc.setFillColor(240, 240, 240);
    doc.rect(x, y, width, 12, 'F');
    
    doc.setLineWidth(0.3);
    doc.line(x, y + 12, x + width, y + 12);
  }

  /**
   * Draw table header
   */
  drawTableHeader(doc, apartment, x, y, width) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`APARTAMENTO ${apartment}`, x + width/2, y + 8, { align: 'center' });
  }

  /**
   * Draw table dates
   */
  drawTableDates(doc, dates, x, y, width, height) {
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    
    const dateStartY = y + 18;
    const lineHeight = 6;
    const maxLines = Math.floor((height - 18) / lineHeight);
    
    dates.slice(0, maxLines).forEach((date, index) => {
      const dateY = dateStartY + (index * lineHeight);
      
      if (index % 2 === 1) {
        doc.setFillColor(250, 250, 250);
        doc.rect(x + 1, dateY - 3, width - 2, lineHeight, 'F');
      }
      
      doc.text(date, x + 4, dateY, { maxWidth: width - 8 });
    });
    
    if (dates.length > maxLines) {
      const lastY = dateStartY + (maxLines * lineHeight);
      doc.setFont(undefined, 'italic');
      doc.text('...', x + width/2, lastY, { align: 'center' });
    }
  }

  /**
   * Add note to PDF
   */
  addNote(doc) {
    const noteY = this.config.PAGE_HEIGHT - 40;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Nota:', this.config.MARGIN, noteY);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    const noteText = 'Mantener las escalas aseadas nos beneficia a todos. Muchas gracias';
    const usableWidth = this.config.PAGE_WIDTH - (this.config.MARGIN * 2);
    const splitNote = doc.splitTextToSize(noteText, usableWidth);
    doc.text(splitNote, this.config.MARGIN, noteY + 6);
  }

  /**
   * Save PDF with formatted filename
   */
  savePDF(doc, startDate, endDate) {
    const startFormatted = new Date(startDate).toLocaleDateString('es-ES');
    const endFormatted = new Date(endDate).toLocaleDateString('es-ES');
    const fileName = `escalas_${startFormatted}_al_${endFormatted}.pdf`;
    doc.save(fileName);
  }

  /**
   * Show success message
   */
  showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.style.opacity = '1', 100);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }
}

/**
 * Main application controller
 */
class ScheduleApp {
  constructor() {
    this.scheduleManager = null;
    this.uiRenderer = new UIRenderer();
    this.apartmentManager = new ApartmentManager();
    this.pdfGenerator = new PDFGenerator();
    this.initializeApp();
  }

  /**
   * Initialize the application
   */
  initializeApp() {
    this.setupEventListeners();
    this.setupScrollObserver();
    
    // Make app globally available for apartment manager
    window.scheduleApp = this;
    
    // Generate initial schedule
    setTimeout(() => {
      this.generateSchedule();
    }, 100);
  }

  /**
   * Setup main event listeners
   */
  setupEventListeners() {
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    generateBtn.addEventListener('click', () => {
      this.addButtonFeedback(generateBtn);
      this.generateSchedule();
    });

    downloadBtn.addEventListener('click', () => {
      this.addButtonFeedback(downloadBtn);
      this.downloadPDF();
    });

    startDateInput.addEventListener('change', () => this.generateSchedule());
    endDateInput.addEventListener('change', () => this.generateSchedule());
  }

  /**
   * Generate schedule based on current selections
   */
  generateSchedule() {
    const selectedApartments = this.apartmentManager.getSelectedApartments();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    this.scheduleManager = new ScheduleManager(selectedApartments);
    const schedules = selectedApartments.length > 0 
      ? this.scheduleManager.generateSchedule(startDate, endDate)
      : {};

    this.uiRenderer.renderSchedule(schedules);
  }

  /**
   * Download PDF of current schedule
   */
  downloadPDF() {
    const selectedApartments = this.apartmentManager.getSelectedApartments();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (selectedApartments.length === 0) {
      alert('Selecciona al menos un apartamento para generar el PDF');
      return;
    }

    const scheduleManager = new ScheduleManager(selectedApartments);
    const schedules = scheduleManager.generateSchedule(startDate, endDate);
    
    this.pdfGenerator.generatePDF(schedules, startDate, endDate);
  }

  /**
   * Add visual feedback to buttons
   */
  addButtonFeedback(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }

  /**
   * Setup scroll observer for schedule content
   */
  setupScrollObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target.id === 'scheduleContent') {
          const scheduleContent = document.getElementById('scheduleContent');
          if (scheduleContent) {
            scheduleContent.scrollTop = 0;
          }
        }
      });
    });

    const scheduleContent = document.getElementById('scheduleContent');
    if (scheduleContent) {
      observer.observe(scheduleContent, { childList: true });
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ScheduleApp();
});

// Fallback initialization for immediate execution
if (document.readyState !== 'loading') {
  setTimeout(() => {
    if (!window.scheduleApp) {
      new ScheduleApp();
    }
  }, 100);
}