import { DateTime } from "luxon";

/**
 * Parses an ISO datetime string for a specific timezone.
 * @param iso - ISO format datetime string (yyyy-MM-ddTHH:mm)
 * @param zone - IANA timezone identifier (e.g., "Europe/Dublin")
 * @returns DateTime object in the specified zone, or current time in that zone if invalid
 */
export function parseInputForZone(iso: string, zone: string): DateTime {
  const dt = DateTime.fromISO(iso, { zone });
  return dt.isValid ? dt : DateTime.now().setZone(zone);
}

/**
 * Formats a DateTime to an ISO-like string for datetime-local inputs.
 * @param dt - The DateTime object to format
 * @returns String in format "yyyy-MM-ddTHH:mm"
 */
export function normalizeInput(dt: DateTime): string {
  return dt.toFormat("yyyy-LL-dd'T'HH:mm");
}

/**
 * Formats a DateTime for display in a specific timezone.
 * @param base - The base DateTime object
 * @param zone - IANA timezone identifier to display the time in
 * @returns Formatted string like "18:09 - Fri 14 Nov"
 */
export function formatDisplay(base: DateTime, zone: string): string {
  return base.setZone(zone).toFormat("HH:mm - ccc dd LLL");
}

/**
 * Generates UTC start and end times for a 1-hour calendar event.
 * @param base - The base DateTime for the event start
 * @returns Object with `start` and `end` strings in Google Calendar format
 */
export function calendarRange(base: DateTime) {
  const startUtc = base.toUTC();
  const endUtc = startUtc.plus({ hours: 1 });
  const fmt = "yyyyLLdd'T'HHmmss'Z'";
  return {
    start: startUtc.toFormat(fmt),
    end: endUtc.toFormat(fmt),
  };
}

/**
 * Gets the current time in a specific timezone, truncated to the minute.
 * @param zone - IANA timezone identifier
 * @returns DateTime object with seconds and milliseconds set to 0
 */
export function nowInZoneTruncated(zone: string): DateTime {
  return DateTime.now().setZone(zone).set({ second: 0, millisecond: 0 });
}

/**
 * Rounds a DateTime down to the nearest hour.
 * @param dt - The DateTime object to round
 * @returns DateTime with minutes, seconds, and milliseconds set to 0
 */
export function clampToHour(dt: DateTime): DateTime {
  return dt.set({ minute: 0, second: 0, millisecond: 0 });
}
