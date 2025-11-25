// Index page initialization
document.addEventListener('DOMContentLoaded', function() {
  // Check if InfiDate is loaded
  if (typeof InfiDate === 'undefined') {
    console.error('InfiDate library not loaded');
    return;
  }

  // Hero Demo - Range Modal
  const heroDemo = document.getElementById('hero-demo');
  if (heroDemo) {
    InfiDate.create('#hero-demo', {
      mode: 'range',
      displayMode: 'modal',
      title: 'Select Your Dates',
      subtitle: 'Choose check-in and check-out dates',
      minDate: 'today',
      maxMonths: 72,
      initialMonths: 12,
      onChange: (data) => {
        if (data.start && data.end) {
          heroDemo.value = `${data.formatted.start} to ${data.formatted.end}`;
        }
      }
    });
  }
});

