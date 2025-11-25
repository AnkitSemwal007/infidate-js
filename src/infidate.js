/*!
 * infiDate-js - Modern Infinite Scroll DatePicker Library v1.0.0
 * Lightweight, fast, and beautiful datepicker for modern web applications
 * Perfect for travel booking, event planning, and date selection
 *
 * Usage: InfiDate.init({config}) or InfiDate.create(target, config)
 *
 * Features:
 * - Infinite scroll calendar
 * - Single date and date range selection
 * - Mobile-first responsive design
 * - Zero dependencies
 * - Scoped CSS (no conflicts)
 * - Modern ES6+ JavaScript
 * - Travel booking optimized
 *
 * Author: Ankit Semwal
 * License: MIT
 */

(function(window) {
  'use strict';

  // Private utility functions
  const InfiDateUtils = {
    // Static arrays for better performance
    MONTH_NAMES: ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'],
    MONTH_NAMES_SHORT: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    DAY_NAMES: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    DAY_NAMES_SHORT: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    iso: function(d) {
      // Optimized ISO date string generation in local timezone
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },
    
    fdate: function(d) {
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    // Comprehensive date formatting function
    formatDate: function(date, format) {
      if (!date || !format) return this.fdate(date);

      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const dayOfWeek = date.getDay();

      const formatMap = {
        'YYYY': year,
        'YY': String(year).slice(-2),
        'MMMM': this.MONTH_NAMES[month],
        'MMM': this.MONTH_NAMES_SHORT[month],
        'MM': String(month + 1).padStart(2, '0'),
        'M': month + 1,
        'DD': String(day).padStart(2, '0'),
        'D': day,
        'dddd': this.DAY_NAMES[dayOfWeek],
        'ddd': this.DAY_NAMES_SHORT[dayOfWeek],
        'dd': this.DAY_NAMES_SHORT[dayOfWeek].slice(0, 2)
      };

      return format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|dd/g, match => formatMap[match]);
    },

    // Parse date string or return Date object
    parseDate: function(input) {
      if (!input) return null;
      if (input instanceof Date) return input;
      if (input === 'today') return new Date();
      
      // Handle ISO date strings
      if (typeof input === 'string') {
        const date = new Date(input);
        return isNaN(date.getTime()) ? null : date;
      }
      
      return null;
    },

    // Check if date is disabled
    isDateDisabled: function(date, disableArray) {
      if (!disableArray || !Array.isArray(disableArray)) return false;
      
      for (let i = 0; i < disableArray.length; i++) {
        const disable = disableArray[i];
        
        if (typeof disable === 'function') {
          if (disable(date)) return true;
        } else if (typeof disable === 'string') {
          if (this.iso(date) === disable) return true;
        } else if (disable instanceof Date) {
          if (this.iso(date) === this.iso(disable)) return true;
        }
      }
      
      return false;
    },

    // Add days to date
    addDays: function(date, days) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },

    // Get difference in days between two dates
    daysDiff: function(date1, date2) {
      const oneDay = 24 * 60 * 60 * 1000;
      return Math.round((date2 - date1) / oneDay);
    },

    // Check if two dates are the same day
    isSameDay: function(date1, date2) {
      if (!date1 || !date2) return false;
      return this.iso(date1) === this.iso(date2);
    },

    // Get first day of month
    getFirstDayOfMonth: function(date) {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    // Get last day of month
    getLastDayOfMonth: function(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    },

    // Get days in month
    getDaysInMonth: function(date) {
      return this.getLastDayOfMonth(date).getDate();
    },

    // Generate unique ID
    generateId: function() {
      return 'infidate-' + Math.random().toString(36).substr(2, 9);
    },

    // Debounce function
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle function
    throttle: function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  };

  // Main InfiDatePicker class
  class InfiDatePicker {
    constructor(config = {}) {
      // Default configuration
      this.config = {
        mode: 'single', // 'single' or 'range'
        displayMode: 'dropdown', // 'inline', 'dropdown', 'modal'
        attachTo: null,
        minDate: null,
        maxDate: null,
        disable: [],
        position: 'bottom', // 'top', 'bottom', 'auto'
        closeOnSelect: true,
        showBackdrop: true,
        title: null,
        subtitle: null,
        minRangeDays: 1,
        maxRangeDays: 365,
        allowModeSwitch: true,
        defaultToToday: true,
        maxMonths: 12,
        initialMonths: 8,
        scrollThreshold: 150,
        onChange: null,
        onOpen: null,
        onClose: null,
        ...config
      };

      // State
      this.isOpen = false;
      this.selectedDate = null;
      this.selectedStartDate = null;
      this.selectedEndDate = null;
      this.currentMonth = new Date();
      this.loadedMonths = [];
      this.container = null;
      this.calendar = null;
      this.attachedElement = null;
      this.eventListeners = [];

      // Initialize
      this.init();
    }

    init() {
      if (this.config.attachTo) {
        this.attachedElement = typeof this.config.attachTo === 'string'
          ? document.querySelector(this.config.attachTo)
          : this.config.attachTo;
      }

      this.createContainer();
      this.bindEvents();

      if (this.config.displayMode === 'inline') {
        this.show();
      }

      if (this.config.defaultToToday && this.config.mode === 'single') {
        this.selectDate(new Date());
      }
    }

    createContainer() {
      this.container = document.createElement('div');
      this.container.className = `infidate-picker infidate-picker--${this.config.displayMode}`;
      this.container.id = InfiDateUtils.generateId();

      if (this.config.displayMode === 'inline' && this.attachedElement) {
        this.attachedElement.appendChild(this.container);
      } else {
        document.body.appendChild(this.container);
      }

      this.createCalendar();
    }

    createCalendar() {
      const calendarHTML = `
        <div class="infidate-calendar">
          ${this.config.displayMode === 'modal' ? this.createBackdrop() : ''}
          <div class="infidate-content">
            ${this.createHeader()}
            <div class="infidate-months-container">
              <div class="infidate-months" id="${this.container.id}-months"></div>
            </div>
          </div>
        </div>
      `;

      this.container.innerHTML = calendarHTML;
      this.calendar = this.container.querySelector('.infidate-calendar');
      this.monthsContainer = this.container.querySelector('.infidate-months');

      this.loadInitialMonths();
      this.setupInfiniteScroll();
    }

    createBackdrop() {
      return this.config.showBackdrop ? '<div class="infidate-backdrop"></div>' : '';
    }

    createHeader() {
      if (this.config.displayMode === 'inline') {
        return `
          <div class="infidate-header">
            ${this.config.title ? `<h3 class="infidate-title">${this.config.title}</h3>` : ''}
            ${this.config.subtitle ? `<p class="infidate-subtitle">${this.config.subtitle}</p>` : ''}
            ${this.config.allowModeSwitch ? this.createModeSwitch() : ''}
          </div>
        `;
      }
      return '';
    }

    createModeSwitch() {
      return `
        <div class="infidate-mode-switch">
          <button type="button" class="infidate-mode-btn ${this.config.mode === 'single' ? 'active' : ''}" data-mode="single">Single</button>
          <button type="button" class="infidate-mode-btn ${this.config.mode === 'range' ? 'active' : ''}" data-mode="range">Range</button>
        </div>
      `;
    }

    loadInitialMonths() {
      const startMonth = new Date(this.currentMonth);
      startMonth.setDate(1);

      for (let i = 0; i < this.config.initialMonths; i++) {
        const monthDate = new Date(startMonth);
        monthDate.setMonth(startMonth.getMonth() + i);
        this.loadMonth(monthDate);
      }
    }

    loadMonth(monthDate) {
      const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;

      if (this.loadedMonths.includes(monthKey)) return;

      this.loadedMonths.push(monthKey);

      const monthElement = document.createElement('div');
      monthElement.className = 'infidate-month';
      monthElement.dataset.month = monthKey;

      monthElement.innerHTML = this.createMonthHTML(monthDate);
      this.monthsContainer.appendChild(monthElement);
    }

    createMonthHTML(monthDate) {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const monthName = InfiDateUtils.MONTH_NAMES[month];

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      let html = `
        <div class="infidate-month-header">
          <h4>${monthName} ${year}</h4>
        </div>
        <div class="infidate-days-header">
          ${InfiDateUtils.DAY_NAMES_SHORT.map(day => `<div class="infidate-day-name">${day}</div>`).join('')}
        </div>
        <div class="infidate-days-grid">
      `;

      // Empty cells for days before month starts
      for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div class="infidate-day infidate-day--empty"></div>';
      }

      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isDisabled = this.isDateDisabled(date);
        const isSelected = this.isDateSelected(date);
        const isToday = InfiDateUtils.isSameDay(date, new Date());
        const isInRange = this.isDateInRange(date);

        const classes = [
          'infidate-day',
          isDisabled ? 'infidate-day--disabled' : '',
          isSelected ? 'infidate-day--selected' : '',
          isToday ? 'infidate-day--today' : '',
          isInRange ? 'infidate-day--in-range' : ''
        ].filter(Boolean).join(' ');

        html += `<div class="${classes}" data-date="${InfiDateUtils.iso(date)}">${day}</div>`;
      }

      html += '</div>';
      return html;
    }

    isDateDisabled(date) {
      // Check min/max dates
      if (this.config.minDate) {
        const minDate = InfiDateUtils.parseDate(this.config.minDate);
        if (minDate && date < minDate) return true;
      }

      if (this.config.maxDate) {
        const maxDate = InfiDateUtils.parseDate(this.config.maxDate);
        if (maxDate && date > maxDate) return true;
      }

      // Check disable array
      return InfiDateUtils.isDateDisabled(date, this.config.disable);
    }

    isDateSelected(date) {
      if (this.config.mode === 'single') {
        return this.selectedDate && InfiDateUtils.isSameDay(date, this.selectedDate);
      } else {
        return (this.selectedStartDate && InfiDateUtils.isSameDay(date, this.selectedStartDate)) ||
               (this.selectedEndDate && InfiDateUtils.isSameDay(date, this.selectedEndDate));
      }
    }

    isDateInRange(date) {
      if (this.config.mode !== 'range' || !this.selectedStartDate || !this.selectedEndDate) {
        return false;
      }

      return date > this.selectedStartDate && date < this.selectedEndDate;
    }

    setupInfiniteScroll() {
      const scrollHandler = InfiDateUtils.throttle(() => {
        const container = this.monthsContainer;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        // Load more months when near bottom
        if (scrollHeight - scrollTop - clientHeight < this.config.scrollThreshold) {
          this.loadMoreMonths();
        }
      }, 100);

      this.monthsContainer.addEventListener('scroll', scrollHandler);
      this.eventListeners.push({
        element: this.monthsContainer,
        event: 'scroll',
        handler: scrollHandler
      });
    }

    loadMoreMonths() {
      if (this.loadedMonths.length >= this.config.maxMonths) return;

      const lastLoadedMonth = this.loadedMonths[this.loadedMonths.length - 1];
      const [year, month] = lastLoadedMonth.split('-').map(Number);

      const nextMonth = new Date(year, month + 1, 1);
      this.loadMonth(nextMonth);
    }

    bindEvents() {
      // Click events for date selection
      const clickHandler = (e) => {
        const dayElement = e.target.closest('.infidate-day');
        if (!dayElement || dayElement.classList.contains('infidate-day--disabled') || dayElement.classList.contains('infidate-day--empty')) {
          return;
        }

        const dateStr = dayElement.dataset.date;
        if (dateStr) {
          const date = new Date(dateStr);
          this.selectDate(date);
        }
      };

      this.container.addEventListener('click', clickHandler);
      this.eventListeners.push({
        element: this.container,
        event: 'click',
        handler: clickHandler
      });

      // Mode switch events
      if (this.config.allowModeSwitch) {
        const modeSwitchHandler = (e) => {
          const modeBtn = e.target.closest('.infidate-mode-btn');
          if (modeBtn) {
            const newMode = modeBtn.dataset.mode;
            this.switchMode(newMode);
          }
        };

        this.container.addEventListener('click', modeSwitchHandler);
        this.eventListeners.push({
          element: this.container,
          event: 'click',
          handler: modeSwitchHandler
        });
      }

      // Dropdown/Modal specific events
      if (this.config.displayMode !== 'inline') {
        this.bindDropdownModalEvents();
      }

      // Keyboard events
      this.bindKeyboardEvents();
    }

    bindDropdownModalEvents() {
      // Input click to show picker
      if (this.attachedElement) {
        const showHandler = () => this.show();
        this.attachedElement.addEventListener('click', showHandler);
        this.eventListeners.push({
          element: this.attachedElement,
          event: 'click',
          handler: showHandler
        });
      }

      // Outside click to hide
      const outsideClickHandler = (e) => {
        if (this.isOpen && !this.container.contains(e.target) &&
            (!this.attachedElement || !this.attachedElement.contains(e.target))) {
          this.hide();
        }
      };

      document.addEventListener('click', outsideClickHandler);
      this.eventListeners.push({
        element: document,
        event: 'click',
        handler: outsideClickHandler
      });

      // Backdrop click to hide (modal only)
      if (this.config.displayMode === 'modal') {
        const backdropHandler = (e) => {
          if (e.target.classList.contains('infidate-backdrop')) {
            this.hide();
          }
        };

        this.container.addEventListener('click', backdropHandler);
        this.eventListeners.push({
          element: this.container,
          event: 'click',
          handler: backdropHandler
        });
      }

      // Scroll events to reposition dropdown
      if (this.config.displayMode === 'dropdown') {
        const scrollHandler = InfiDateUtils.throttle(() => {
          if (this.isOpen) {
            this.positionDropdown();
          }
        }, 16);

        window.addEventListener('scroll', scrollHandler, true);
        window.addEventListener('resize', scrollHandler);
        this.eventListeners.push(
          {
            element: window,
            event: 'scroll',
            handler: scrollHandler,
            options: true
          },
          {
            element: window,
            event: 'resize',
            handler: scrollHandler
          }
        );
      }
    }

    bindKeyboardEvents() {
      const keyHandler = (e) => {
        if (!this.isOpen) return;

        switch (e.key) {
          case 'Escape':
            e.preventDefault();
            this.hide();
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            // Handle enter/space on focused day
            const focusedDay = this.container.querySelector('.infidate-day:focus');
            if (focusedDay && !focusedDay.classList.contains('infidate-day--disabled')) {
              const dateStr = focusedDay.dataset.date;
              if (dateStr) {
                this.selectDate(new Date(dateStr));
              }
            }
            break;
        }
      };

      document.addEventListener('keydown', keyHandler);
      this.eventListeners.push({
        element: document,
        event: 'keydown',
        handler: keyHandler
      });
    }

    selectDate(date) {
      if (this.isDateDisabled(date)) return;

      if (this.config.mode === 'single') {
        this.selectedDate = date;
        this.updateDisplay();
        this.triggerChange();

        if (this.config.closeOnSelect && this.config.displayMode !== 'inline') {
          this.hide();
        }
      } else {
        this.handleRangeSelection(date);
      }
    }

    handleRangeSelection(date) {
      if (!this.selectedStartDate || (this.selectedStartDate && this.selectedEndDate)) {
        // Start new range
        this.selectedStartDate = date;
        this.selectedEndDate = null;
      } else if (date < this.selectedStartDate) {
        // Selected date is before start, make it the new start
        this.selectedStartDate = date;
        this.selectedEndDate = null;
      } else {
        // Complete the range
        this.selectedEndDate = date;

        // Validate range
        const daysDiff = InfiDateUtils.daysDiff(this.selectedStartDate, this.selectedEndDate);

        if (daysDiff < this.config.minRangeDays - 1) {
          // Range too short, reset
          this.selectedStartDate = date;
          this.selectedEndDate = null;
          return;
        }

        if (daysDiff > this.config.maxRangeDays - 1) {
          // Range too long, reset
          this.selectedStartDate = date;
          this.selectedEndDate = null;
          return;
        }

        this.triggerChange();

        if (this.config.closeOnSelect && this.config.displayMode !== 'inline') {
          this.hide();
        }
      }

      this.updateDisplay();
    }

    updateDisplay() {
      // Update all day elements
      const dayElements = this.container.querySelectorAll('.infidate-day[data-date]');
      dayElements.forEach(dayElement => {
        const dateStr = dayElement.dataset.date;
        const date = new Date(dateStr);

        // Reset classes
        dayElement.className = 'infidate-day';

        // Add state classes
        if (this.isDateDisabled(date)) {
          dayElement.classList.add('infidate-day--disabled');
        }

        if (this.isDateSelected(date)) {
          dayElement.classList.add('infidate-day--selected');
        }

        if (InfiDateUtils.isSameDay(date, new Date())) {
          dayElement.classList.add('infidate-day--today');
        }

        if (this.isDateInRange(date)) {
          dayElement.classList.add('infidate-day--in-range');
        }
      });

      // Update attached input if exists
      if (this.attachedElement && this.attachedElement.tagName === 'INPUT') {
        this.attachedElement.value = this.getFormattedValue();
      }
    }

    getFormattedValue() {
      if (this.config.mode === 'single') {
        return this.selectedDate ? InfiDateUtils.formatDate(this.selectedDate, 'MMM D, YYYY') : '';
      } else {
        if (this.selectedStartDate && this.selectedEndDate) {
          const start = InfiDateUtils.formatDate(this.selectedStartDate, 'MMM D, YYYY');
          const end = InfiDateUtils.formatDate(this.selectedEndDate, 'MMM D, YYYY');
          return `${start} to ${end}`;
        } else if (this.selectedStartDate) {
          return InfiDateUtils.formatDate(this.selectedStartDate, 'MMM D, YYYY');
        }
        return '';
      }
    }

    triggerChange() {
      if (this.config.onChange) {
        const data = this.getChangeData();
        this.config.onChange(data);
      }
    }

    getChangeData() {
      if (this.config.mode === 'single') {
        return {
          date: this.selectedDate,
          formatted: this.selectedDate ? InfiDateUtils.formatDate(this.selectedDate, 'MMM D, YYYY') : null,
          iso: this.selectedDate ? InfiDateUtils.iso(this.selectedDate) : null
        };
      } else {
        const data = {
          start: this.selectedStartDate,
          end: this.selectedEndDate,
          formatted: this.getFormattedValue()
        };

        if (this.selectedStartDate && this.selectedEndDate) {
          data.nights = InfiDateUtils.daysDiff(this.selectedStartDate, this.selectedEndDate);
          data.days = data.nights + 1;
        }

        return data;
      }
    }

    switchMode(newMode) {
      if (newMode === this.config.mode) return;

      this.config.mode = newMode;

      // Reset selections
      this.selectedDate = null;
      this.selectedStartDate = null;
      this.selectedEndDate = null;

      // Update mode buttons
      const modeButtons = this.container.querySelectorAll('.infidate-mode-btn');
      modeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === newMode);
      });

      this.updateDisplay();
    }

    show() {
      if (this.isOpen) return;

      this.isOpen = true;
      this.container.classList.add('infidate-picker--open');

      if (this.config.displayMode === 'dropdown') {
        this.positionDropdown();
      }

      if (this.config.displayMode === 'modal') {
        document.body.style.overflow = 'hidden';
      }

      if (this.config.onOpen) {
        this.config.onOpen();
      }
    }

    hide() {
      if (!this.isOpen) return;

      this.isOpen = false;
      this.container.classList.remove('infidate-picker--open');

      if (this.config.displayMode === 'modal') {
        document.body.style.overflow = '';
      }

      if (this.config.onClose) {
        this.config.onClose();
      }
    }

    positionDropdown() {
      if (!this.attachedElement || this.config.displayMode !== 'dropdown') return;

      const rect = this.attachedElement.getBoundingClientRect();
      const calendarRect = this.calendar.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      let top, left;

      // Horizontal positioning
      left = rect.left;

      // Vertical positioning
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (this.config.position === 'top' ||
          (this.config.position === 'auto' && spaceBelow < calendarRect.height && spaceAbove > spaceBelow)) {
        // Position above
        top = rect.top - calendarRect.height - 2;
      } else {
        // Position below
        top = rect.bottom + 2;
      }

      this.calendar.style.position = 'fixed';
      this.calendar.style.top = `${top}px`;
      this.calendar.style.left = `${left}px`;
      this.calendar.style.zIndex = '9999';
    }

    destroy() {
      // Remove all event listeners
      this.eventListeners.forEach(({ element, event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });

      // Remove container from DOM
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }

      // Reset body overflow if modal was open
      if (this.config.displayMode === 'modal' && this.isOpen) {
        document.body.style.overflow = '';
      }

      // Clear references
      this.container = null;
      this.calendar = null;
      this.attachedElement = null;
      this.eventListeners = [];
    }
  }

  // Main InfiDate API
  const InfiDate = {
    version: '1.0.0',

    // Default configuration
    defaults: {
      mode: 'single',
      displayMode: 'dropdown',
      minDate: null,
      maxDate: null,
      disable: [],
      position: 'bottom',
      closeOnSelect: true,
      showBackdrop: true,
      title: null,
      subtitle: null,
      minRangeDays: 1,
      maxRangeDays: 365,
      allowModeSwitch: true,
      defaultToToday: false,
      maxMonths: 12,
      initialMonths: 8,
      scrollThreshold: 150
    },

    // Create a new datepicker instance
    create: function(target, config = {}) {
      const mergedConfig = { ...this.defaults, ...config };

      if (target) {
        mergedConfig.attachTo = target;
      }

      return new InfiDatePicker(mergedConfig);
    },

    // Convenience methods for quick setup
    singleModal: function(target, onChange) {
      return this.create(target, {
        mode: 'single',
        displayMode: 'modal',
        onChange: onChange
      });
    },

    singleDropdown: function(target, onChange) {
      return this.create(target, {
        mode: 'single',
        displayMode: 'dropdown',
        onChange: onChange
      });
    },

    rangeModal: function(target, onChange) {
      return this.create(target, {
        mode: 'range',
        displayMode: 'modal',
        onChange: onChange
      });
    },

    rangeDropdown: function(target, onChange) {
      return this.create(target, {
        mode: 'range',
        displayMode: 'dropdown',
        onChange: onChange
      });
    },

    // Purpose-specific methods with options
    openSingleDateModal: function(target, options = {}) {
      return this.create(target, {
        mode: 'single',
        displayMode: 'modal',
        ...options
      });
    },

    openSingleDateDropdown: function(target, options = {}) {
      return this.create(target, {
        mode: 'single',
        displayMode: 'dropdown',
        ...options
      });
    },

    openRangeDateModal: function(target, options = {}) {
      return this.create(target, {
        mode: 'range',
        displayMode: 'modal',
        ...options
      });
    },

    openRangeDateDropdown: function(target, options = {}) {
      return this.create(target, {
        mode: 'range',
        displayMode: 'dropdown',
        ...options
      });
    },

    // Utility methods
    parseDate: InfiDateUtils.parseDate,
    formatDate: InfiDateUtils.formatDate,
    isDateDisabled: InfiDateUtils.isDateDisabled,
    addDays: InfiDateUtils.addDays,
    daysDiff: InfiDateUtils.daysDiff,
    isSameDay: InfiDateUtils.isSameDay
  };

  // Export to global scope
  if (typeof window !== 'undefined') {
    window.InfiDate = InfiDate;
    window.InfiDatePicker = InfiDatePicker;
    window.InfiDateUtils = InfiDateUtils;
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InfiDate, InfiDatePicker, InfiDateUtils };
  }

  if (typeof define === 'function' && define.amd) {
    define(function() {
      return { InfiDate, InfiDatePicker, InfiDateUtils };
    });
  }

})(typeof window !== 'undefined' ? window : this);
