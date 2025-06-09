import { CONFIG } from '../config/constants.js';

/**
 * PDF Service
 * Handles PDF generation functionality
 */
export class PDFService {
  constructor() {
    this.config = CONFIG.PDF_CONFIG;
  }

  /**
   * Generate and download PDF
   */
  generatePDF(schedule, startDate, endDate) {
    if (!schedule || Object.keys(schedule.dateAssignments).length === 0) {
      throw new Error('Selecciona al menos un apartamento para generar el PDF');
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      this._addTitle(doc);
      this._addApartmentTables(doc, schedule.dateAssignments);
      this._addNote(doc);
      this._savePDF(doc, startDate, endDate);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  }

  /**
   * Add title to PDF
   */
  _addTitle(doc) {
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('LAVADA DE ESCALAS', 105, 20, { align: 'center' });
  }

  /**
   * Add apartment tables to PDF
   */
  _addApartmentTables(doc, schedules) {
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
      const position = this._calculateTablePosition(apartmentIndex, columns, tableWidth, tableHeight, currentY);
      
      if (this._needsNewPage(position.y, tableHeight)) {
        doc.addPage();
        this._addTitle(doc);
        apartmentIndex = 0;
        const newPosition = this._calculateTablePosition(0, columns, tableWidth, tableHeight, 40);
        this._drawApartmentTable(doc, apartment, dates, newPosition.x, newPosition.y, tableWidth, tableHeight);
      } else {
        this._drawApartmentTable(doc, apartment, dates, position.x, position.y, tableWidth, tableHeight);
      }
      
      apartmentIndex++;
    });
  }

  /**
   * Calculate table position on page
   */
  _calculateTablePosition(apartmentIndex, columns, tableWidth, tableHeight, startY) {
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
  _needsNewPage(y, tableHeight) {
    return y + tableHeight > this.config.PAGE_HEIGHT - 60;
  }

  /**
   * Draw individual apartment table
   */
  _drawApartmentTable(doc, apartment, dates, x, y, width, height) {
    this._drawTableBorders(doc, x, y, width, height);
    this._drawTableHeader(doc, apartment, x, y, width);
    this._drawTableDates(doc, dates, x, y, width, height);
  }

  /**
   * Draw table borders
   */
  _drawTableBorders(doc, x, y, width, height) {
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
  _drawTableHeader(doc, apartment, x, y, width) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`APARTAMENTO ${apartment}`, x + width/2, y + 8, { align: 'center' });
  }

  /**
   * Draw table dates
   */
  _drawTableDates(doc, dates, x, y, width, height) {
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
  _addNote(doc) {
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
  _savePDF(doc, startDate, endDate) {
    const startFormatted = new Date(startDate).toLocaleDateString('es-ES');
    const endFormatted = new Date(endDate).toLocaleDateString('es-ES');
    const fileName = `escalas_${startFormatted}_al_${endFormatted}.pdf`;
    doc.save(fileName);
  }
}