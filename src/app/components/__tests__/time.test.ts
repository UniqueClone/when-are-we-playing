import { describe, it, expect } from "vitest";
import { DateTime } from "luxon";
import {
    formatDisplay,
    calendarRange,
    clampToHour,
    parseInputForZone,
    normalizeInput,
    nowInZoneTruncated,
} from "../time";

describe("time utilities", () => {
    describe("formatDisplay", () => {
        it("should format a date in a specific timezone", () => {
            const date = DateTime.fromISO("2024-01-15T10:30:00", {
                zone: "Europe/Dublin",
            });
            const result = formatDisplay(date, "Europe/Madrid");
            expect(result).toMatch(/\d{2}:\d{2} - \w{3} \d{2} \w{3}/);
        });

        it("should handle different timezones correctly", () => {
            const date = DateTime.fromISO("2024-01-15T10:00:00", {
                zone: "Europe/Dublin",
            });
            const dublinTime = formatDisplay(date, "Europe/Dublin");
            const madridTime = formatDisplay(date, "Europe/Madrid");
            // Madrid is 1 hour ahead of Dublin
            expect(dublinTime).toContain("10:");
            expect(madridTime).toContain("11:");
        });
    });

    describe("calendarRange", () => {
        it("should return start and end times in UTC format", () => {
            const date = DateTime.fromISO("2024-01-15T10:30:00", {
                zone: "Europe/Dublin",
            });
            const result = calendarRange(date);
            expect(result).toHaveProperty("start");
            expect(result).toHaveProperty("end");
            expect(result.start).toMatch(/^\d{8}T\d{6}Z$/);
            expect(result.end).toMatch(/^\d{8}T\d{6}Z$/);
        });

        it("should create a 1-hour event", () => {
            const date = DateTime.fromISO("2024-01-15T10:00:00", {
                zone: "Europe/Dublin",
            });
            const result = calendarRange(date);
            const start = DateTime.fromFormat(
                result.start,
                "yyyyLLdd'T'HHmmss'Z'",
                {
                    zone: "utc",
                }
            );
            const end = DateTime.fromFormat(
                result.end,
                "yyyyLLdd'T'HHmmss'Z'",
                {
                    zone: "utc",
                }
            );
            const diff = end.diff(start, "hours").hours;
            expect(diff).toBe(1);
        });
    });

    describe("clampToHour", () => {
        it("should round down to the top of the hour", () => {
            const date = DateTime.fromISO("2024-01-15T10:45:30.500");
            const result = clampToHour(date);
            expect(result.minute).toBe(0);
            expect(result.second).toBe(0);
            expect(result.millisecond).toBe(0);
            expect(result.hour).toBe(10);
        });
    });

    describe("parseInputForZone", () => {
        it("should parse a valid ISO string for a specific timezone", () => {
            const result = parseInputForZone(
                "2024-01-15T10:30",
                "Europe/Dublin"
            );
            expect(result.isValid).toBe(true);
            expect(result.zoneName).toBe("Europe/Dublin");
        });

        it("should return current time in zone if ISO is invalid", () => {
            const result = parseInputForZone("invalid-date", "Europe/Madrid");
            expect(result.isValid).toBe(true);
            expect(result.zoneName).toBe("Europe/Madrid");
        });
    });

    describe("normalizeInput", () => {
        it("should format DateTime to datetime-local input format", () => {
            const date = DateTime.fromISO("2024-01-15T10:30:00");
            const result = normalizeInput(date);
            expect(result).toBe("2024-01-15T10:30");
        });
    });

    describe("nowInZoneTruncated", () => {
        it("should return current time in specified zone with seconds truncated", () => {
            const result = nowInZoneTruncated("Europe/Dublin");
            expect(result.isValid).toBe(true);
            expect(result.zoneName).toBe("Europe/Dublin");
            expect(result.second).toBe(0);
            expect(result.millisecond).toBe(0);
        });
    });
});
