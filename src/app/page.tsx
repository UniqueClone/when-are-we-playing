'use client';
import React, { useState, useEffect } from 'react';

const timezones = [
    { label: 'Dublin', tz: 'Europe/Dublin' },
    { label: 'Madrid', tz: 'Europe/Madrid' },
    { label: 'Perth', tz: 'Australia/Perth' },
];

/**
 * Format the date to a string in the format "HH:MM - ddd dd MMM"
 * @param date the date to format
 * @param tz the timezone to use for formatting
 * @returns the formatted date string
 */
function formatTime(date: Date, tz: string) {
    const formatted = date.toLocaleString('en-ie', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    // Format to "HH:MM - ddd dd MMM"
    const [datePart, timePart] = formatted.split(', ');
    const [day, month, year] = datePart.split(' ');
    const [hour, minute] = timePart.split(':');
    const formattedTime = `${hour}:${minute}`;
    const formattedDate = `${day} ${month} ${year}`;
    const finalFormatted = `${formattedTime} - ${formattedDate}`;
    return finalFormatted;
}

/**
 * Convert a date to a datetime-local input value string in the context of a timezone
 * @param date The date to convert
 * @param tz The timezone to use
 * @returns A string in format YYYY-MM-DDThh:mm suitable for datetime-local input
 */
function dateToLocalString(date: Date, tz: string): string {
    if (!date) return '';
    
    // Get the parts in the target timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    const parts = formatter.formatToParts(date);
    const partValues: {[key: string]: string} = {};
    
    parts.forEach(part => {
        partValues[part.type] = part.value;
    });
    
    // Format as YYYY-MM-DDThh:mm
    return `${partValues.year}-${partValues.month}-${partValues.day}T${partValues.hour}:${partValues.minute}`;
}

/**
 * Create a Date object representing the specified local time in the specified timezone
 * @param localDateString The local date string (YYYY-MM-DDThh:mm)
 * @param tz The timezone
 * @returns A Date object
 */
function localStringToDate(localDateString: string, tz: string): Date {
    if (!localDateString) return new Date();
    
    // Parse the local date string
    const [datePart, timePart] = localDateString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    
    // Create a date string with timezone for the browser to parse
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
    
    // Use the Intl API to format the date for the specified timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
    });
    
    // Create a temporary date object to get the timezone offset
    const tempDate = new Date(dateString);
    
    // Get the parts from the formatter
    const parts = formatter.formatToParts(tempDate);
    const tzOffset = parts.find(part => part.type === 'timeZoneName')?.value || '';
    
    // Create a date string with timezone
    return new Date(`${dateString} ${tzOffset}`);
}

/**
 * Add the event to google calendar
 * @param date the date to add to the calendar
 */
function addToCalendar(date: Date | null) {
    // Only run on client side
    if (typeof window === 'undefined' || !date) {
        return;
    }
    
    const startDate = date.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boys Time&dates=${startDate}/${endDate}`;
    window.open(url, '_blank');
}

export default function Convert() {
    const [selectedTz, setSelectedTz] = useState(timezones[0].tz);
    const [date, setDate] = useState<Date | null>(null);
    const [input, setInput] = useState('');
    
    // Initialize date state on client-side only
    useEffect(() => {
        const currentDate = new Date();
        setDate(currentDate);
        setInput(dateToLocalString(currentDate, selectedTz));
    }, []);

    // Update input field with current date time in selected timezone
    const updateInputFromDate = (newDate: Date | null) => {
        if (!newDate) {
            const currentDate = new Date();
            setDate(currentDate);
            setInput(dateToLocalString(currentDate, selectedTz));
            return;
        }
        
        setDate(newDate);
        setInput(dateToLocalString(newDate, selectedTz));
    };

    const handleInputChange = (value: string) => {
        setInput(value);
        const newDate = localStringToDate(value, selectedTz);
        if (isNaN(newDate.getTime())) {
            const currentDate = new Date();
            setDate(currentDate);
            setInput(dateToLocalString(currentDate, selectedTz));
            return;
        }
        setDate(newDate);
    };

    /**
     * Handle timezone change.
     * When timezone changes, we keep the same visual time but in the new timezone
     * @param value the new timezone value
     */
    const handleTimezoneChange = (value: string) => {
        if (date) {
            // Get the date parts from the current input
            const localTime = input;
            
            // Set the new timezone
            setSelectedTz(value);
            
            // Create a new date that has the same local time in the new timezone
            const newDate = localStringToDate(localTime, value);
            setDate(newDate);
        } else {
            setSelectedTz(value);
        }
    };

    return (
        <div className="max-w-md mt-8 mx-auto pb-24 font-sans bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Time Converter</h2>
            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    Timezone:{' '}
                    <select
                        value={selectedTz}
                        onChange={e => handleTimezoneChange(e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2"
                    >
                        {timezones.map(tz => (
                            <option key={tz.tz} value={tz.tz}>{tz.label}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <input
                                type="datetime-local"
                                value={input}
                                onChange={e => handleInputChange(e.target.value)}
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2"
                            />
                            <button
                                onClick={() => updateInputFromDate(new Date())}
                                className="ml-2 mt-1 px-3 py-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                            >
                                Now
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center mt-2 gap-2">
                            <button
                                onClick={() => {
                                    const newDate = date ? new Date(date.getTime() + 60 * 60 * 1000) : null;
                                    updateInputFromDate(newDate);
                                }}
                                className="px-3 py-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                            >
                                +1hr
                            </button>
                            <button
                                onClick={() => {
                                    const newDate = date ? new Date(date.getTime() - 60 * 60 * 1000) : null;
                                    updateInputFromDate(newDate);
                                }}
                                className="px-3 py-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                            >
                                -1hr
                            </button>
                            <button
                                onClick={() => {
                                    const newDate = date ? new Date(date.getTime() + 24 * 60 * 60 * 1000) : null;
                                    updateInputFromDate(newDate);
                                }}
                                className="px-3 py-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                            >
                                +1d
                            </button>
                            <button
                                onClick={() => {
                                    const newDate = date ? new Date(date.getTime() - 24 * 60 * 60 * 1000) : null;
                                    updateInputFromDate(newDate);
                                }}
                                className="px-3 py-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                            >
                                -1d
                            </button>
                        </div>
                    </div>
                </label>
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Converted Times</h3>
                    <ul className="divide-y divide-gray-200">
                        {timezones.map(tz => (
                            <li
                                key={tz.tz}
                                className="flex items-center py-3 px-2 hover:bg-blue-50 rounded transition-colors"
                            >
                                <span className="flex-1 font-semibold text-gray-700">{tz.label}</span>
                                <span className="ml-4 text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded">
                                    {date ? formatTime(date, tz.tz) : ''}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => addToCalendar(date)}
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Add to Calendar
                    </button>
                </div>
            </div>
        </div>
    );
}
