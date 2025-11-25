// Type definitions for infidate-js v1.0.0
// Project: https://github.com/AnkitSemwal007/infidate-js
// Definitions by: Ankit Semwal

export as namespace InfiDate;

// Selection data interfaces
export interface InfiDateSelectionSingle {
  date: Date;
  formatted: string;
  iso: string;
  timestamp: number;
}

export interface InfiDateSelectionRange {
  start: Date;
  end: Date;
  formatted: {
    start: string;
    end: string;
  };
  iso: {
    start: string;
    end: string;
  };
  nights: number;
  days: number;
  timestamp: {
    start: number;
    end: number;
  };
}

export type InfiDateSelection = InfiDateSelectionSingle | InfiDateSelectionRange;

// Date range object for disable/enable arrays
export interface DateRange {
  from: string | Date;
  to: string | Date;
}

// Configuration interface
export interface InfiDateConfig {
  mode?: 'single' | 'range';
  displayMode?: 'inline' | 'dropdown' | 'modal';
  attachTo?: string | HTMLElement | null;
  minDate?: string | Date | null;
  maxDate?: string | Date | null;
  minYear?: number | null;
  maxYear?: number | null;
  theme?: 'light' | 'dark' | 'auto';
  disable?: Array<string | Date | DateRange | ((date: Date) => boolean)>;
  enable?: Array<string | Date | DateRange | ((date: Date) => boolean)> | null;
  position?: 'top' | 'bottom' | 'auto';
  closeOnSelect?: boolean;
  showBackdrop?: boolean;
  title?: string | null;
  subtitle?: string | null;
  minRangeDays?: number;
  maxRangeDays?: number;
  allowModeSwitch?: boolean;
  defaultToToday?: boolean;
  maxMonths?: number;
  initialMonths?: number;
  scrollThreshold?: number;
  onChange?: ((data: InfiDateSelection) => void) | Array<(data: InfiDateSelection) => void> | null;
  onOpen?: (() => void) | Array<() => void> | null;
  onClose?: (() => void) | Array<() => void> | null;
  onMonthChange?: ((year: number, month: number) => void) | Array<(year: number, month: number) => void> | null;
  onYearChange?: ((year: number) => void) | Array<(year: number) => void> | null;
  onDayCreate?: ((selectedDates: Date[], dateStr: string, instance: InfiDatePickerInstance, dayElement: HTMLElement) => void) | Array<(selectedDates: Date[], dateStr: string, instance: InfiDatePickerInstance, dayElement: HTMLElement) => void> | null;
}

// InfiDatePicker instance interface
export interface InfiDatePickerInstance {
  config: InfiDateConfig;
  show(): void;
  hide(): void;
  destroy(): void;
  selectDate(date: Date | string): void;
  switchMode(mode: 'single' | 'range'): void;
  setTheme(theme: 'light' | 'dark' | 'auto'): void;
}

// Main InfiDate API
export interface InfiDateAPI {
  version: string;
  defaults: InfiDateConfig;
  
  // Main creation method
  create(target?: string | HTMLElement | null, config?: InfiDateConfig): InfiDatePickerInstance;
  
  // Convenience methods
  singleModal(target: string | HTMLElement, onChange?: (data: InfiDateSelectionSingle) => void): InfiDatePickerInstance;
  singleDropdown(target: string | HTMLElement, onChange?: (data: InfiDateSelectionSingle) => void): InfiDatePickerInstance;
  rangeModal(target: string | HTMLElement, onChange?: (data: InfiDateSelectionRange) => void): InfiDatePickerInstance;
  rangeDropdown(target: string | HTMLElement, onChange?: (data: InfiDateSelectionRange) => void): InfiDatePickerInstance;
  
  // Advanced methods with options
  openSingleDateModal(target: string | HTMLElement, options?: InfiDateConfig): InfiDatePickerInstance;
  openSingleDateDropdown(target: string | HTMLElement, options?: InfiDateConfig): InfiDatePickerInstance;
  openRangeDateModal(target: string | HTMLElement, options?: InfiDateConfig): InfiDatePickerInstance;
  openRangeDateDropdown(target: string | HTMLElement, options?: InfiDateConfig): InfiDatePickerInstance;
  
  // Utility methods
  parseDate(input: string | Date | number): Date;
  formatDate(date: Date, format?: string): string;
  isDateDisabled(date: Date, disableRules: Array<string | Date | DateRange | ((date: Date) => boolean)>): boolean;
  isDateEnabled(date: Date, enableRules: Array<string | Date | DateRange | ((date: Date) => boolean)>): boolean;
  addDays(date: Date, days: number): Date;
  daysDiff(date1: Date, date2: Date): number;
  isSameDay(date1: Date, date2: Date): boolean;
}

// InfiDatePicker class
export class InfiDatePicker implements InfiDatePickerInstance {
  constructor(config?: InfiDateConfig);
  config: InfiDateConfig;
  show(): void;
  hide(): void;
  destroy(): void;
  selectDate(date: Date | string): void;
  switchMode(mode: 'single' | 'range'): void;
}

// Utility functions
export interface InfiDateUtilsAPI {
  MONTH_NAMES: string[];
  MONTH_NAMES_SHORT: string[];
  DAY_NAMES: string[];
  DAY_NAMES_SHORT: string[];
  iso(date: Date): string;
  parseDate(input: string | Date | number): Date;
  formatDate(date: Date, format?: string): string;
  isDateDisabled(date: Date, disableRules: Array<string | Date | ((date: Date) => boolean)>): boolean;
  addDays(date: Date, days: number): Date;
  daysDiff(date1: Date, date2: Date): number;
  isSameDay(date1: Date, date2: Date): boolean;
}

// Main exports
declare const InfiDate: InfiDateAPI;
declare const InfiDateUtils: InfiDateUtilsAPI;

export { InfiDate, InfiDateUtils };
export default InfiDate;

