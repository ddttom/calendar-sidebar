// UI elements
const authSection = document.getElementById('authSection');
const mainSection = document.getElementById('mainSection');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const eventsListDiv = document.getElementById('eventsList');
const showPastCheckbox = document.getElementById('showPast');
const daysSelect = document.getElementById('daysSelect');
const loadingIndicator = document.getElementById('loadingIndicator');

let authToken = null;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  
  // Auto-refresh every 5 minutes
  setInterval(() => {
    if (authToken) {
      loadCalendarEvents();
    }
  }, 300000);
});

// Event listeners
signInBtn.addEventListener('click', signIn);
signOutBtn.addEventListener('click', signOut);
refreshBtn.addEventListener('click', () => loadCalendarEvents());
showPastCheckbox.addEventListener('change', () => loadCalendarEvents());
daysSelect.addEventListener('change', () => loadCalendarEvents());

function checkAuthStatus() {
  chrome.runtime.sendMessage({ action: 'getAuthToken' }, (response) => {
    if (response.token) {
      authToken = response.token;
      showMainSection();
      loadCalendarEvents();
    } else {
      showAuthSection();
    }
  });
}

function signIn() {
  chrome.runtime.sendMessage({ action: 'getAuthToken' }, (response) => {
    if (response.error) {
      showError('Failed to sign in: ' + response.error);
    } else {
      authToken = response.token;
      showMainSection();
      loadCalendarEvents();
    }
  });
}

function signOut() {
  chrome.runtime.sendMessage({ action: 'removeAuthToken' }, () => {
    authToken = null;
    showAuthSection();
  });
}

function showAuthSection() {
  authSection.style.display = 'block';
  mainSection.style.display = 'none';
}

function showMainSection() {
  authSection.style.display = 'none';
  mainSection.style.display = 'block';
}

async function loadCalendarEvents() {
  if (!authToken) return;
  
  showLoading(true);
  
  try {
    const days = parseInt(daysSelect.value);
    const showPast = showPastCheckbox.checked;
    
    const now = new Date();
    const timeMin = showPast ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) : now;
    const timeMax = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    const params = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '100'
    });
    
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, need to re-authenticate
        signOut();
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    displayEvents(data.items || []);
  } catch (error) {
    showError(error.message);
  } finally {
    showLoading(false);
  }
}

function displayEvents(events) {
  const now = Date.now();
  const showPast = showPastCheckbox.checked;
  
  // Filter past events if needed
  let filteredEvents = events;
  if (!showPast) {
    filteredEvents = events.filter(event => {
      const eventTime = new Date(event.start.dateTime || event.start.date).getTime();
      return eventTime >= now;
    });
  }
  
  if (filteredEvents.length === 0) {
    eventsListDiv.innerHTML = '<div class="no-events">No events to display</div>';
    return;
  }
  
  eventsListDiv.innerHTML = filteredEvents.map(event => {
    const isAllDay = !!event.start.date;
    const startTime = new Date(event.start.dateTime || event.start.date);
    const endTime = new Date(event.end.dateTime || event.end.date);
    const isPast = startTime.getTime() < now;
    
    const dateStr = formatEventDate(startTime, endTime, isAllDay);
    const timeUntil = isPast ? 'Past event' : getTimeUntil(startTime.getTime());
    const badge = getBadge(startTime.getTime(), isAllDay);
    
    return `
      <div class="event-item ${isPast ? 'past' : ''} ${isAllDay ? 'all-day' : ''}">
        <div class="event-title">
          ${escapeHtml(event.summary || 'No title')}
          ${badge}
        </div>
        <div class="event-date">${dateStr}</div>
        <div class="event-time-until">${timeUntil}</div>
        ${event.location ? `<div class="event-location">📍 ${escapeHtml(event.location)}</div>` : ''}
      </div>
    `;
  }).join('');
}

function formatEventDate(start, end, isAllDay) {
  if (isAllDay) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return start.toLocaleDateString('en-GB', options) + ' (All day)';
  }
  
  const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  
  const datePart = start.toLocaleDateString('en-GB', dateOptions);
  const startTime = start.toLocaleTimeString('en-GB', timeOptions);
  const endTime = end.toLocaleTimeString('en-GB', timeOptions);
  
  return `${datePart} · ${startTime} - ${endTime}`;
}

function getTimeUntil(timestamp) {
  const now = Date.now();
  const diff = timestamp - now;
  
  if (diff < 0) {
    return 'Past event';
  }
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  
  if (weeks > 0) {
    return `in ${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else if (days > 0) {
    return `in ${days} day${days !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `in ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return 'happening now';
  }
}

function getBadge(timestamp, isAllDay) {
  const now = Date.now();
  const diff = timestamp - now;
  const hours = diff / (1000 * 60 * 60);
  const days = diff / (1000 * 60 * 60 * 24);
  
  if (diff < 0) {
    return '';
  }
  
  if (isAllDay) {
    if (days < 1) {
      return '<span class="upcoming-badge all-day-badge">Today</span>';
    }
    return '';
  }
  
  if (hours < 24) {
    return '<span class="upcoming-badge today-badge">Today</span>';
  } else if (days < 7) {
    return '<span class="upcoming-badge">This Week</span>';
  }
  
  return '';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showLoading(show) {
  loadingIndicator.style.display = show ? 'block' : 'none';
  if (show) {
    eventsListDiv.innerHTML = '';
  }
}

function showError(message) {
  eventsListDiv.innerHTML = `
    <div class="error-message">
      ${escapeHtml(message)}
    </div>
  `;
}
