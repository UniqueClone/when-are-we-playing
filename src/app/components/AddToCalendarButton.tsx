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
      className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 transition"
    >
      Add to Calendar
    </button>
  );
}
