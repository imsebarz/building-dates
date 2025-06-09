import { UI_CONSTANTS } from '../config/constants.js';

/**
 * Schedule Renderer
 * Handles rendering of schedule tables and information
 */
export class ScheduleRenderer {
  constructor() {
    this.scheduleContainer = document.querySelector(UI_CONSTANTS.SELECTORS.SCHEDULE_CONTENT);
    this.scheduleInfo = document.querySelector(UI_CONSTANTS.SELECTORS.SCHEDULE_INFO);
  }

  /**
   * Render the complete schedule view
   */
  render(schedule) {
    this._clearContainer();
    this._updateScheduleInfo(schedule);

    if (!schedule || !schedule.dateAssignments || Object.keys(schedule.dateAssignments).length === 0) {
      this._renderEmptyState();
      return;
    }

    this._renderApartmentTables(schedule.dateAssignments);
  }

  /**
   * Clear the schedule container
   */
  _clearContainer() {
    if (this.scheduleContainer) {
      this.scheduleContainer.innerHTML = '';
    }
  }

  /**
   * Render empty state when no apartments selected
   */
  _renderEmptyState() {
    if (!this.scheduleContainer) return;
    
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
  _renderApartmentTables(schedules) {
    Object.entries(schedules).forEach(([apartment, dates]) => {
      const tableElement = this._createApartmentTable(apartment, dates);
      this.scheduleContainer.appendChild(tableElement);
    });
  }

  /**
   * Create a single apartment table element
   */
  _createApartmentTable(apartment, dates) {
    const container = document.createElement("div");
    container.className = "apartment-table";

    const header = this._createTableHeader(apartment);
    const dateList = this._createDateList(dates);

    container.appendChild(header);
    container.appendChild(dateList);

    return container;
  }

  /**
   * Create table header for apartment
   */
  _createTableHeader(apartment) {
    const header = document.createElement("h3");
    header.innerHTML = `<i class="fas fa-home"></i> APARTAMENTO ${apartment}`;
    return header;
  }

  /**
   * Create the list of dates for an apartment
   */
  _createDateList(dates) {
    const dateList = document.createElement("ul");

    if (dates.length === 0) {
      dateList.appendChild(this._createEmptyDateItem());
    } else {
      dates.forEach((date, index) => {
        dateList.appendChild(this._createDateItem(date, index + 1));
      });
    }

    return dateList;
  }

  /**
   * Create empty date item when no dates assigned
   */
  _createEmptyDateItem() {
    const item = document.createElement("li");
    item.textContent = "No hay fechas asignadas en este período";
    item.style.fontStyle = "italic";
    item.style.color = "#999";
    return item;
  }

  /**
   * Create individual date item
   */
  _createDateItem(date, position) {
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
  _updateScheduleInfo(schedule) {
    if (!this.scheduleInfo) return;

    const startDate = document.querySelector(UI_CONSTANTS.SELECTORS.START_DATE)?.value;
    const endDate = document.querySelector(UI_CONSTANTS.SELECTORS.END_DATE)?.value;
    
    if (!startDate || !endDate) {
      this.scheduleInfo.innerHTML = '<div class="schedule-info-empty">Selecciona fechas para ver información</div>';
      return;
    }

    if (!schedule || !schedule.dateAssignments || Object.keys(schedule.dateAssignments).length === 0) {
      const dateRange = this._formatDateRange(startDate, endDate);
      this.scheduleInfo.innerHTML = `
        <div class="schedule-dates">
          <i class="fas fa-calendar-alt"></i>
          ${dateRange}
        </div>
        <div class="schedule-count">
          <i class="fas fa-info-circle"></i>
          No hay apartamentos seleccionados
        </div>
      `;
      return;
    }

    const stats = schedule.getStats();
    const dateRange = this._formatDateRange(startDate, endDate);
    const countInfo = this._formatCountInfo(stats);

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
   * Format date range for display
   */
  _formatDateRange(startDate, endDate) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString('es-ES', options);
    const end = new Date(endDate).toLocaleDateString('es-ES', options);
    return `${start} - ${end}`;
  }

  /**
   * Format count information for display
   */
  _formatCountInfo({ apartmentCount, totalDates }) {
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