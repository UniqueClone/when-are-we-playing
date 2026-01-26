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
    <div className="mt-8 h-full flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-6 text-slate-700 dark:text-slate-200 text-center">
        Converted Times
      </h3>
      <ul
        className="w-full max-w-md divide-y divide-gray-200 dark:divide-slate-800"
        aria-busy={!mounted}
        aria-live="polite"
      >
        {timezones.map((tz) => (
          <li
            key={tz.tz}
            className="flex items-center py-3 px-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <span className="flex-1 font-semibold text-gray-700 dark:text-gray-200">
              {tz.label}
            </span>
            <span
              className={`ml-4 font-mono px-3 py-1 rounded border text-sm sm:text-base ${
                mounted
                  ? "bg-gray-100 text-gray-900 border-gray-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                  : "bg-white text-slate-700 dark:bg-slate-800/60 dark:text-slate-200 border-gray-300 dark:border-slate-600 animate-pulse"
              } transition-colors duration-300`}
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
