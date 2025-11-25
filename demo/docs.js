/*!
 * infiDate-js Documentation JavaScript v1.0.0
 * Interactive examples and documentation functionality
 *
 * Features:
 * - Dropdown date picker examples
 * - Modal date picker examples
 * - Inline calendar examples
 * - Copy-to-clipboard functionality
 * - Smooth scrolling navigation
 * - Intersection observer animations
 *
 * Author: Ankit Semwal
 * License: MIT
 */

(function() {
  'use strict';

  // Constants
  const DROPDOWN_CONFIG = {
    WIDTH: 320,
    HEIGHT: 350,
    GAP: 2,
    Z_INDEX: 9999
  };

  const MODAL_CONFIG = {
    Z_INDEX: 10000,
    BACKDROP_OPACITY: 0.5
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    initializeExamples();
    setupNavigationFeatures();
    setupCopyToClipboard();
    setupScrollEffects();
    setupIntersectionObserver();
  });

  /**
   * Initialize all date picker examples
   */
  function initializeExamples() {
    // Verify dependencies
    if (typeof window.InfiDate === 'undefined') {
      console.error('InfiDate not loaded - check if infidate.js is loaded before docs.js');
      return;
    }

    // Initialize each example
    initializeHeroDemo();
    initializeBasicExample();
    initializeRangeExample();
    initializeValidationExample();
    initializeModalExample();
    initializeFormatExample();
    initializeInlineExample();
  }

  /**
   * Create a dropdown date picker
   * @param {string} inputSelector - CSS selector for input element
   * @param {Object} options - Configuration options
   * @returns {InfiDatePicker|null} Picker instance or null if failed
   */
  function createDropdownPicker(inputSelector, options = {}) {
    const input = document.querySelector(inputSelector);
    if (!input) {
      console.error(`Input element not found: ${inputSelector}`);
      return null;
    }

    // Create dropdown container
    const container = createDropdownContainer(inputSelector);
    if (!container) return null;

    // Initialize picker
    const picker = initializePicker(container, input, options);

    // Setup event handlers
    setupDropdownEvents(input, container, options);

    return picker;
  }

  /**
   * Create dropdown container element
   * @param {string} inputSelector - CSS selector for input element
   * @returns {HTMLElement} Container element
   */
  function createDropdownContainer(inputSelector) {
    const container = document.createElement('div');
    container.id = inputSelector.replace('#', '') + '-container';
    container.className = 'swiftdate-dropdown-container';

    // Apply styles using CSS custom properties
    container.style.cssText = `
      display: none;
      position: fixed;
      z-index: ${DROPDOWN_CONFIG.Z_INDEX};
      background: var(--sd-white, #ffffff);
      border: 1px solid var(--sd-border, #e0e0e0);
      border-radius: 8px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      width: ${DROPDOWN_CONFIG.WIDTH}px;
      max-width: ${DROPDOWN_CONFIG.WIDTH}px;
      min-width: ${DROPDOWN_CONFIG.WIDTH}px;
    `;

    document.body.appendChild(container);
    return container;
  }

  /**
   * Initialize picker instance
   * @param {HTMLElement} container - Container element
   * @param {HTMLElement} input - Input element
   * @param {Object} options - Configuration options
   * @returns {InfiDatePicker} Picker instance
   */
  function initializePicker(container, input, options) {
    // Create calendar HTML structure
    container.innerHTML = `
      <div class="infidate-picker" style="width: ${DROPDOWN_CONFIG.WIDTH}px;">
        <div class="sd-container" style="width: 100%;">
          <div class="sd-calendar" style="width: 100%;">
            <div class="sd-calendar-scroll" style="width: 100%; max-height: ${DROPDOWN_CONFIG.HEIGHT}px; padding: 0 16px;"></div>
          </div>
        </div>
      </div>
    `;

    // Initialize InfiDatePicker
    const picker = new InfiDatePicker(
      container.querySelector('.sd-calendar-scroll'),
      (data) => handlePickerSelection(data, input, container, options),
      options
    );

    return picker;
  }

  /**
   * Handle picker selection events
   * @param {Object} data - Selection data
   * @param {HTMLElement} input - Input element
   * @param {HTMLElement} container - Container element
   * @param {Object} options - Configuration options
   */
  function handlePickerSelection(data, input, container, options) {
    // Handle single date selection
    if (data && data.date && options.mode !== 'range') {
      const formattedDate = InfiDateUtils.formatDate(data.date, options.displayFormat || 'MMM D, YYYY');
      input.value = formattedDate;
      hideDropdown(container);
    }

    // Handle date range selection
    if (data && data.start && data.end && options.mode === 'range') {
      const startText = InfiDateUtils.formatDate(data.start, options.displayFormat || 'MMM D, YYYY');
      const endText = InfiDateUtils.formatDate(data.end, options.displayFormat || 'MMM D, YYYY');
      input.value = `${startText} to ${endText}`;
      hideDropdown(container);
    }

    // Call user-defined callback
    if (typeof options.onChange === 'function') {
      options.onChange(data);
    }
  }

  /**
   * Setup dropdown event handlers
   * @param {HTMLElement} input - Input element
   * @param {HTMLElement} container - Container element
   * @param {Object} options - Configuration options
   */
  function setupDropdownEvents(input, container, options) {
    // Input click handler
    input.addEventListener('click', () => {
      if (isDropdownVisible(container)) {
        hideDropdown(container);
      } else {
        showDropdown(input, container);
      }
    });

    // Outside click handler
    const hideOnOutsideClick = (event) => {
      if (!input.contains(event.target) && !container.contains(event.target)) {
        hideDropdown(container);
      }
    };

    // Event listeners for closing dropdown
    document.addEventListener('click', hideOnOutsideClick, true);
    document.addEventListener('scroll', hideOnOutsideClick, true);

    // Window resize handler
    window.addEventListener('resize', () => {
      if (isDropdownVisible(container)) {
        hideDropdown(container);
      }
    });

    // Escape key handler
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isDropdownVisible(container)) {
        hideDropdown(container);
        input.focus();
      }
    });
  }

  /**
   * Show dropdown at optimal position
   * @param {HTMLElement} input - Input element
   * @param {HTMLElement} container - Container element
   */
  function showDropdown(input, container) {
    const rect = input.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Calculate horizontal position
    let left = rect.left;
    if (left + DROPDOWN_CONFIG.WIDTH > viewport.width) {
      left = rect.right - DROPDOWN_CONFIG.WIDTH;
    }
    left = Math.max(10, left); // Minimum 10px from edge

    // Calculate vertical position
    let top = rect.bottom + DROPDOWN_CONFIG.GAP;
    if (top + DROPDOWN_CONFIG.HEIGHT > viewport.height) {
      top = rect.top - DROPDOWN_CONFIG.HEIGHT - DROPDOWN_CONFIG.GAP;
    }
    top = Math.max(10, top); // Minimum 10px from edge

    // Apply position and show
    Object.assign(container.style, {
      left: `${left}px`,
      top: `${top}px`,
      display: 'block'
    });
  }

  /**
   * Hide dropdown
   * @param {HTMLElement} container - Container element
   */
  function hideDropdown(container) {
    container.style.display = 'none';
  }

  /**
   * Check if dropdown is visible
   * @param {HTMLElement} container - Container element
   * @returns {boolean} True if visible
   */
  function isDropdownVisible(container) {
    return container.style.display !== 'none';
  }

  /**
   * Initialize hero demo example
   */
  function initializeHeroDemo() {
    createDropdownPicker('#hero-demo', {
      mode: 'single',
      maxMonths: 72,
      initialMonths: 12,
      displayFormat: 'MMMM D, YYYY'
    });
  }

  /**
   * Initialize basic usage example
   */
  function initializeBasicExample() {
    createDropdownPicker('#basic-example', {
      mode: 'single',
      maxMonths: 72,
      initialMonths: 12,
      displayFormat: 'MMM D, YYYY'
    });
  }

  /**
   * Initialize date range example
   */
  function initializeRangeExample() {
    const rangePicker = createDropdownPicker('#range-example', {
      mode: 'range',
      maxMonths: 72,
      initialMonths: 12,
      displayFormat: 'MMM D, YYYY',
      minRangeDays: 2,
      maxRangeDays: 30,
      onChange: (data) => {
        if (data && data.start && data.end) {
          const startText = InfiDateUtils.formatDate(data.start, 'MMM D, YYYY');
          const endText = InfiDateUtils.formatDate(data.end, 'MMM D, YYYY');
          document.querySelector('#range-example').value = `${startText} to ${endText}`;
        }
      }
    });
  }

  /**
   * Initialize date validation example
   */
  function initializeValidationExample() {
    const validationPicker = createDropdownPicker('#validation-example', {
      mode: 'single',
      maxMonths: 72,
      initialMonths: 12,
      displayFormat: 'MMM D, YYYY',
      disable: [
        (date) => {
          // Disable weekends (Sunday = 0, Saturday = 6)
          return date.getDay() === 0 || date.getDay() === 6;
        }
      ],
    });
  }

  /**
   * Initialize modal example
   */
  function initializeModalExample() {
    const modalInput = document.querySelector('#modal-example');
    if (!modalInput) {
      console.error('Modal example input not found');
      return;
    }

    // Create modal container
    const modalContainer = createModalContainer();
    document.body.appendChild(modalContainer);

    // Initialize modal picker
    const modalPicker = new InfiDatePicker(
      modalContainer.querySelector('.sd-calendar-scroll'),
      (data) => handleModalSelection(data, modalInput, modalContainer),
      {
        mode: 'single',
        maxMonths: 72,
        initialMonths: 12,
        displayFormat: 'MMMM D, YYYY'
      }
    );

    // Setup modal event handlers
    setupModalEvents(modalInput, modalContainer);
  }

  /**
   * Create modal container element
   * @returns {HTMLElement} Modal container
   */
  function createModalContainer() {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-picker-container';
    modalContainer.className = 'swiftdate-modal-container';

    modalContainer.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, ${MODAL_CONFIG.BACKDROP_OPACITY});
      z-index: ${MODAL_CONFIG.Z_INDEX};
      justify-content: center;
      align-items: center;
    `;

    // Create modal content
    modalContainer.innerHTML = `
      <div class="infidate-picker" style="width: 400px; max-width: 90vw; background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
        <div class="sd-header" style="padding: 24px 24px 0 24px; text-align: center;">
          <h1 style="margin: 0 0 8px 0; font-size: 24px; color: var(--sd-text-dark, #1f2937);">Select Date</h1>
          <p style="margin: 0; color: var(--sd-gray, #6b7280);">Choose your preferred date</p>
        </div>
        <div class="sd-container" style="width: 100%;">
          <div class="sd-calendar" style="width: 100%;">
            <div class="sd-calendar-scroll" style="width: 100%; max-height: 400px; padding: 0 16px;"></div>
          </div>
        </div>
        <div style="padding: 16px 24px 24px 24px; text-align: right;">
          <button class="modal-close-btn" style="background: var(--sd-gray, #6b7280); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Cancel</button>
        </div>
      </div>
    `;

    return modalContainer;
  }

  /**
   * Handle modal date selection
   * @param {Object} data - Selection data
   * @param {HTMLElement} input - Input element
   * @param {HTMLElement} container - Modal container
   */
  function handleModalSelection(data, input, container) {
    if (data && data.date) {
      input.value = InfiDateUtils.formatDate(data.date, 'MMMM D, YYYY');
      container.style.display = 'none';
    }
  }

  /**
   * Setup modal event handlers
   * @param {HTMLElement} input - Input element
   * @param {HTMLElement} container - Modal container
   */
  function setupModalEvents(input, container) {
    // Input click handler
    input.addEventListener('click', () => {
      container.style.display = 'flex';
    });

    // Close button handler
    const closeBtn = container.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', () => {
      container.style.display = 'none';
    });

    // Backdrop click handler
    container.addEventListener('click', (event) => {
      if (event.target === container) {
        container.style.display = 'none';
      }
    });

    // Escape key handler
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && container.style.display === 'flex') {
        container.style.display = 'none';
      }
    });
  }

  /**
   * Initialize custom formatting example
   */
  function initializeFormatExample() {
    createDropdownPicker('#format-example', {
      mode: 'single',
      maxMonths: 72,
      initialMonths: 12,
      displayFormat: 'dddd, MMMM D, YYYY'
    });
  }

  /**
   * Initialize inline calendar example
   */
  function initializeInlineExample() {
    const inlineContainer = document.querySelector('#inline-example');
    if (!inlineContainer) {
      console.error('Inline example container not found');
      return;
    }

    // Create inline calendar HTML
    inlineContainer.innerHTML = `
      <div class="infidate-picker" style="width: 100%; position: relative;">
        <div class="sd-container" style="width: 100%;">
          <div class="sd-calendar" style="width: 100%;">
            <div class="sd-calendar-scroll" style="width: 100%; max-height: 400px; padding: 0 16px; position: relative;"></div>
          </div>
        </div>
      </div>
    `;

    // Initialize inline picker
    new InfiDatePicker(
      inlineContainer.querySelector('.sd-calendar-scroll'),
      null,
      {
        mode: 'single',
        displayFormat: 'MMMM D, YYYY'
      }
    );
  }

  /**
   * Setup navigation features
   */
  function setupNavigationFeatures() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(event) {
        event.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Setup copy-to-clipboard functionality
   */
  function setupCopyToClipboard() {
    document.querySelectorAll('.example-code pre').forEach(pre => {
      const button = createCopyButton();
      pre.style.position = 'relative';
      pre.appendChild(button);

      // Show/hide button on hover
      pre.addEventListener('mouseenter', () => button.style.opacity = '1');
      pre.addEventListener('mouseleave', () => button.style.opacity = '0');

      // Copy functionality
      button.addEventListener('click', () => {
        const code = pre.querySelector('code').textContent;
        copyToClipboard(code, button);
      });
    });
  }

  /**
   * Create copy button element
   * @returns {HTMLElement} Copy button
   */
  function createCopyButton() {
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.innerHTML = '📋 Copy';
    button.style.cssText = `
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--sd-primary, #4f46e5);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 10;
    `;
    return button;
  }

  /**
   * Copy text to clipboard with user feedback
   * @param {string} text - Text to copy
   * @param {HTMLElement} button - Button element for feedback
   */
  function copyToClipboard(text, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback(button);
      }).catch(() => {
        fallbackCopyToClipboard(text, button);
      });
    } else {
      fallbackCopyToClipboard(text, button);
    }
  }

  /**
   * Fallback copy method for older browsers
   * @param {string} text - Text to copy
   * @param {HTMLElement} button - Button element for feedback
   */
  function fallbackCopyToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      showCopyFeedback(button);
    } catch (err) {
      console.error('Copy failed:', err);
    }

    document.body.removeChild(textArea);
  }

  /**
   * Show copy success feedback
   * @param {HTMLElement} button - Button element
   */
  function showCopyFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '✅ Copied!';
    button.style.background = 'var(--sd-accent-green, #10b981)';

    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = 'var(--sd-primary, #4f46e5)';
    }, 2000);
  }

  /**
   * Setup scroll-based effects
   */
  function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const threshold = 50;

      if (scrollY > threshold) {
        Object.assign(navbar.style, {
          background: 'rgba(255, 255, 255, 0.98)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(8px)'
        });
      } else {
        Object.assign(navbar.style, {
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: 'none',
          backdropFilter: 'blur(4px)'
        });
      }
    });
  }

  /**
   * Setup intersection observer for animations
   */
  function setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe example cards for animation
    document.querySelectorAll('.example-card').forEach(card => {
      Object.assign(card.style, {
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      });
      observer.observe(card);
    });
  }

})(); // End IIFE
