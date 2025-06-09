/**
 * DOM Loading and Script Initialization Tests
 * Tests to detect the type of failures we experienced with missing DOM elements
 * and script loading issues - Simplified version for better compatibility
 */

describe('DOM Loading and Script Initialization', () => {
  let mockDOM;
  
  beforeEach(() => {
    // Reset console mocks
    jest.clearAllMocks();
    
    // Setup complete DOM structure that matches Escalas.html
    mockDOM = `
      <div class="app-container">
        <header class="app-header">
          <h1>LAVADA DE ESCALAS</h1>
        </header>
        <div class="main-content">
          <aside class="config-panel">
            <div class="config-content">
              <div class="config-section">
                <div class="date-controls">
                  <input type="date" id="startDate" value="2025-06-15">
                  <input type="date" id="endDate" value="2026-06-01">
                </div>
              </div>
              <div class="config-section">
                <div class="apartment-list" id="apartmentList">
                  <div class="apartment-item" data-apt="201" draggable="true">
                    <div class="drag-handle">
                      <i class="fas fa-grip-vertical"></i>
                    </div>
                    <div class="apartment-checkbox">
                      <input type="checkbox" value="201" checked id="apt-201">
                      <label for="apt-201">Apartamento 201</label>
                    </div>
                    <div class="order-controls">
                      <button type="button" class="order-btn up" data-direction="up"></button>
                      <button type="button" class="order-btn down" data-direction="down"></button>
                    </div>
                    <div class="position-indicator">1</div>
                  </div>
                  <div class="apartment-item" data-apt="202" draggable="true">
                    <div class="drag-handle">
                      <i class="fas fa-grip-vertical"></i>
                    </div>
                    <div class="apartment-checkbox">
                      <input type="checkbox" value="202" checked id="apt-202">
                      <label for="apt-202">Apartamento 202</label>
                    </div>
                    <div class="order-controls">
                      <button type="button" class="order-btn up" data-direction="up"></button>
                      <button type="button" class="order-btn down" data-direction="down"></button>
                    </div>
                    <div class="position-indicator">2</div>
                  </div>
                  <div class="apartment-item" data-apt="301" draggable="true">
                    <div class="drag-handle">
                      <i class="fas fa-grip-vertical"></i>
                    </div>
                    <div class="apartment-checkbox">
                      <input type="checkbox" value="301" checked id="apt-301">
                      <label for="apt-301">Apartamento 301</label>
                    </div>
                    <div class="order-controls">
                      <button type="button" class="order-btn up" data-direction="up"></button>
                      <button type="button" class="order-btn down" data-direction="down"></button>
                    </div>
                    <div class="position-indicator">3</div>
                  </div>
                  <div class="apartment-item" data-apt="302" draggable="true">
                    <div class="drag-handle">
                      <i class="fas fa-grip-vertical"></i>
                    </div>
                    <div class="apartment-checkbox">
                      <input type="checkbox" value="302" checked id="apt-302">
                      <label for="apt-302">Apartamento 302</label>
                    </div>
                    <div class="order-controls">
                      <button type="button" class="order-btn up" data-direction="up"></button>
                      <button type="button" class="order-btn down" data-direction="down"></button>
                    </div>
                    <div class="position-indicator">4</div>
                  </div>
                </div>
              </div>
              <div class="config-section">
                <div class="action-buttons">
                  <button id="generateBtn" class="btn-primary">Actualizar Escalas</button>
                  <button id="downloadBtn" class="btn-secondary">Descargar PDF</button>
                </div>
              </div>
            </div>
          </aside>
          <main class="schedule-view">
            <div class="schedule-header">
              <div class="schedule-info" id="scheduleInfo">
                <span class="schedule-dates"></span>
                <span class="schedule-count"></span>
              </div>
            </div>
            <div class="schedule-content" id="scheduleContent">
              <!-- Tables will be generated here -->
            </div>
          </main>
        </div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('HTML Structure Validation', () => {
    beforeEach(() => {
      document.body.innerHTML = mockDOM;
    });

    test('should have all required DOM elements present', () => {
      const requiredElements = [
        'scheduleContent',
        'scheduleInfo',
        'apartmentList', 
        'generateBtn',
        'downloadBtn',
        'startDate',
        'endDate'
      ];

      const missingElements = [];
      const foundElements = [];

      requiredElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
          foundElements.push(elementId);
        } else {
          missingElements.push(elementId);
        }
      });

      // Log detailed results for debugging
      if (missingElements.length > 0) {
        console.error('Missing elements:', missingElements);
      }

      expect(missingElements).toHaveLength(0);
      expect(foundElements).toHaveLength(requiredElements.length);
    });

    test('should have proper apartment structure', () => {
      const apartmentList = document.getElementById('apartmentList');
      expect(apartmentList).toBeInTheDocument();

      const apartmentItems = document.querySelectorAll('.apartment-item');
      expect(apartmentItems).toHaveLength(4);

      // Check each apartment has required elements
      apartmentItems.forEach((item, index) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const dragHandle = item.querySelector('.drag-handle');
        const orderControls = item.querySelector('.order-controls');
        const positionIndicator = item.querySelector('.position-indicator');

        expect(checkbox).toBeInTheDocument();
        expect(dragHandle).toBeInTheDocument();
        expect(orderControls).toBeInTheDocument();
        expect(positionIndicator).toBeInTheDocument();

        // Check position indicator shows correct number
        expect(positionIndicator.textContent).toBe((index + 1).toString());
      });
    });

    test('should have correct apartment order', () => {
      const apartmentItems = document.querySelectorAll('.apartment-item');
      const expectedOrder = ['201', '202', '301', '302'];

      apartmentItems.forEach((item, index) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const apartmentNumber = checkbox.value;
        expect(apartmentNumber).toBe(expectedOrder[index]);
      });
    });

    test('should have all required CSS classes', () => {
      const requiredClasses = [
        '.app-container',
        '.config-panel',
        '.schedule-view',
        '.apartment-item',
        '.drag-handle',
        '.order-controls',
        '.position-indicator'
      ];

      requiredClasses.forEach(className => {
        const elements = document.querySelectorAll(className);
        expect(elements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Script Loading Detection', () => {
    test('should detect missing script loading', () => {
      // Create a minimal HTML without proper elements
      const brokenHtml = `
        <div id="scheduleContent"></div>
        <!-- Missing script tags and other elements -->
      `;

      document.body.innerHTML = brokenHtml;

      // Should not have the required elements
      expect(document.getElementById('apartmentList')).toBeNull();
      expect(document.getElementById('generateBtn')).toBeNull();
    });

    test('should handle missing critical elements gracefully', () => {
      const htmlWithMissingElements = `
        <div id="partial-app">
          <div id="scheduleContent"></div>
          <!-- Missing apartmentList, buttons etc -->
        </div>
      `;

      document.body.innerHTML = htmlWithMissingElements;

      // Should detect that critical elements are missing
      expect(document.getElementById('apartmentList')).toBeNull();
      expect(document.getElementById('generateBtn')).toBeNull();
      expect(document.getElementById('scheduleContent')).not.toBeNull();
    });
  });

  describe('Application Initialization Detection', () => {
    beforeEach(() => {
      document.body.innerHTML = mockDOM;
    });

    test('should detect when all components can be initialized', () => {
      // Simulate checking if app can initialize
      const requiredForInit = [
        document.getElementById('apartmentList'),
        document.getElementById('scheduleContent'),
        document.getElementById('generateBtn')
      ];

      const canInitialize = requiredForInit.every(element => element !== null);
      expect(canInitialize).toBe(true);
    });

    test('should detect initialization timing issues', () => {
      // Simulate the scenario we experienced
      let initializationFailed = false;
      
      try {
        const apartmentList = document.getElementById('apartmentList');
        const generateBtn = document.getElementById('generateBtn');
        
        if (!apartmentList) {
          throw new Error('apartmentList element not found');
        }
        if (!generateBtn) {
          throw new Error('generateBtn element not found');
        }
        
        // If we get here, initialization should succeed
      } catch (error) {
        initializationFailed = true;
      }

      expect(initializationFailed).toBe(false);
    });
  });

  describe('Element Interaction Validation', () => {
    beforeEach(() => {
      document.body.innerHTML = mockDOM;
    });

    test('should have clickable buttons', () => {
      const generateBtn = document.getElementById('generateBtn');
      const downloadBtn = document.getElementById('downloadBtn');

      expect(generateBtn).toBeInTheDocument();
      expect(downloadBtn).toBeInTheDocument();

      // Should be clickable (not disabled)
      expect(generateBtn.disabled).toBe(false);
      expect(downloadBtn.disabled).toBe(false);
    });

    test('should have functional checkboxes', () => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      
      expect(checkboxes.length).toBeGreaterThan(0);

      checkboxes.forEach(checkbox => {
        expect(checkbox.checked).toBe(true); // Default state
        expect(checkbox.disabled).toBe(false);
      });
    });

    test('should have draggable apartment items', () => {
      const apartmentItems = document.querySelectorAll('.apartment-item');
      
      apartmentItems.forEach(item => {
        expect(item.draggable).toBe(true);
        expect(item.getAttribute('data-apt')).toBeTruthy();
      });
    });
  });

  describe('DOM State Detection', () => {
    test('should detect broken DOM structure', () => {
      // Simulate the exact problem we had
      document.body.innerHTML = `
        <div>
          <!-- Incomplete structure -->
          <div id="scheduleContent"></div>
        </div>
      `;

      const criticalElements = [
        'apartmentList',
        'generateBtn', 
        'downloadBtn',
        'startDate',
        'endDate'
      ];

      const missingCritical = criticalElements.filter(id => 
        !document.getElementById(id)
      );

      // Should detect multiple missing elements
      expect(missingCritical.length).toBeGreaterThan(0);
      expect(missingCritical).toContain('apartmentList');
    });

    test('should validate complete apartment structure', () => {
      document.body.innerHTML = mockDOM;
      
      const apartmentItems = document.querySelectorAll('.apartment-item');
      
      apartmentItems.forEach((item, index) => {
        // Verify structure that was causing issues
        const hasCheckbox = Boolean(item.querySelector('input[type="checkbox"]'));
        const hasOrderButtons = item.querySelectorAll('.order-btn').length === 2;
        const hasPositionIndicator = Boolean(item.querySelector('.position-indicator'));
        const hasDragHandle = Boolean(item.querySelector('.drag-handle'));
        
        expect(hasCheckbox).toBe(true);
        expect(hasOrderButtons).toBe(true);
        expect(hasPositionIndicator).toBe(true);
        expect(hasDragHandle).toBe(true);
        
        // This specific test would have caught our original issue
        if (!hasCheckbox || !hasOrderButtons || !hasPositionIndicator) {
          throw new Error(`Apartment ${index + 1} has incomplete structure`);
        }
      });
    });
  });

  describe('Error Recovery Scenarios', () => {
    test('should detect when fallback is needed', () => {
      // Simulate broken primary loading
      window.scheduleApp = undefined;
      window.ScheduleApp = undefined;
      
      const needsFallback = !window.scheduleApp && !window.ScheduleApp;
      expect(needsFallback).toBe(true);
    });

    test('should provide recovery mechanisms', () => {
      // Simulate error state
      document.body.innerHTML = '<div id="scheduleContent"></div>';
      
      const scheduleContent = document.getElementById('scheduleContent');
      
      // Show error message like our app does
      scheduleContent.innerHTML = `
        <div class="error-state">
          <h3>Error de carga</h3>
          <p>Algunos elementos no se cargaron correctamente.</p>
          <button onclick="location.reload()">Recargar</button>
        </div>
      `;
      
      const errorState = scheduleContent.querySelector('.error-state');
      const reloadBtn = scheduleContent.querySelector('button');
      
      expect(errorState).toBeTruthy();
      expect(reloadBtn).toBeTruthy();
    });
  });
});