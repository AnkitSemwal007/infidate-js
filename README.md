# infiDate-js

Modern infinite scroll datepicker library for web applications

## Overview

infiDate-js is a lightweight, powerful, and developer-friendly datepicker library that provides infinite scroll functionality, multiple display modes, and comprehensive date selection features. Perfect for travel booking, event planning, and any application requiring sophisticated date selection.

## Key Features

- **Multiple Display Modes** - Inline, dropdown, and modal display options
- **Infinite Scroll Calendar** - Smooth infinite scrolling through months
- **Single & Range Selection** - Support for both single date and date range selection
- **Advanced Validation** - Min/max dates, disabled dates, and custom validation functions
- **Mobile Responsive** - Touch-friendly interface optimized for all devices
- **Zero Dependencies** - No external dependencies required
- **Lightweight** - Minimal footprint with optimized performance
- **Customizable Theming** - CSS custom properties for easy styling
- **Accessibility Support** - ARIA labels and keyboard navigation
- **Modern Browser Support** - ES6+ with fallbacks for older browsers

## Installation

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/infidate-js/dist/infidate.css">
<script src="https://cdn.jsdelivr.net/npm/infidate-js/dist/infidate.js"></script>
```

### NPM

```bash
npm install infidate-js
```

### Manual Download

Download the latest release from [GitHub Releases](https://github.com/AnkitSemwal007/infidate-js/releases)

## Quick Start

### Single Date Picker

```javascript
// Basic single date picker
InfiDate.create('#my-input', {
    mode: 'single',
    onChange: (data) => {
        console.log('Selected date:', data.formatted);
    }
});
```

### Date Range Picker

```javascript
// Date range picker
InfiDate.create('#range-input', {
    mode: 'range',
    onChange: (data) => {
        console.log('Start:', data.formatted.start);
        console.log('End:', data.formatted.end);
        console.log('Nights:', data.nights);
    }
});
```

### Modal Date Picker

```javascript
// Modal date picker
InfiDate.create('#modal-input', {
    displayMode: 'modal',
    mode: 'single',
    title: 'Select Date',
    subtitle: 'Choose your preferred date'
});
```

## Full Usage Examples

### Single Date Selection

```javascript
const singlePicker = InfiDate.create('#single-date', {
    mode: 'single',
    displayMode: 'dropdown',
    minDate: 'today',
    maxDate: '2025-12-31',
    onChange: (data) => {
        console.log('Selected:', data.date);
        console.log('Formatted:', data.formatted);
        console.log('ISO:', data.iso);
    }
});
```

### Date Range Selection

```javascript
const rangePicker = InfiDate.create('#date-range', {
    mode: 'range',
    displayMode: 'modal',
    minDate: new Date(),
    minRangeDays: 2,
    maxRangeDays: 30,
    title: 'Select Travel Dates',
    subtitle: 'Choose check-in and check-out dates',
    onChange: (data) => {
        console.log('Start Date:', data.start);
        console.log('End Date:', data.end);
        console.log('Formatted Start:', data.formatted.start);
        console.log('Formatted End:', data.formatted.end);
        console.log('ISO Start:', data.iso.start);
        console.log('ISO End:', data.iso.end);
        console.log('Nights:', data.nights);
        console.log('Days:', data.days);
    }
});
```

### Inline Calendar

```javascript
const inlineCalendar = InfiDate.create('#inline-calendar', {
    displayMode: 'inline',
    mode: 'range',
    allowModeSwitch: true,
    title: 'Select Dates',
    subtitle: 'Choose single date or range'
});
```

### Advanced Date Validation

```javascript
const validatedPicker = InfiDate.create('#validated-input', {
    mode: 'single',
    minDate: 'today',
    disable: [
        // Disable weekends
        (date) => date.getDay() === 0 || date.getDay() === 6,
        // Disable specific dates
        '2024-12-25',
        '2024-01-01',
        new Date(2024, 11, 24) // Christmas Eve
    ],
    onChange: (data) => {
        console.log('Valid date selected:', data.formatted);
    }
});
```

### Year Range Constraints

```javascript
// Limit calendar to specific years (e.g., 2020-2030)
const yearConstrainedPicker = InfiDate.create('#year-range-input', {
    mode: 'single',
    minYear: 2020,
    maxYear: 2030,
    maxMonths: 120, // 10 years * 12 months
    initialMonths: 12,
    onChange: (data) => {
        console.log('Selected date:', data.formatted);
    }
});
```

### Theme Configuration

```javascript
// Force dark theme
const darkPicker = InfiDate.create('#dark-theme-input', {
    mode: 'single',
    theme: 'dark',
    onChange: (data) => {
        console.log('Selected date:', data.formatted);
    }
});

// Force light theme
const lightPicker = InfiDate.create('#light-theme-input', {
    mode: 'single',
    theme: 'light'
});

// Auto theme (respects browser preference) - default
const autoPicker = InfiDate.create('#auto-theme-input', {
    mode: 'single',
    theme: 'auto' // This is the default
});

// Change theme dynamically
const picker = InfiDate.create('#my-input');
picker.setTheme('dark'); // Switch to dark theme
picker.setTheme('light'); // Switch to light theme
picker.setTheme('auto'); // Switch to auto (browser preference)
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | string | 'single' | Date selection mode: 'single' or 'range' |
| `displayMode` | string | 'dropdown' | Display mode: 'inline', 'dropdown', or 'modal' |
| `attachTo` | string\|Element | null | Target element to attach the picker to |
| `minDate` | string\|Date | null | Minimum selectable date |
| `maxDate` | string\|Date | null | Maximum selectable date |
| `minYear` | number | null | Minimum year to display (e.g., 2020) |
| `maxYear` | number | null | Maximum year to display (e.g., 2030) |
| `theme` | string | 'auto' | Color theme: 'light', 'dark', or 'auto' (browser preference) |
| `disable` | array | [] | Array of dates/functions to disable |
| `position` | string | 'bottom' | Dropdown position: 'top', 'bottom', or 'auto' |
| `closeOnSelect` | boolean | true | Close picker after date selection |
| `showBackdrop` | boolean | true | Show backdrop for modal display |
| `title` | string | null | Title for inline/modal display |
| `subtitle` | string | null | Subtitle for inline/modal display |
| `minRangeDays` | number | 1 | Minimum days in range selection |
| `maxRangeDays` | number | 365 | Maximum days in range selection |
| `allowModeSwitch` | boolean | true | Allow switching between single/range modes |
| `defaultToToday` | boolean | true | Default to today's date for single mode |
| `maxMonths` | number | 72 | Maximum months to load (6 years) |
| `initialMonths` | number | 12 | Initial months to load on open |
| `scrollThreshold` | number | 150 | Pixels from bottom to trigger loading more months |
| `onChange` | function | null | Callback when date selection changes |
| `onOpen` | function | null | Callback when picker opens |
| `onClose` | function | null | Callback when picker closes |

## API Reference

### Main Methods

#### `InfiDate.create(target, config)`
Creates a new datepicker instance.

```javascript
const picker = InfiDate.create('#my-input', {
    mode: 'single',
    displayMode: 'dropdown'
});
```

#### `InfiDate.singleModal(target, onChange)`
Quick setup for single date modal.

```javascript
InfiDate.singleModal('#input', (data) => {
    console.log(data.formatted);
});
```

#### `InfiDate.rangeDropdown(target, onChange)`
Quick setup for range dropdown.

```javascript
InfiDate.rangeDropdown('#input', (data) => {
    console.log(data.start, data.end);
});
```

### Convenience Methods

- `InfiDate.singleDropdown(target, onChange)` - Single date dropdown
- `InfiDate.rangeModal(target, onChange)` - Date range modal
- `InfiDate.openSingleDateModal(target, options)` - Single date modal with options
- `InfiDate.openRangeDateDropdown(target, options)` - Range dropdown with options

### Instance Methods

- `picker.show()` - Show the datepicker
- `picker.hide()` - Hide the datepicker
- `picker.destroy()` - Destroy the datepicker instance
- `picker.selectDate(date)` - Programmatically select a date
- `picker.setTheme(theme)` - Change theme dynamically ('light', 'dark', or 'auto')
- `picker.switchMode(mode)` - Switch between 'single' and 'range' modes

### Utility Methods

- `InfiDate.parseDate(input)` - Parse date string or return Date object
- `InfiDate.formatDate(date, format)` - Format date with custom format
- `InfiDate.addDays(date, days)` - Add days to a date
- `InfiDate.daysDiff(date1, date2)` - Get difference in days between dates
- `InfiDate.isSameDay(date1, date2)` - Check if two dates are the same day

## Callback Data Structure

### Single Date Mode

When `mode: 'single'`, the `onChange` callback receives:

```javascript
{
  date: Date,           // JavaScript Date object
  formatted: string,    // Formatted date string (e.g., "Nov 25, 2025")
  iso: string          // ISO date string (e.g., "2025-11-25")
}
```

### Range Date Mode

When `mode: 'range'`, the `onChange` callback receives:

```javascript
{
  start: Date,          // Start date as JavaScript Date object
  end: Date,            // End date as JavaScript Date object
  formatted: {
    start: string,      // Formatted start date (e.g., "Nov 25, 2025")
    end: string         // Formatted end date (e.g., "Dec 1, 2025")
  },
  iso: {
    start: string,      // ISO start date (e.g., "2025-11-25")
    end: string         // ISO end date (e.g., "2025-12-01")
  },
  nights: number,       // Number of nights between dates
  days: number          // Number of days (nights + 1)
}
```

**Example:**

```javascript
InfiDate.create('#travel-dates', {
  mode: 'range',
  onChange: (data) => {
    console.log(`Trip from ${data.formatted.start} to ${data.formatted.end}`);
    console.log(`Duration: ${data.nights} nights, ${data.days} days`);
    console.log(`ISO format: ${data.iso.start} to ${data.iso.end}`);
  }
});
```

## Advanced Features

### Date Range Validation

```javascript
InfiDate.create('#booking-dates', {
    mode: 'range',
    minRangeDays: 2,
    maxRangeDays: 14,
    minDate: 'today',
    onChange: (data) => {
        if (data.nights < 2) {
            alert('Minimum 2 nights required');
        }
    }
});
```

### Infinite Scroll

The calendar automatically loads more months as you scroll, providing a seamless browsing experience through unlimited date ranges.

### Keyboard Support

- **Arrow Keys** - Navigate between dates
- **Enter/Space** - Select focused date
- **Escape** - Close picker
- **Tab** - Navigate through interactive elements

### Accessibility

- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode support
- Focus management
- Semantic HTML structure

### Mobile Responsiveness

- Touch-friendly interface
- Responsive design for all screen sizes
- Optimized for mobile devices
- Swipe gestures support

## Theming / CSS Variables

Customize the appearance using CSS custom properties:

```css
.infidate-picker {
    --sd-primary: #your-brand-color;
    --sd-primary-hover: #your-hover-color;
    --sd-border-radius: 8px;
    --sd-font-family: 'Your Font', sans-serif;
}
```

Available CSS variables:
- `--sd-primary` - Primary color
- `--sd-primary-hover` - Primary hover color
- `--sd-border` - Border color
- `--sd-bg` - Background color
- `--sd-text` - Text color
- `--sd-radius-*` - Border radius values
- `--sd-spacing-*` - Spacing values

## Real-world Use Cases

### Travel Booking

```javascript
InfiDate.create('#travel-dates', {
    mode: 'range',
    displayMode: 'modal',
    minDate: 'today',
    maxRangeDays: 30,
    title: 'Select Travel Dates',
    subtitle: 'Choose your departure and return dates'
});
```

### Event Planning

```javascript
InfiDate.create('#event-date', {
    mode: 'single',
    minDate: 'today',
    disable: [(date) => date.getDay() === 0], // No Sundays
    title: 'Event Date',
    subtitle: 'Select your event date'
});
```

### Hotel Booking

```javascript
InfiDate.create('#hotel-dates', {
    mode: 'range',
    minRangeDays: 1,
    maxRangeDays: 21,
    closeOnSelect: true,
    onChange: (data) => {
        updatePricing(data.nights);
    }
});
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Versioning / Change Log

### v1.0.0 (2025-01-01)
- Initial release
- Single and range date selection
- Multiple display modes (inline, dropdown, modal)
- Infinite scroll functionality
- Advanced validation features
- Mobile responsive design
- Accessibility support
```
