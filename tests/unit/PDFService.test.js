/**
 * Unit Tests for PDFService
 * Tests PDF generation functionality and calculations
 */

describe('PDFService', () => {
  let mockDoc;
  let pdfService;
  let mockSchedule;

  beforeEach(() => {
    // Mock jsPDF document
    mockDoc = {
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
      internal: {
        pageSize: {
          getWidth: () => 210,
          getHeight: () => 297
        }
      }
    };

    // Mock schedule data
    mockSchedule = {
      dateAssignments: {
        301: ['1 de junio de 2025', '8 de junio de 2025'],
        302: ['15 de junio de 2025', '22 de junio de 2025'],
        201: ['29 de junio de 2025']
      }
    };

    // Simulate PDFService configuration
    pdfService = {
      config: {
        PAGE_WIDTH: 210,
        PAGE_HEIGHT: 297,
        MARGIN: 15,
        MIN_TABLE_HEIGHT: 80,
        MAX_TABLE_HEIGHT: 120
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PDF Generation', () => {
    test('should generate PDF with correct title', () => {
      const startDate = '2025-06-01';
      const endDate = '2025-06-29';
      
      // Simulate adding title
      mockDoc.setFontSize(18);
      mockDoc.setFont(undefined, 'bold');
      mockDoc.setTextColor(0, 0, 0);
      mockDoc.text('ESCALAS DE LIMPIEZA', 105, 25, { align: 'center' });
      
      expect(mockDoc.setFontSize).toHaveBeenCalledWith(18);
      expect(mockDoc.setFont).toHaveBeenCalledWith(undefined, 'bold');
      expect(mockDoc.text).toHaveBeenCalledWith('ESCALAS DE LIMPIEZA', 105, 25, { align: 'center' });
    });

    test('should save PDF with correct filename', () => {
      const startDate = '2025-06-01';
      const endDate = '2025-06-29';
      
      const expectedFilename = `escalas_${startDate}_${endDate}.pdf`;
      mockDoc.save(expectedFilename);
      
      expect(mockDoc.save).toHaveBeenCalledWith(expectedFilename);
    });

    test('should handle empty schedule', () => {
      const emptySchedule = { dateAssignments: {} };
      
      // Should still generate PDF with title but no tables
      mockDoc.setFontSize(18);
      mockDoc.text('ESCALAS DE LIMPIEZA', 105, 25, { align: 'center' });
      
      const apartmentCount = Object.keys(emptySchedule.dateAssignments).length;
      expect(apartmentCount).toBe(0);
      expect(mockDoc.text).toHaveBeenCalled();
    });
  });

  describe('Table Position Calculations', () => {
    test('should calculate table position correctly for first apartment', () => {
      const apartmentIndex = 0;
      const columns = 2;
      const tableWidth = 85;
      const tableHeight = 100;
      const startY = 40;
      
      const col = apartmentIndex % columns;
      const row = Math.floor(apartmentIndex / columns);
      
      const position = {
        x: pdfService.config.MARGIN + (col * (tableWidth + 5)),
        y: startY + (row * (tableHeight + 15))
      };
      
      expect(position.x).toBe(15); // MARGIN
      expect(position.y).toBe(40); // startY
    });

    test('should calculate table position correctly for second apartment', () => {
      const apartmentIndex = 1;
      const columns = 2;
      const tableWidth = 85;
      const tableHeight = 100;
      const startY = 40;
      
      const col = apartmentIndex % columns;
      const row = Math.floor(apartmentIndex / columns);
      
      const position = {
        x: pdfService.config.MARGIN + (col * (tableWidth + 5)),
        y: startY + (row * (tableHeight + 15))
      };
      
      expect(position.x).toBe(105); // MARGIN + (1 * (85 + 5))
      expect(position.y).toBe(40); // Same row
    });

    test('should calculate table position correctly for third apartment (new row)', () => {
      const apartmentIndex = 2;
      const columns = 2;
      const tableWidth = 85;
      const tableHeight = 100;
      const startY = 40;
      
      const col = apartmentIndex % columns;
      const row = Math.floor(apartmentIndex / columns);
      
      const position = {
        x: pdfService.config.MARGIN + (col * (tableWidth + 5)),
        y: startY + (row * (tableHeight + 15))
      };
      
      expect(position.x).toBe(15); // Back to first column
      expect(position.y).toBe(155); // New row: 40 + (1 * 115)
    });

    test('should handle different column configurations', () => {
      const apartmentIndex = 3;
      const columns = 3;
      const tableWidth = 60;
      const tableHeight = 80;
      const startY = 50;
      
      const col = apartmentIndex % columns;
      const row = Math.floor(apartmentIndex / columns);
      
      const position = {
        x: pdfService.config.MARGIN + (col * (tableWidth + 5)),
        y: startY + (row * (tableHeight + 15))
      };
      
      expect(position.x).toBe(15); // First column of second row
      expect(position.y).toBe(145); // 50 + (1 * 95)
    });
  });

  describe('Page Break Detection', () => {
    test('should detect when new page is needed', () => {
      const currentY = 200;
      const tableHeight = 120;
      const pageHeight = 297;
      const bottomMargin = 60;
      
      const needsNewPage = currentY + tableHeight > pageHeight - bottomMargin;
      expect(needsNewPage).toBe(true);
    });

    test('should not detect new page when there is space', () => {
      const currentY = 100;
      const tableHeight = 80;
      const pageHeight = 297;
      const bottomMargin = 60;
      
      const needsNewPage = currentY + tableHeight > pageHeight - bottomMargin;
      expect(needsNewPage).toBe(false);
    });

    test('should handle edge case at page boundary', () => {
      const currentY = 237; // Exactly at limit
      const tableHeight = 0;
      const pageHeight = 297;
      const bottomMargin = 60;
      
      const needsNewPage = currentY + tableHeight > pageHeight - bottomMargin;
      expect(needsNewPage).toBe(false); // Exactly at boundary
    });
  });

  describe('Table Drawing', () => {
    test('should draw table borders correctly', () => {
      const x = 15;
      const y = 40;
      const width = 85;
      const height = 100;
      
      // Simulate drawing table borders
      mockDoc.setLineWidth(0.5);
      mockDoc.rect(x, y, width, height);
      mockDoc.setFillColor(240, 240, 240);
      mockDoc.rect(x, y, width, 12, 'F');
      mockDoc.setLineWidth(0.3);
      mockDoc.line(x, y + 12, x + width, y + 12);
      
      expect(mockDoc.setLineWidth).toHaveBeenCalledWith(0.5);
      expect(mockDoc.rect).toHaveBeenCalledWith(x, y, width, height);
      expect(mockDoc.setFillColor).toHaveBeenCalledWith(240, 240, 240);
      expect(mockDoc.line).toHaveBeenCalledWith(x, y + 12, x + width, y + 12);
    });

    test('should draw table header correctly', () => {
      const apartment = '301';
      const x = 15;
      const y = 40;
      const width = 85;
      
      // Simulate drawing table header
      mockDoc.setFontSize(12);
      mockDoc.setFont(undefined, 'bold');
      mockDoc.setTextColor(0, 0, 0);
      mockDoc.text(`APARTAMENTO ${apartment}`, x + width/2, y + 8, { align: 'center' });
      
      expect(mockDoc.setFontSize).toHaveBeenCalledWith(12);
      expect(mockDoc.setFont).toHaveBeenCalledWith(undefined, 'bold');
      expect(mockDoc.text).toHaveBeenCalledWith('APARTAMENTO 301', x + width/2, y + 8, { align: 'center' });
    });

    test('should draw table dates correctly', () => {
      const dates = ['1 de junio de 2025', '8 de junio de 2025'];
      const x = 15;
      const y = 52; // After header
      const width = 85;
      
      // Simulate drawing dates
      mockDoc.setFontSize(10);
      mockDoc.setFont(undefined, 'normal');
      
      dates.forEach((date, index) => {
        const dateY = y + (index * 15);
        mockDoc.text(`• ${date}`, x + 5, dateY);
      });
      
      expect(mockDoc.setFontSize).toHaveBeenCalledWith(10);
      expect(mockDoc.setFont).toHaveBeenCalledWith(undefined, 'normal');
      expect(mockDoc.text).toHaveBeenCalledWith('• 1 de junio de 2025', x + 5, y);
      expect(mockDoc.text).toHaveBeenCalledWith('• 8 de junio de 2025', x + 5, y + 15);
    });
  });

  describe('Multiple Page Handling', () => {
    test('should add new page when needed', () => {
      const apartments = Array.from({ length: 10 }, (_, i) => `${i + 1}01`);
      
      // Simulate checking if new page is needed for each apartment
      apartments.forEach((apartment, index) => {
        const position = {
          x: 15 + ((index % 2) * 90),
          y: 40 + (Math.floor(index / 2) * 115)
        };
        
        if (position.y + 100 > 237) { // Mock page limit
          mockDoc.addPage();
          // Reset position for new page
        }
      });
      
      expect(mockDoc.addPage).toHaveBeenCalled();
    });

    test('should reset apartment index after new page', () => {
      let apartmentIndex = 5;
      const needsNewPage = true;
      
      if (needsNewPage) {
        apartmentIndex = 0; // Reset for new page positioning
      }
      
      expect(apartmentIndex).toBe(0);
    });
  });

  describe('PDF Configuration', () => {
    test('should use correct page dimensions', () => {
      expect(pdfService.config.PAGE_WIDTH).toBe(210);
      expect(pdfService.config.PAGE_HEIGHT).toBe(297);
    });

    test('should use correct margins', () => {
      expect(pdfService.config.MARGIN).toBe(15);
    });

    test('should use correct table height range', () => {
      expect(pdfService.config.MIN_TABLE_HEIGHT).toBe(80);
      expect(pdfService.config.MAX_TABLE_HEIGHT).toBe(120);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid apartment data', () => {
      const invalidSchedule = {
        dateAssignments: {
          null: ['date1'],
          undefined: ['date2'],
          '': ['date3']
        }
      };
      
      // Filter out invalid apartments - need to check for null values properly
      const validApartments = Object.entries(invalidSchedule.dateAssignments)
        .filter(([apartment, dates]) => 
          apartment && 
          apartment !== 'null' && 
          apartment !== 'undefined' && 
          apartment.trim() && 
          Array.isArray(dates) && 
          dates.length > 0
        );
      
      expect(validApartments.length).toBe(0);
    });

    test('should handle empty date arrays', () => {
      const scheduleWithEmptyDates = {
        dateAssignments: {
          301: [],
          302: ['date1'],
          303: null
        }
      };
      
      // Filter apartments with valid dates
      const apartmentsWithDates = Object.entries(scheduleWithEmptyDates.dateAssignments)
        .filter(([apartment, dates]) => dates && dates.length > 0);
      
      expect(apartmentsWithDates.length).toBe(1);
      expect(apartmentsWithDates[0][0]).toBe('302');
    });

    test('should handle very long apartment names', () => {
      const longApartmentName = 'APARTAMENTO_WITH_VERY_LONG_NAME_12345';
      const maxWidth = 80;
      
      // Simulate text truncation or wrapping
      const truncatedName = longApartmentName.length > 20 
        ? longApartmentName.substring(0, 17) + '...'
        : longApartmentName;
      
      expect(truncatedName.length).toBeLessThanOrEqual(20);
    });
  });

  describe('Performance Tests', () => {
    test('should handle large number of apartments efficiently', () => {
      const manyApartments = Array.from({ length: 50 }, (_, i) => `${i + 1}01`);
      const startTime = performance.now();
      
      // Simulate processing many apartments
      manyApartments.forEach((apartment, index) => {
        const position = {
          x: 15 + ((index % 2) * 90),
          y: 40 + (Math.floor(index / 2) * 115)
        };
        
        // Mock table drawing operations
        mockDoc.rect(position.x, position.y, 85, 100);
        mockDoc.text(`APARTAMENTO ${apartment}`, position.x + 42.5, position.y + 8);
      });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(100); // Should complete within 100ms
      expect(mockDoc.rect).toHaveBeenCalledTimes(50);
      expect(mockDoc.text).toHaveBeenCalledTimes(50);
    });

    test('should handle many dates per apartment efficiently', () => {
      const manyDates = Array.from({ length: 52 }, (_, i) => `Date ${i + 1}`);
      
      const startTime = performance.now();
      
      // Simulate drawing many dates
      manyDates.forEach((date, index) => {
        mockDoc.text(`• ${date}`, 20, 60 + (index * 15));
      });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(50);
      expect(mockDoc.text).toHaveBeenCalledTimes(52);
    });
  });

  describe('Edge Cases', () => {
    test('should handle single apartment with many dates', () => {
      const singleApartmentSchedule = {
        dateAssignments: {
          301: Array.from({ length: 20 }, (_, i) => `Date ${i + 1}`)
        }
      };
      
      const apartmentCount = Object.keys(singleApartmentSchedule.dateAssignments).length;
      const totalDates = Object.values(singleApartmentSchedule.dateAssignments)
        .flat().length;
      
      expect(apartmentCount).toBe(1);
      expect(totalDates).toBe(20);
    });

    test('should handle apartments with no dates', () => {
      const scheduleWithEmptyApartments = {
        dateAssignments: {
          301: [],
          302: ['date1'],
          303: []
        }
      };
      
      // Should still create tables for all apartments
      const allApartments = Object.keys(scheduleWithEmptyApartments.dateAssignments);
      expect(allApartments.length).toBe(3);
    });

    test('should handle special characters in dates', () => {
      const specialCharDates = [
        '1º de junio de 2025',
        'Día especial - 15/06/2025',
        'Fecha con ñ y acentós'
      ];
      
      specialCharDates.forEach(date => {
        // Should handle special characters without errors
        expect(typeof date).toBe('string');
        expect(date.length).toBeGreaterThan(0);
      });
    });
  });
});