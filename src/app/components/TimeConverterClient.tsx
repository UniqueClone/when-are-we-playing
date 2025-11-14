/* Client component handling interactive time conversion.
   Responsive fullscreen mobile, centered panel desktop.
   Shows placeholder times until hydration.
*/
"use client";
import React, { useEffect, useMemo, useState } from "react";
import ConvertedTimes from "./ConvertedTimes";
import AddToCalendarButton from "./AddToCalendarButton";
import { Timezone } from "./Timezones";

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

  // State
  const [selectedTz, setSelectedTz] = useState<string>(timezones[0]?.tz ?? "");
  const [date, setDate] = useState<Date | null>(null);
  const [input, setInput] = useState<string>(initialIso);

  // Intl formatters cache
  const formatters = useMemo(
    () =>
      timezones.reduce((acc, tz) => {
        acc[tz.tz] = new Intl.DateTimeFormat("en-IE", {
          timeZone: tz.tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return acc;
      }, {} as Record<string, Intl.DateTimeFormat>),
    [timezones]
  );

  useEffect(() => {
    // Parse initial date after client mounts to avoid SSR mismatch
    const parsed = new Date(initialIso);
    setDate(isNaN(parsed.getTime()) ? new Date() : parsed);
    setMounted(true);
  }, [initialIso]);

  const formatTime = (d: Date, tz: string) => {
    const formatter = formatters[tz];
    const parts = formatter.formatToParts(d);
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((p) => p.type === type)?.value || "";
    const hour = get("hour");
    const minute = get("minute");
    const weekday = get("weekday");
    const day = get("day");
    const month = get("month");
    const year = get("year");
    return `${hour}:${minute} - ${weekday} ${day} ${month} ${year}`;
  };

  const updateInputFromDate = (newDate: Date | null) => {
    const target = newDate ?? new Date();
    setDate(target);
    setInput(target.toISOString().slice(0, 16));
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    const newDate = new Date(value);
    if (isNaN(newDate.getTime())) {
      const current = new Date();
      setDate(current);
      setInput(current.toISOString().slice(0, 16));
      return;
    }
    setDate(newDate);
  };

  const handleTimezoneChange = (value: string) => {
    setSelectedTz(value);
    if (date) updateInputFromDate(date);
  };

  // Unified button style
  const btn =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 shadow-sm dark:shadow-none transition";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <section className="max-h-fit flex-1 w-full px-4 pt-6 pb-24 sm:pb-12 font-sans sm:max-w-2xl sm:mx-auto sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-md sm:bg-white/80 dark:sm:border-slate-700 dark:sm:bg-slate-900/70 flex flex-col">
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
                  onClick={() => updateInputFromDate(new Date())}
                  className={btn}
                >
                  Now
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <button
                  onClick={() =>
                    updateInputFromDate(
                      date ? new Date(date.getTime() + 60 * 60 * 1000) : null
                    )
                  }
                  className={btn}
                >
                  +1hr
                </button>
                <button
                  onClick={() =>
                    updateInputFromDate(
                      date ? new Date(date.getTime() - 60 * 60 * 1000) : null
                    )
                  }
                  className={btn}
                >
                  -1hr
                </button>
                <button
                  onClick={() =>
                    updateInputFromDate(
                      date
                        ? new Date(date.getTime() + 24 * 60 * 60 * 1000)
                        : null
                    )
                  }
                  className={btn}
                >
                  +1d
                </button>
                <button
                  onClick={() =>
                    updateInputFromDate(
                      date
                        ? new Date(date.getTime() - 24 * 60 * 60 * 1000)
                        : null
                    )
                  }
                  className={btn}
                >
                  -1d
                </button>
                <button
                  onClick={() => {
                    if (date) {
                      const d = new Date(date);
                      d.setMinutes(0, 0, 0);
                      updateInputFromDate(d);
                    }
                  }}
                  className={btn}
                >
                  :00
                </button>
              </div>
            </div>
          </label>
        </div>

        <div className="flex-1 flex flex-col justify-center">
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
