# Google Calendar Extension

A Microsoft Edge/Chrome extension that displays your Google Calendar events in a permanent sidebar.

## Features

- View your Google Calendar events in a sidebar
- Permanent sidebar that stays open while browsing
- Auto-refreshes every 5 minutes
- Filter to show or hide past events
- Choose time range (today, 7 days, 14 days, or 30 days)
- Visual badges for today and this week
- Shows event location, time, and countdown
- Supports all-day events
- Read-only access to your calendar (cannot modify events)

## Setup Required

**Important**: This extension requires OAuth configuration to access your Google Calendar. You'll need to create a Google Cloud project and obtain OAuth credentials.

See [SETUP.md](SETUP.md) for detailed setup instructions.

## Quick Start

1. Follow the complete setup guide in [SETUP.md](SETUP.md)
2. Install the extension in Edge or Chrome
3. Update the `manifest.json` with your OAuth client ID
4. Reload the extension
5. Click the extension icon and sign in with Google

## Installation

### For Microsoft Edge

1. Open Edge and navigate to `edge://extensions/`
2. Enable "Developer mode" using the toggle on the left sidebar
3. Click "Load unpacked"
4. Select the `upcoming-events-extension` folder
5. The extension icon will appear in your Edge toolbar

### For Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right
3. Click "Load unpacked"
4. Select the `upcoming-events-extension` folder
5. The extension icon will appear in your Chrome toolbar

## Usage

### First-Time Setup

1. Click the extension icon to open the sidebar
2. Click "Sign in with Google"
3. Grant calendar read permissions
4. Your events will load automatically

### Viewing Events

Events are displayed in chronological order. Each event shows:
- Event title
- Date and time (or "All day" for all-day events)
- Time remaining (e.g., "in 2 weeks", "in 3 hours")
- A badge if the event is today or this week
- Location (if set)

### Controls

- **Refresh Events**: Manually refresh your calendar (also auto-refreshes every 5 minutes)
- **Show past events**: Tick to display events that have already occurred
- **Days to show**: Select time range (today, next 7 days, 14 days, or 30 days)
- **Sign Out**: Remove your Google account and stop showing events

## Technical Details

- Built with vanilla JavaScript (no dependencies)
- Uses Google Calendar API v3
- Uses Chrome Identity API for OAuth authentication
- Uses Chrome Side Panel API for permanent sidebar
- Manifest V3 compatible
- Read-only access to calendar (cannot modify events)
- Authentication token stored locally in browser

## File Structure

```
upcoming-events-extension/
├── manifest.json       # Extension configuration with OAuth settings
├── background.js       # Service worker for authentication
├── sidepanel.html      # UI structure
├── sidepanel.js        # Calendar API integration
├── sidepanel.css       # Styling
├── icon16.png          # 16x16 icon
├── icon48.png          # 48x48 icon
├── icon128.png         # 128x128 icon
├── SETUP.md            # Detailed setup instructions
└── README.md           # This file
```

## Permissions

- `identity`: OAuth authentication with Google
- `storage`: Store authentication state
- `https://www.googleapis.com/*`: Access Google Calendar API
- Calendar scope: `https://www.googleapis.com/auth/calendar.readonly` (read-only)

## Browser Compatibility

This extension works on Microsoft Edge (version 114+) and Chrome (version 114+), as well as other Chromium-based browsers (Brave, Vivaldi, etc.) that support the Side Panel API with Manifest V3.
