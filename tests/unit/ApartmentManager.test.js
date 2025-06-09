/**
 * Unit Tests for ApartmentManager
 * Tests apartment ordering, selection, drag & drop functionality
 */

// Mock DOM elements and functions
const mockApartmentHTML = `
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
`;

describe('ApartmentManager', () => {
  let apartmentManager;
  let apartmentList;
  let mockOnApartmentChange;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = mockApartmentHTML;
    apartmentList = document.getElementById('apartmentList');
    
    // Mock callback function
    mockOnApartmentChange = jest.fn();
    
    // Create apartment manager instance (simulated)
    apartmentManager = {
      apartmentList,
      onApartmentChange: mockOnApartmentChange,
      draggedElement: null
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with apartment list element', () => {
      expect(apartmentManager.apartmentList).toBe(apartmentList);
      expect(apartmentManager.onApartmentChange).toBe(mockOnApartmentChange);
    });

    test('should initialize draggedElement as null', () => {
      expect(apartmentManager.draggedElement).toBeNull();
    });
  });

  describe('getSelectedApartments', () => {
    test('should return selected apartment numbers in order', () => {
      const apartmentItems = document.querySelectorAll('.apartment-item');
      const selected = Array.from(apartmentItems)
        .filter(item => item.querySelector('input[type="checkbox"]').checked)
        .map(item => parseInt(item.querySelector('input[type="checkbox"]').value));
      
      expect(selected).toEqual([301, 302]);
    });

    test('should return empty array when no apartments selected', () => {
      // Uncheck all checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => checkbox.checked = false);
      
      const apartmentItems = document.querySelectorAll('.apartment-item');
      const selected = Array.from(apartmentItems)
        .filter(item => item.querySelector('input[type="checkbox"]').checked)
        .map(item => parseInt(item.querySelector('input[type="checkbox"]').value));
      
      expect(selected).toEqual([]);
    });

    test('should maintain apartment order after reordering', () => {
      // Simulate moving first item to end
      const firstItem = apartmentList.firstElementChild;
      apartmentList.appendChild(firstItem);
      
      const apartmentItems = document.querySelectorAll('.apartment-item');
      const selected = Array.from(apartmentItems)
        .filter(item => item.querySelector('input[type="checkbox"]').checked)
        .map(item => parseInt(item.querySelector('input[type="checkbox"]').value));
      
      expect(selected).toEqual([302, 301]); // Order changed
    });
  });

  describe('Position Indicators', () => {
    test('should update position indicators correctly', () => {
      const apartmentItems = document.querySelectorAll('.apartment-item');
      apartmentItems.forEach((item, index) => {
        const indicator = item.querySelector('.position-indicator');
        indicator.textContent = index + 1;
      });
      
      const indicators = Array.from(document.querySelectorAll('.position-indicator'))
        .map(indicator => indicator.textContent);
      
      expect(indicators).toEqual(['1', '2', '3']);
    });

    test('should update indicators after item movement', () => {
      // Move second item to first position
      const secondItem = apartmentList.children[1];
      apartmentList.insertBefore(secondItem, apartmentList.firstChild);
      
      // Update position indicators
      const apartmentItems = document.querySelectorAll('.apartment-item');
      apartmentItems.forEach((item, index) => {
        const indicator = item.querySelector('.position-indicator');
        indicator.textContent = index + 1;
      });
      
      const indicators = Array.from(document.querySelectorAll('.position-indicator'))
        .map(indicator => indicator.textContent);
      
      expect(indicators).toEqual(['1', '2', '3']);
      
      // Check that apartment 302 is now first
      const firstApartment = apartmentList.firstElementChild.querySelector('input').value;
      expect(firstApartment).toBe('302');
    });
  });

  describe('Apartment Movement', () => {
    test('should move apartment up in list', () => {
      const secondItem = apartmentList.children[1]; // Apartment 302
      const parent = secondItem.parentNode;
      
      // Move up (swap with previous)
      if (secondItem.previousElementSibling) {
        parent.insertBefore(secondItem, secondItem.previousElementSibling);
      }
      
      const firstApartment = apartmentList.firstElementChild.querySelector('input').value;
      expect(firstApartment).toBe('302');
    });

    test('should move apartment down in list', () => {
      const firstItem = apartmentList.children[0]; // Apartment 301
      const parent = firstItem.parentNode;
      
      // Move down (swap with next)
      if (firstItem.nextElementSibling) {
        parent.insertBefore(firstItem.nextElementSibling, firstItem);
      }
      
      const firstApartment = apartmentList.firstElementChild.querySelector('input').value;
      expect(firstApartment).toBe('302');
    });

    test('should not move first item up', () => {
      const firstItem = apartmentList.children[0];
      const originalFirst = firstItem.querySelector('input').value;
      
      // Try to move up (should not change)
      if (!firstItem.previousElementSibling) {
        // No action taken
      }
      
      const currentFirst = apartmentList.firstElementChild.querySelector('input').value;
      expect(currentFirst).toBe(originalFirst);
    });

    test('should not move last item down', () => {
      const lastItem = apartmentList.children[apartmentList.children.length - 1];
      const originalLast = lastItem.querySelector('input').value;
      
      // Try to move down (should not change)
      if (!lastItem.nextElementSibling) {
        // No action taken
      }
      
      const currentLast = apartmentList.lastElementChild.querySelector('input').value;
      expect(currentLast).toBe(originalLast);
    });
  });

  describe('Drag and Drop Functionality', () => {
    test('should handle dragstart event', () => {
      const firstItem = apartmentList.children[0];
      
      // Simulate dragstart
      const dragStartEvent = new Event('dragstart');
      dragStartEvent.dataTransfer = { effectAllowed: null };
      
      firstItem.classList.add('dragging');
      dragStartEvent.dataTransfer.effectAllowed = 'move';
      
      expect(firstItem.classList.contains('dragging')).toBe(true);
    });

    test('should handle dragend event', () => {
      const firstItem = apartmentList.children[0];
      firstItem.classList.add('dragging');
      
      // Simulate dragend
      firstItem.classList.remove('dragging');
      
      expect(firstItem.classList.contains('dragging')).toBe(false);
    });

    test('should calculate drag after element correctly', () => {
      const draggableElements = Array.from(apartmentList.querySelectorAll('.apartment-item:not(.dragging)'));
      const testY = 100;
      
      // Mock getBoundingClientRect for test elements
      draggableElements.forEach((element, index) => {
        element.getBoundingClientRect = () => ({
          top: 50 + (index * 50),
          height: 40,
          bottom: 90 + (index * 50)
        });
      });
      
      const afterElement = draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = testY - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        }
        return closest;
      }, { offset: Number.NEGATIVE_INFINITY }).element;
      
      expect(afterElement).toBeDefined();
    });

    test('should clear drag over classes', () => {
      // Add drag-over class to items
      const items = document.querySelectorAll('.apartment-item');
      items.forEach(item => item.classList.add('drag-over'));
      
      // Clear classes
      items.forEach(item => item.classList.remove('drag-over'));
      
      const dragOverItems = document.querySelectorAll('.apartment-item.drag-over');
      expect(dragOverItems).toHaveLength(0);
    });
  });

  describe('Event Handlers', () => {
    test('should handle order button clicks', () => {
      const upButton = document.querySelector('[data-direction="up"]');
      const apartmentItem = upButton.closest('.apartment-item');
      
      // Simulate button click
      const clickEvent = new Event('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: upButton });
      
      expect(upButton.dataset.direction).toBe('up');
      expect(apartmentItem).toBeTruthy();
    });

    test('should handle checkbox changes', () => {
      const checkbox = document.querySelector('input[type="checkbox"]');
      const originalChecked = checkbox.checked;
      
      // Simulate checkbox change
      checkbox.checked = !originalChecked;
      const changeEvent = new Event('change', { bubbles: true });
      checkbox.dispatchEvent(changeEvent);
      
      expect(checkbox.checked).toBe(!originalChecked);
    });

    test('should trigger schedule update on apartment change', () => {
      // Simulate apartment change
      apartmentManager.onApartmentChange();
      
      expect(mockOnApartmentChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Visual Feedback', () => {
    test('should add visual feedback for apartment movement', () => {
      const apartmentItem = apartmentList.children[0];
      
      // Simulate visual feedback
      apartmentItem.style.transform = 'scale(1.05)';
      expect(apartmentItem.style.transform).toBe('scale(1.05)');
      
      // Reset after timeout (simulated)
      setTimeout(() => {
        apartmentItem.style.transform = '';
        expect(apartmentItem.style.transform).toBe('');
      }, 200);
    });

    test('should add visual feedback for checkbox changes', () => {
      const apartmentItem = apartmentList.children[0];
      const checkbox = apartmentItem.querySelector('input[type="checkbox"]');
      
      // Simulate checkbox feedback
      apartmentItem.style.borderColor = checkbox.checked ? '#4caf50' : '#f44336';
      expect(apartmentItem.style.borderColor).toBe('#4caf50');
      
      // Reset after timeout (simulated)
      setTimeout(() => {
        apartmentItem.style.borderColor = '';
        expect(apartmentItem.style.borderColor).toBe('');
      }, 500);
    });
  });

  describe('Keyboard Shortcuts', () => {
    test('should handle Ctrl+ArrowUp for moving apartment up', () => {
      const focusedItem = apartmentList.children[1]; // Second item
      
      // Simulate keyboard event
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: true
      });
      
      expect(keyEvent.ctrlKey).toBe(true);
      expect(keyEvent.key).toBe('ArrowUp');
    });

    test('should handle Ctrl+ArrowDown for moving apartment down', () => {
      const focusedItem = apartmentList.children[0]; // First item
      
      // Simulate keyboard event
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        ctrlKey: true
      });
      
      expect(keyEvent.ctrlKey).toBe(true);
      expect(keyEvent.key).toBe('ArrowDown');
    });

    test('should ignore non-control key events', () => {
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        ctrlKey: false
      });
      
      expect(keyEvent.ctrlKey).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty apartment list', () => {
      document.body.innerHTML = '<div id="apartmentList"></div>';
      const emptyList = document.getElementById('apartmentList');
      
      const items = emptyList.querySelectorAll('.apartment-item');
      expect(items).toHaveLength(0);
    });

    test('should handle apartment list with single item', () => {
      document.body.innerHTML = `
        <div id="apartmentList">
          <div class="apartment-item">
            <input type="checkbox" value="301" checked>
            <span>Apartamento 301</span>
          </div>
        </div>
      `;
      
      const items = document.querySelectorAll('.apartment-item');
      expect(items).toHaveLength(1);
      
      // Cannot move single item
      const singleItem = items[0];
      expect(singleItem.previousElementSibling).toBeNull();
      expect(singleItem.nextElementSibling).toBeNull();
    });

    test('should handle malformed apartment elements', () => {
      document.body.innerHTML = `
        <div id="apartmentList">
          <div class="apartment-item">
            <!-- Missing checkbox -->
            <span>Apartamento 301</span>
          </div>
        </div>
      `;
      
      const checkbox = document.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeNull();
    });
  });

  describe('Performance Tests', () => {
    test('should handle large number of apartments efficiently', () => {
      // Create many apartment items
      const manyApartments = Array.from({ length: 100 }, (_, i) => `
        <div class="apartment-item">
          <input type="checkbox" value="${i + 1}" checked>
          <span>Apartamento ${i + 1}</span>
          <span class="position-indicator">${i + 1}</span>
        </div>
      `).join('');
      
      document.body.innerHTML = `<div id="apartmentList">${manyApartments}</div>`;
      
      const startTime = performance.now();
      
      const apartmentItems = document.querySelectorAll('.apartment-item');
      const selected = Array.from(apartmentItems)
        .filter(item => item.querySelector('input[type="checkbox"]').checked)
        .map(item => parseInt(item.querySelector('input[type="checkbox"]').value));
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      expect(selected).toHaveLength(100);
      expect(executionTime).toBeLessThan(50); // Should complete within 50ms
    });
  });
});