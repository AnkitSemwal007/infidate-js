// Advanced Examples JavaScript
document.addEventListener('DOMContentLoaded', function() {
  initializeAdvancedExamples();

  // Add loading animation
  document.body.classList.add('loading');
});

function initializeAdvancedExamples() {
  // Business Hours Example
  console.log('Creating business-hours picker');
  const businessPicker = SwiftDate.create('#business-hours', {
    mode: 'single',
    displayMode: 'dropdown',
    attachTo: '#business-hours',
    disable: [
      function(date) {
        // Disable weekends
        return date.getDay() === 0 || date.getDay() === 6;
      },
      // Disable holidays
      '2025-12-25', '2025-01-01', '2025-07-04'
    ],
    minDate: 'today',
    displayFormat: 'dddd, MMMM D, YYYY',
    onChange: (data) => {
      // Silent callback for functionality
    }
  });
  console.log('Business picker created:', businessPicker);

  // Meeting Scheduler Example
  console.log('Creating meeting-scheduler picker');
  const meetingPicker = SwiftDate.create('#meeting-scheduler', {
    mode: 'single',
    displayMode: 'modal',
    title: 'Schedule Meeting',
    subtitle: 'Select available date',
    attachTo: '#meeting-scheduler',
    disable: [
      function(date) {
        // Disable weekends and past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today || date.getDay() === 0 || date.getDay() === 6;
      }
    ],
    displayFormat: 'MMMM D, YYYY',
    onChange: function(data) {
      showTimeSlots(data.date);
    }
  });
  console.log('Meeting picker created:', meetingPicker);

  // Project Deadline Example
  const minDeadline = new Date();
  minDeadline.setDate(minDeadline.getDate() + 7); // 1 week minimum

  SwiftDate.create('#project-deadline', {
    mode: 'single',
    displayMode: 'dropdown',
    minDate: minDeadline,
    displayFormat: 'MMMM D, YYYY',
    attachTo: '#project-deadline',
    onChange: (data) => {
      // Silent callback for functionality
    }
  });

  // Hotel Booking Example
  console.log('Creating hotel-booking picker');
  const hotelPicker = SwiftDate.create('#hotel-booking', {
    mode: 'range',
    displayMode: 'modal',
    title: 'Hotel Booking',
    subtitle: 'Select check-in and check-out dates',
    attachTo: '#hotel-booking',
    minDate: 'today',
    minRangeDays: 2, // Minimum 2-night stay
    maxRangeDays: 30, // Maximum 30-night stay
    displayFormat: 'MMM D, YYYY',
    onChange: function(data) {
      if (data.start && data.end) {
        const nights = data.nights;
        const total = nights * 150; // $150 per night
        document.getElementById('hotel-result').innerHTML =
          `<strong>Booking Details:</strong><br>
           Check-in: ${data.formatted.start}<br>
           Check-out: ${data.formatted.end}<br>
           Duration: ${nights} nights<br>
           <strong>Total: $${total.toLocaleString()}</strong>`;
      }
    }
  });
  console.log('Hotel picker created:', hotelPicker);

  // Flight Booking Example
  SwiftDate.create('#flight-booking', {
    mode: 'range',
    displayMode: 'dropdown',
    minDate: 'today',
    maxRangeDays: 365,
    displayFormat: 'MMM D, YYYY',
    attachTo: '#flight-booking',
    onChange: function(data) {
      if (data.start && data.end) {
        const isWeekendDeparture = data.start.getDay() === 0 || data.start.getDay() === 6;
        const isWeekendReturn = data.end.getDay() === 0 || data.end.getDay() === 6;
        const basePrice = (isWeekendDeparture || isWeekendReturn) ? 450 : 350;
        const duration = Math.ceil((data.end - data.start) / (1000 * 60 * 60 * 24));

        document.getElementById('flight-result').innerHTML =
          `<strong>Flight Details:</strong><br>
           Departure: ${data.formatted.start}<br>
           Return: ${data.formatted.end}<br>
           Duration: ${duration} days<br>
           <strong>Price: $${basePrice.toLocaleString()}</strong>
           <span style="color: #64748b;">(${(isWeekendDeparture || isWeekendReturn) ? 'Weekend' : 'Weekday'} rate)</span>`;
      }
    }
  });
}

// Helper function for meeting scheduler
function showTimeSlots(selectedDate) {
  const resultDiv = document.getElementById('meeting-result');
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', 
    '2:00 PM', '3:00 PM', '4:00 PM'
  ];
  
  const availableSlots = timeSlots.filter(() => Math.random() > 0.3); // Simulate availability
  
  if (availableSlots.length > 0) {
    resultDiv.innerHTML = `
      <strong>Available time slots for ${selectedDate.toLocaleDateString()}:</strong><br>
      <div style="margin-top: 0.5rem;">
        ${availableSlots.map(slot => 
          `<span style="display: inline-block; background: #f1f5f9; padding: 0.25rem 0.5rem; 
                  margin: 0.25rem; border-radius: 0.25rem; font-size: 0.875rem;">${slot}</span>`
        ).join('')}
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <strong>No available slots for ${selectedDate.toLocaleDateString()}</strong><br>
      <span style="color: #dc2626; font-size: 0.875rem;">Please select another date</span>
    `;
  }
}

// Add result display styling
const style = document.createElement('style');
style.textContent = `
  .result-display {
    margin-top: 1rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border-left: 4px solid #4f46e5;
    font-size: 0.875rem;
    line-height: 1.5;
    min-height: 60px;
    display: flex;
    align-items: center;
  }
  
  .result-display:empty {
    display: none;
  }
`;
document.head.appendChild(style);

// Copy functionality for code blocks (reuse from main docs)
document.querySelectorAll('.example-code pre').forEach(pre => {
  const button = document.createElement('button');
  button.className = 'copy-btn';
  button.innerHTML = '📋 Copy';
  button.style.cssText = `
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #4f46e5;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
  `;
  
  pre.style.position = 'relative';
  pre.appendChild(button);
  
  pre.addEventListener('mouseenter', () => {
    button.style.opacity = '1';
  });
  
  pre.addEventListener('mouseleave', () => {
    button.style.opacity = '0';
  });
  
  button.addEventListener('click', () => {
    const code = pre.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
      button.innerHTML = '✅ Copied!';
      setTimeout(() => {
        button.innerHTML = '📋 Copy';
      }, 2000);
    });
  });
});
