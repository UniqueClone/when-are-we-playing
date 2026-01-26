/* Extracted AddToCalendarButton component.
 * Disabled until a valid Date exists (post-hydration).
 */
"use client";
import React from "react";
import { DateTime } from "luxon";
import { calendarRange } from "./time";

interface AddToCalendarButtonProps {
  date: DateTime | null;
  /** Event title for the calendar entry. Defaults to "Boys Time!". */
  eventTitle?: string;
}

/**
 * Button to add the selected time to Google Calendar.
 * @param date - DateTime to add to calendar
 * @param eventTitle - Optional custom title for the calendar event
 */
export default function AddToCalendarButton({
  date,
  eventTitle = "Boys Time!",
}: AddToCalendarButtonProps) {
  const handleClick = () => {
    if (!date) return;
    const { start, end } = calendarRange(date);
    const encodedTitle = encodeURIComponent(eventTitle);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${start}/${end}&details=Scheduled+via+When+Are+We+Playing&sf=true&output=xml&ctz=${date.zoneName}`;
    window.open(url, "_blank");
  };

  return (
    <button
      disabled={!date}
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-[var(--accent)] rounded-xl hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
      </svg>
      Add to Calendar
    </button>
  );
}
