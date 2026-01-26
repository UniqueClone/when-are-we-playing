/* Extracted ConvertedTimes list component.
   Renders placeholder values until hydration is complete.
*/
"use client";
import React from "react";
import { DateTime } from "luxon";
import { Timezone } from "./Timezones";

export interface ConvertedTimesProps {
  timezones: Timezone[];
  date: DateTime | null;
  mounted: boolean;
  formatTime: (d: DateTime, tz: string) => string;
}

// Matches final formatted pattern width: "18:09 - Fri 14 Nov"
const PLACEHOLDER = "··:·· - --- -- ---"; // skeleton placeholder (middle dots)

export default function ConvertedTimes({
  timezones,
  date,
  mounted,
  formatTime,
}: ConvertedTimesProps) {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-medium text-[var(--muted)] mb-3">
        Times in other locations
      </h2>
      <ul
        className="space-y-2"
        aria-busy={!mounted}
        aria-live="polite"
      >
        {timezones.map((tz) => (
          <li
            key={tz.tz}
            className="flex items-center justify-between bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-4 py-3 transition-colors"
          >
            <span className="font-medium text-[var(--foreground)]">
              {tz.label}
            </span>
            <span
              className={`font-mono text-base tabular-nums ${
                mounted
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] animate-pulse"
              }`}
              aria-label={`${tz.label} time ${
                mounted && date ? formatTime(date, tz.tz) : "loading"
              }`}
            >
              {mounted && date ? formatTime(date, tz.tz) : PLACEHOLDER}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
