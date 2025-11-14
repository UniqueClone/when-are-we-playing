/* Extracted AddToCalendarButton component.
 * Disabled until a valid Date exists (post-hydration).
 */
"use client";
import React from "react";

interface AddToCalendarButtonProps {
  date: Date | null;
}

/**
 * Button to add the selected time to Google Calendar.
 * @param date Date to add.
 */
export default function AddToCalendarButton({
  date,
}: AddToCalendarButtonProps) {
  const handleClick = () => {
    if (!date) return;
    const startDate = date.toISOString().replace(/-|:|\.\d+/g, "");
    const endDate = new Date(date.getTime() + 60 * 60 * 1000)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boys Time&dates=${startDate}/${endDate}`;
    window.open(url, "_blank");
  };

  return (
    <button
      disabled={!date}
      onClick={handleClick}
      className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Add to Calendar
    </button>
  );
}
