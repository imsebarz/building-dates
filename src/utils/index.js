/**
 * UI Utilities
 * Common UI helper functions
 */
export class UIUtils {
  /**
   * Show success message toast
   */
  static showSuccessMessage(message) {
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

  /**
   * Show error message toast
   */
  static showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.style.opacity = '1', 100);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }

  /**
   * Add visual feedback to buttons
   */
  static addButtonFeedback(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }

  /**
   * Setup scroll observer for schedule content
   */
  static setupScrollObserver(containerId) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target.id === containerId) {
          const container = document.getElementById(containerId);
          if (container) {
            container.scrollTop = 0;
          }
        }
      });
    });

    const container = document.getElementById(containerId);
    if (container) {
      observer.observe(container, { childList: true });
    }
  }
}

/**
 * Date Utilities
 * Date-related helper functions
 */
export class DateUtils {
  /**
   * Format date for display
   */
  static formatDate(date, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
    return new Date(date).toLocaleDateString('es-ES', options);
  }

  /**
   * Check if date is valid
   */
  static isValidDate(date) {
    return date instanceof Date && !isNaN(date);
  }

  /**
   * Get formatted filename date
   */
  static getFormattedFilename(startDate, endDate) {
    const start = this.formatDate(startDate);
    const end = this.formatDate(endDate);
    return `escalas_${start}_al_${end}.pdf`;
  }
}