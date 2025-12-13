# Google Calendar Extension Setup Guide

This extension requires Google OAuth credentials to access your Google Calendar. Follow these steps to set it up.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](<https://github.com/ddttom/calendar-sidebar>
2. Click "Create Project" (top bar, project dropdown)
3. Enter a project name (e.g., "Calendar Extension")
4. Click "Create"

## Step 2: Enable the Google Calendar API

1. In your new project, go to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in the required fields:
   - **App name**: Calendar Extension
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Click "Save and Continue"
6. On the Scopes page, click "Add or Remove Scopes"
7. Search for and add: `https://www.googleapis.com/auth/calendar.readonly`
8. Click "Update" then "Save and Continue"
9. On the Test users page, click "Add Users" and add your Google email
10. Click "Save and Continue"

## Step 4: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Chrome extension" as the application type
4. **Extension ID**: You'll need to get this from the next step first, then come back here

### Getting Your Extension ID

1. In Edge (or Chrome), go to `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `upcoming-events-extension` folder
5. Copy the Extension ID shown under the extension name
6. Go back to Google Cloud Console
7. Paste the Extension ID into the "Item ID" field
8. Click "Create"
9. **Copy the Client ID** - you'll need this

## Step 5: Update the Extension

1. Open `manifest.json` in the extension folder
2. Find the line with `"client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com"`
3. Replace `YOUR_CLIENT_ID.apps.googleusercontent.com` with the Client ID you copied
4. Save the file

## Step 6: Reload the Extension

1. Go back to `edge://extensions/`
2. Click the reload icon on your extension
3. Click the extension icon in your toolbar
4. Click "Sign in with Google"
5. Grant the requested permissions

## Troubleshooting

### "Error 400: redirect_uri_mismatch"

- Make sure you entered the correct Extension ID in the OAuth client configuration
- The Extension ID must match exactly

### "Access blocked: This app's request is invalid"

- Make sure you enabled the Google Calendar API
- Check that you added the correct scope in the OAuth consent screen

### "This app is blocked"

- Make sure you added yourself as a test user in the OAuth consent screen

### Events not loading

- Click "Refresh Events"
- Try signing out and signing back in
- Check the browser console for errors (F12 > Console tab)

## Privacy Note

This extension:

- Only requests read-only access to your calendar
- Runs entirely in your browser
- Does not send your data to any external servers
- Stores the authentication token locally in your browser

## Support

If you encounter issues:

1. Check the browser console for error messages (F12 > Console)
2. Verify all setup steps were completed correctly
3. Make sure you're using Edge 114+ or Chrome 114+
