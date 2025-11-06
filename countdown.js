// Global variables
let events = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  loadEvents();
  renderEvents();
  startCountdownTimer();
  
  // Add event listeners for Enter key
  document.getElementById('event-name').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addEvent();
    }
  });
  
  document.getElementById('event-date').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addEvent();
    }
  });
  
  document.getElementById('event-time').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addEvent();
    }
  });
});

// Add new event
function addEvent() {
  const nameInput = document.getElementById('event-name');
  const dateInput = document.getElementById('event-date');
  const timeInput = document.getElementById('event-time');
  
  const name = nameInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;
  
  // Validation
  if (!name) {
    alert('Please enter an event name');
    nameInput.focus();
    return;
  }
  
  if (!date) {
    alert('Please select a date');
    dateInput.focus();
    return;
  }
  
  // Use current time if no time is provided
  const eventDateTime = time ? `${date}T${time}` : `${date}T00:00`;
  const eventDate = new Date(eventDateTime);
  
  // Check if date is in the future
  if (eventDate <= new Date()) {
    alert('Please select a future date and time');
    return;
  }
  
  // Create event object
  const event = {
    id: Date.now().toString(),
    name: name,
    date: eventDate.toISOString()
  };
  
  // Add to events array
  events.push(event);
  
  // Save to localStorage
  saveEvents();
  
  // Clear inputs
  nameInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
  
  // Re-render events
  renderEvents();
  
  // Show success message
  showNotification(`Event "${name}" added successfully!`);
}

// Render all events
function renderEvents() {
  const container = document.getElementById('events-container');
  
  if (events.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No events added yet</p>
        <p>Add your first event to see the countdown!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  
  events.forEach(event => {
    const eventElement = createEventElement(event);
    container.appendChild(eventElement);
  });
}

// Create event element
function createEventElement(event) {
  const li = document.createElement('li');
  li.className = 'event-item';
  li.setAttribute('data-id', event.id);
  
  const eventDate = new Date(event.date);
  const now = new Date();
  const timeDiff = eventDate - now;
  
  // Calculate countdown values
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
  // Format date for display
  const formattedDate = eventDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
  
  li.innerHTML = `
    <div class="event-info">
      <div class="event-name">${event.name}</div>
      <div class="event-date">${formattedDate}</div>
    </div>
    <div class="countdown">
      <div class="countdown-item">
        <div class="countdown-value" id="days-${event.id}">${days}</div>
        <div class="countdown-label">Days</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-value" id="hours-${event.id}">${hours}</div>
        <div class="countdown-label">Hours</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-value" id="minutes-${event.id}">${minutes}</div>
        <div class="countdown-label">Minutes</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-value" id="seconds-${event.id}">${seconds}</div>
        <div class="countdown-label">Seconds</div>
      </div>
    </div>
    <button class="delete-btn" onclick="deleteEvent('${event.id}')">Delete</button>
  `;
  
  return li;
}

// Delete event
function deleteEvent(id) {
  if (confirm('Are you sure you want to delete this event?')) {
    events = events.filter(event => event.id !== id);
    saveEvents();
    renderEvents();
    showNotification('Event deleted successfully!');
  }
}

// Update countdown for all events
function updateCountdowns() {
  events.forEach(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const timeDiff = eventDate - now;
    
    if (timeDiff <= 0) {
      // Event has passed
      document.querySelector(`[data-id="${event.id}"] .countdown`).innerHTML = 
        '<div class="countdown-item" style="background: #27ae60;">Event Started!</div>';
      return;
    }
    
    // Calculate countdown values
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Update DOM elements
    const daysEl = document.getElementById(`days-${event.id}`);
    const hoursEl = document.getElementById(`hours-${event.id}`);
    const minutesEl = document.getElementById(`minutes-${event.id}`);
    const secondsEl = document.getElementById(`seconds-${event.id}`);
    
    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
  });
}

// Start countdown timer
function startCountdownTimer() {
  updateCountdowns();
  setInterval(updateCountdowns, 1000);
}

// Save events to localStorage
function saveEvents() {
  localStorage.setItem('countdownEvents', JSON.stringify(events));
}

// Load events from localStorage
function loadEvents() {
  const savedEvents = localStorage.getItem('countdownEvents');
  if (savedEvents) {
    events = JSON.parse(savedEvents);
    
    // Filter out past events (optional - you might want to keep them)
    const now = new Date();
    events = events.filter(event => new Date(event.date) > now);
  }
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #27ae60;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    font-weight: 500;
    transition: all 0.3s;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}