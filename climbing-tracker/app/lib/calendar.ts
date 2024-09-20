import { google } from 'googleapis';

export async function addEventToGoogleCalendar(accessToken: string, climbDetails: any) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: climbDetails.peak,
    location: climbDetails.location,
    description: `Climb to ${climbDetails.peak} on ${climbDetails.date}. Elevation: ${climbDetails.elevation} ft.`,
    start: {
      dateTime: climbDetails.date,
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: climbDetails.endDate, // Add logic to calculate end date or time
      timeZone: 'America/Los_Angeles',
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    throw error;
  }
}
