import { UI_CONSTANTS } from '../config/constants.js';

/**
 * Apartment Manager
 * Handles apartment ordering, selection and drag & drop functionality
 */
export class ApartmentManager {
  constructor(onApartmentChange) {
    this.apartmentList = document.querySelector(UI_CONSTANTS.SELECTORS.APARTMENT_LIST);
    this.onApartmentChange = onApartmentChange;
    this.draggedElement = null;
    this._setupEventListeners();
  }

  /**
   * Get currently selected apartments in order
   */
  getSelectedApartments() {
    const apartmentItems = document.querySelectorAll(`.${UI_CONSTANTS.CLASSES.APARTMENT_ITEM}`);
    const selected = Array.from(apartmentItems)
      .filter(item => item.querySelector('input[type="checkbox"]').checked)
      .map(item => parseInt(item.querySelector('input[type="checkbox"]').value));
    
    console.log('Selected apartments:', selected);
    return selected;
  }

  /**
   * Setup all event listeners for apartment management
   */
  _setupEventListeners() {
    this._setupDragAndDrop();
    this._setupOrderButtons();
    this._setupCheckboxes();
    this._setupKeyboardShortcuts();
    this._updatePositionIndicators();
  }

  /**
   * Update position indicators for all apartments
   */
  _updatePositionIndicators() {
    const apartmentItems = document.querySelectorAll(`.${UI_CONSTANTS.CLASSES.APARTMENT_ITEM}`);
    apartmentItems.forEach((item, index) => {
      const indicator = item.querySelector(`.${UI_CONSTANTS.CLASSES.POSITION_INDICATOR}`);
      if (indicator) {
        indicator.textContent = index + 1;
      }
    });
  }

  /**
   * Move apartment up or down in the list
   */
  _moveApartment(apartmentItem, direction) {
    const parent = apartmentItem.parentNode;
    
    if (direction === 'up' && apartmentItem.previousElementSibling) {
      parent.insertBefore(apartmentItem, apartmentItem.previousElementSibling);
    } else if (direction === 'down' && apartmentItem.nextElementSibling) {
      parent.insertBefore(apartmentItem.nextElementSibling, apartmentItem);
    }
    
    this._updatePositionIndicators();
  }

  /**
   * Setup drag and drop functionality
   */
  _setupDragAndDrop() {
    this.apartmentList.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains(UI_CONSTANTS.CLASSES.APARTMENT_ITEM)) {
        this.draggedElement = e.target;
        e.target.classList.add(UI_CONSTANTS.CLASSES.DRAGGING);
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    this.apartmentList.addEventListener('dragend', (e) => {
      if (e.target.classList.contains(UI_CONSTANTS.CLASSES.APARTMENT_ITEM)) {
        e.target.classList.remove(UI_CONSTANTS.CLASSES.DRAGGING);
        this._clearDragOverClasses();
        this.draggedElement = null;
        this._updatePositionIndicators();
        this._triggerScheduleUpdate();
      }
    });

    this.apartmentList.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      this._handleDragOver(e);
    });

    this.apartmentList.addEventListener('drop', (e) => {
      e.preventDefault();
      this._handleDrop(e);
      this._clearDragOverClasses();
    });
  }

  /**
   * Handle drag over events
   */
  _handleDragOver(e) {
    const afterElement = this._getDragAfterElement(e.clientY);
    const dragging = document.querySelector(`.${UI_CONSTANTS.CLASSES.DRAGGING}`);
    
    this._clearDragOverClasses();
    
    if (afterElement == null) {
      if (dragging && this.apartmentList.lastElementChild !== dragging) {
        this.apartmentList.lastElementChild.classList.add(UI_CONSTANTS.CLASSES.DRAG_OVER);
      }
    } else if (dragging && afterElement !== dragging) {
      afterElement.classList.add(UI_CONSTANTS.CLASSES.DRAG_OVER);
    }
  }

  /**
   * Handle drop events
   */
  _handleDrop(e) {
    const afterElement = this._getDragAfterElement(e.clientY);
    const dragging = document.querySelector(`.${UI_CONSTANTS.CLASSES.DRAGGING}`);
    
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
  _clearDragOverClasses() {
    document.querySelectorAll(`.${UI_CONSTANTS.CLASSES.APARTMENT_ITEM}`).forEach(item => {
      item.classList.remove(UI_CONSTANTS.CLASSES.DRAG_OVER);
    });
  }

  /**
   * Determine where to drop the element
   */
  _getDragAfterElement(y) {
    const draggableElements = [...this.apartmentList.querySelectorAll(`.${UI_CONSTANTS.CLASSES.APARTMENT_ITEM}:not(.${UI_CONSTANTS.CLASSES.DRAGGING})`)];
    
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
  _setupOrderButtons() {
    this.apartmentList.addEventListener('click', (e) => {
      const button = e.target.closest(`.${UI_CONSTANTS.CLASSES.ORDER_BTN}`);
      if (button) {
        const direction = button.dataset.direction;
        const apartmentItem = button.closest(`.${UI_CONSTANTS.CLASSES.APARTMENT_ITEM}`);
        
        this._moveApartment(apartmentItem, direction);
        this._addVisualFeedback(apartmentItem);
        this._triggerScheduleUpdate();
      }
    });
  }

  /**
   * Setup checkbox event listeners
   */
  _setupCheckboxes() {
    this.apartmentList.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        const apartmentItem = e.target.closest(`.${UI_CONSTANTS.CLASSES.APARTMENT_ITEM}`);
        this._addCheckboxFeedback(apartmentItem, e.target.checked);
        this._triggerScheduleUpdate();
      }
    });
  }

  /**
   * Setup keyboard shortcuts
   */
  _setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        const focusedItem = document.querySelector(`.${UI_CONSTANTS.CLASSES.APARTMENT_ITEM}:focus-within`);
        if (focusedItem) {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            this._moveApartment(focusedItem, 'up');
            this._triggerScheduleUpdate();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this._moveApartment(focusedItem, 'down');
            this._triggerScheduleUpdate();
          }
        }
      }
    });
  }

  /**
   * Add visual feedback for apartment movement
   */
  _addVisualFeedback(apartmentItem) {
    apartmentItem.style.transform = 'scale(1.05)';
    setTimeout(() => {
      apartmentItem.style.transform = '';
    }, 200);
  }

  /**
   * Add visual feedback for checkbox changes
   */
  _addCheckboxFeedback(apartmentItem, checked) {
    apartmentItem.style.borderColor = checked ? '#4caf50' : '#f44336';
    setTimeout(() => {
      apartmentItem.style.borderColor = '';
    }, 500);
  }

  /**
   * Trigger schedule update callback
   */
  _triggerScheduleUpdate() {
    if (this.onApartmentChange) {
      this.onApartmentChange();
    }
  }
}