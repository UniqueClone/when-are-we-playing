'use client';
import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

const timezones = [
    { label: 'Dublin', tz: 'Europe/Dublin' },
    { label: 'Madrid', tz: 'Europe/Madrid' },
    { label: 'Perth', tz: 'Australia/Perth' },
];

/**
 * Format the DateTime to a string in the format "HH:MM - ddd dd MMM yyyy"
 */
function formatTime(dateTime: DateTime) {
    if (!dateTime.isValid) return '';
    return dateTime.toFormat('HH:mm - ccc dd LLL');
}

/**
 * Convert a DateTime to a datetime-local input value string
 */
function dateTimeToLocalString(dateTime: DateTime): string {
    if (!dateTime.isValid) return '';
    return dateTime.toFormat("yyyy-MM-dd'T'HH:mm");
}

/**
 * Create a DateTime object from a datetime-local input value string
 */
function localStringToDateTime(localDateString: string, tz: string): DateTime {
    if (!localDateString) return DateTime.now().setZone(tz);
    return DateTime.fromFormat(localDateString, "yyyy-MM-dd'T'HH:mm", { zone: tz });
}

/**
 * Add the event to google calendar
 */
function addToCalendar(dateTime: DateTime | null) {
    if (typeof window === 'undefined' || !dateTime || !dateTime.isValid) {
        return;
    }

    const startDate = dateTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const endDate = dateTime.plus({ hours: 1 }).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boys Time&dates=${startDate}/${endDate}`;
    window.open(url, '_blank');
}

export default function Convert() {
    const [selectedTz, setSelectedTz] = useState(timezones[0].tz);
    const [dateTime, setDateTime] = useState<DateTime | null>(null);
    const [input, setInput] = useState('');

    // Initialize date state on client-side only
    useEffect(() => {
        const currentDateTime = DateTime.now().setZone(selectedTz);
        setDateTime(currentDateTime);
        setInput(dateTimeToLocalString(currentDateTime));
    }, []);

    // Update input field with current date time in selected timezone
    const updateInputFromDateTime = (newDateTime: DateTime | null) => {
        if (!newDateTime || !newDateTime.isValid) {
            const currentDateTime = DateTime.now().setZone(selectedTz);
            setDateTime(currentDateTime);
            setInput(dateTimeToLocalString(currentDateTime));
            return;
        }

        setDateTime(newDateTime);
        setInput(dateTimeToLocalString(newDateTime));
    };

    const handleInputChange = (value: string) => {
        setInput(value);
        const newDateTime = localStringToDateTime(value, selectedTz);
        if (!newDateTime.isValid) {
            const currentDateTime = DateTime.now().setZone(selectedTz);
            setDateTime(currentDateTime);
            setInput(dateTimeToLocalString(currentDateTime));
            return;
        }
        setDateTime(newDateTime);
    };

    /**
     * Handle timezone change.
     * When timezone changes, we keep the same visual time but in the new timezone
     */
    const handleTimezoneChange = (value: string) => {
        if (dateTime && dateTime.isValid) {
            const localTime = input;
            setSelectedTz(value);
            const newDateTime = localStringToDateTime(localTime, value);
            setDateTime(newDateTime);
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
                                step="300"
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2"
                            />
                            <button
                                onClick={() => updateInputFromDateTime(DateTime.now().setZone(selectedTz))}
                                className="ml-2 mt-1 px-3 py-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                            >
                                Now
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center mt-2 gap-2">
                            <button
                                onClick={() => {
                                    const newDateTime = dateTime ? dateTime.plus({ hours: 1 }) : null;
                                    updateInputFromDateTime(newDateTime);
                                }}
                                className="px-3 py-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                            >
                                +1hr
                            </button>
                            <button
                                onClick={() => {
                                    const newDateTime = dateTime ? dateTime.minus({ hours: 1 }) : null;
                                    updateInputFromDateTime(newDateTime);
                                }}
                                className="px-3 py-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                            >
                                -1hr
                            </button>
                            <button
                                onClick={() => {
                                    const newDateTime = dateTime ? dateTime.plus({ days: 1 }) : null;
                                    updateInputFromDateTime(newDateTime);
                                }}
                                className="px-3 py-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                            >
                                +1d
                            </button>
                            <button
                                onClick={() => {
                                    const newDateTime = dateTime ? dateTime.minus({ days: 1 }) : null;
                                    updateInputFromDateTime(newDateTime);
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
                                    {dateTime ? formatTime(dateTime.setZone(tz.tz)) : ''}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => addToCalendar(dateTime)}
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Add to Calendar
                    </button>
                </div>
            </div>
        </div>
    );
}
