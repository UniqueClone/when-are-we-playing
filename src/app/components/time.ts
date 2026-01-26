import { DateTime } from "luxon";

export function parseInputForZone(iso: string, zone: string): DateTime {
  const dt = DateTime.fromISO(iso, { zone });
  return dt.isValid ? dt : DateTime.now().setZone(zone);
}

export function normalizeInput(dt: DateTime): string {
  return dt.toFormat("yyyy-LL-dd'T'HH:mm");
}

export function formatDisplay(base: DateTime, zone: string): string {
  return base.setZone(zone).toFormat("HH:mm - ccc dd LLL");
}

export function calendarRange(base: DateTime) {
  const startUtc = base.toUTC();
  const endUtc = startUtc.plus({ hours: 1 });
  const fmt = "yyyyLLdd'T'HHmmss'Z'";
  return {
    start: startUtc.toFormat(fmt),
    end: endUtc.toFormat(fmt),
  };
}

export function nowInZoneTruncated(zone: string): DateTime {
  return DateTime.now().setZone(zone).set({ second: 0, millisecond: 0 });
}

export function clampToHour(dt: DateTime): DateTime {
  return dt.set({ minute: 0, second: 0, millisecond: 0 });
}
