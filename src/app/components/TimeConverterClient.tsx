/* Client component handling interactive time conversion.
   Refactored to use Luxon DateTime for timezone operations.
   Responsive fullscreen mobile, centered panel desktop.
   Shows placeholder times until hydration.
*/
"use client";
import React, { useEffect, useState } from "react";
import ConvertedTimes from "./ConvertedTimes";
import AddToCalendarButton from "./AddToCalendarButton";
import { Timezone } from "./Timezones";
import {
  parseInput,
  normalizeInput,
  formatDisplay,
  nowLocalTruncated,
  clampToHour,
} from "./time";
import { DateTime } from "luxon";

interface TimeConverterClientProps {
  timezones: Timezone[];
  initialIso: string; // yyyy-MM-ddTHH:mm (truncated to minutes)
}

export default function TimeConverterClient({
  timezones,
  initialIso,
}: TimeConverterClientProps) {
  // Hydration flag
  const [mounted, setMounted] = useState(false);

  // State (Luxon)
  const [selectedTz, setSelectedTz] = useState<string>(timezones[0]?.tz ?? "");
  const [date, setDate] = useState<DateTime | null>(null);
  const [input, setInput] = useState<string>(initialIso);

  useEffect(() => {
    // Parse initial date after client mounts to avoid SSR mismatch
    const dt = parseInput(initialIso);
    setDate(dt);
    setInput(normalizeInput(dt));
    setMounted(true);
  }, [initialIso]);

  const updateInputFromDate = (newDt: DateTime | null) => {
    const target = newDt ?? nowLocalTruncated();
    setDate(target);
    setInput(normalizeInput(target));
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    const parsed = parseInput(value);
    if (!parsed.isValid) {
      const fallback = nowLocalTruncated();
      setDate(fallback);
      setInput(normalizeInput(fallback));
      return;
    }
    setDate(parsed);
  };

  const handleTimezoneChange = (value: string) => {
    setSelectedTz(value);
    // No mutation of base date; conversions happen in display phase.
  };

  // Display formatting wrapper
  const formatTime = (dt: DateTime, tz: string) => formatDisplay(dt, tz);

  // Unified button style
  const btn =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 shadow-sm dark:shadow-none transition";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <section className="flex-1 w-full px-4 pt-6 pb-24 sm:pb-12 font-sans sm:max-w-2xl sm:mx-auto sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-md sm:bg-white/80 dark:sm:border-slate-700 dark:sm:bg-slate-900/70 flex flex-col">
        <header className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-center text-slate-900 dark:text-slate-100">
            Time Converter
          </h2>
          <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
        </header>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            Timezone:
            <select
              value={selectedTz}
              onChange={(e) => handleTimezoneChange(e.target.value)}
              className="mt-2 block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2"
            >
              {timezones.map((tz) => (
                <option key={tz.tz} value={tz.tz}>
                  {tz.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                  type="datetime-local"
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2"
                />
                <button
                  onClick={() => updateInputFromDate(nowLocalTruncated())}
                  className={btn}
                >
                  Now
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <button
                  onClick={() =>
                    updateInputFromDate(
                      date ? date.plus({ hours: 1 }) : nowLocalTruncated()
                    )
                  }
                  className={btn}
                >
                  +1hr
                </button>
                <button
                  onClick={() =>
                    updateInputFromDate(
                      date ? date.minus({ hours: 1 }) : nowLocalTruncated()
                    )
                  }
                  className={btn}
                >
                  -1hr
                </button>
                <button
                  onClick={() =>
                    updateInputFromDate(
                      date ? date.plus({ days: 1 }) : nowLocalTruncated()
                    )
                  }
                  className={btn}
                >
                  +1d
                </button>
                <button
                  onClick={() =>
                    updateInputFromDate(
                      date ? date.minus({ days: 1 }) : nowLocalTruncated()
                    )
                  }
                  className={btn}
                >
                  -1d
                </button>
                <button
                  onClick={() =>
                    updateInputFromDate(
                      date ? clampToHour(date) : nowLocalTruncated()
                    )
                  }
                  className={btn}
                >
                  :00
                </button>
                <button
                  onClick={() => updateInputFromDate(nowLocalTruncated())}
                  className={btn}
                >
                  Reset
                </button>
              </div>
            </div>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          <ConvertedTimes
            timezones={timezones}
            date={date}
            mounted={mounted}
            formatTime={formatTime}
          />
        </div>

        <div className="mt-auto pt-6 flex justify-center">
          <AddToCalendarButton date={date} />
        </div>
      </section>
    </div>
  );
}
