/* Client component handling interactive time conversion.
   Refactored to use Luxon DateTime for timezone operations.
   Base date now resides in selected timezone (input reflects selected timezone).
   Responsive fullscreen mobile, centered panel desktop.
   Shows placeholder times until hydration.
*/
"use client";
import React, { useEffect, useState } from "react";
import ConvertedTimes from "./ConvertedTimes";
import AddToCalendarButton from "./AddToCalendarButton";
import { Timezone } from "./Timezones";
import {
    parseInputForZone,
    normalizeInput,
    formatDisplay,
    nowInZoneTruncated,
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
    const [mounted, setMounted] = useState(false);
    const [selectedTz, setSelectedTz] = useState<string>(
        timezones[0]?.tz ?? ""
    );
    const [date, setDate] = useState<DateTime | null>(null);
    const [input, setInput] = useState<string>(initialIso);

    // Initialize date in selected timezone after mount (to avoid SSR mismatch).
    useEffect(() => {
        if (!mounted) {
            const dt = parseInputForZone(initialIso, selectedTz);
            setDate(dt);
            setInput(normalizeInput(dt));
            setMounted(true);
        }
    }, [initialIso, selectedTz, mounted]);

    const updateInputFromDate = (newDt: DateTime | null) => {
        const target = newDt ?? nowInZoneTruncated(selectedTz);
        setDate(target);
        setInput(normalizeInput(target));
    };

    const handleInputChange = (value: string) => {
        setInput(value);
        const parsed = parseInputForZone(value, selectedTz);
        if (!parsed.isValid) {
            const fallback = nowInZoneTruncated(selectedTz);
            setDate(fallback);
            setInput(normalizeInput(fallback));
            return;
        }
        setDate(parsed);
    };

    const handleTimezoneChange = (value: string) => {
        setSelectedTz(value);
        setDate(prev => {
            const base = prev ?? nowInZoneTruncated(value);
            // Preserve displayed wall time when changing timezone.
            const rezoned = base.setZone(value, { keepLocalTime: true });
            setInput(normalizeInput(rezoned));
            return rezoned;
        });
    };

    const formatTime = (dt: DateTime, tz: string) => formatDisplay(dt, tz);

    const btnPrimary =
        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] transition-all";

    const btnSecondary =
        "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium bg-[var(--card)] text-[var(--foreground)] border border-[var(--card-border)] hover:bg-[var(--card-border)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] transition-all";

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <main
                id="main-content"
                className="w-full min-h-screen px-4 py-6 sm:py-10 sm:px-6 md:max-w-xl md:mx-auto"
            >
                <header className="mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
                        When Are We Playing?
                    </h1>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                        Find the perfect time across timezones
                    </p>
                </header>

                {/* Card */}
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-4 sm:p-6 space-y-6">
                    {/* Timezone selector */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                            Your timezone
                        </label>
                        <select
                            value={selectedTz}
                            onChange={e => handleTimezoneChange(e.target.value)}
                            className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-[var(--foreground)] px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                        >
                            {timezones.map(tz => (
                                <option key={tz.tz} value={tz.tz}>
                                    {tz.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date/time input */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                            Date & time
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                value={input}
                                onChange={e =>
                                    handleInputChange(e.target.value)
                                }
                                aria-label="Select date and time"
                                className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-[var(--foreground)] px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                            />
                            <button
                                onClick={() =>
                                    updateInputFromDate(
                                        nowInZoneTruncated(selectedTz)
                                    )
                                }
                                className={btnPrimary}
                            >
                                Now
                            </button>
                        </div>

                        {/* Quick adjust buttons */}
                        <div className="grid grid-cols-5 gap-2 mt-3">
                            <button
                                onClick={() =>
                                    updateInputFromDate(
                                        date
                                            ? date.minus({ hours: 1 })
                                            : nowInZoneTruncated(selectedTz)
                                    )
                                }
                                aria-label="Subtract one hour"
                                className={btnSecondary}
                            >
                                −1h
                            </button>
                            <button
                                onClick={() =>
                                    updateInputFromDate(
                                        date
                                            ? date.plus({ hours: 1 })
                                            : nowInZoneTruncated(selectedTz)
                                    )
                                }
                                aria-label="Add one hour"
                                className={btnSecondary}
                            >
                                +1h
                            </button>
                            <button
                                onClick={() =>
                                    updateInputFromDate(
                                        date
                                            ? date.minus({ days: 1 })
                                            : nowInZoneTruncated(selectedTz)
                                    )
                                }
                                aria-label="Subtract one day"
                                className={btnSecondary}
                            >
                                −1d
                            </button>
                            <button
                                onClick={() =>
                                    updateInputFromDate(
                                        date
                                            ? date.plus({ days: 1 })
                                            : nowInZoneTruncated(selectedTz)
                                    )
                                }
                                aria-label="Add one day"
                                className={btnSecondary}
                            >
                                +1d
                            </button>
                            <button
                                onClick={() =>
                                    updateInputFromDate(
                                        date
                                            ? clampToHour(date)
                                            : nowInZoneTruncated(selectedTz)
                                    )
                                }
                                aria-label="Round down to hour"
                                className={btnSecondary}
                            >
                                :00
                            </button>
                        </div>
                    </div>
                </div>

                {/* Converted times */}
                <ConvertedTimes
                    timezones={timezones}
                    date={date}
                    mounted={mounted}
                    formatTime={formatTime}
                />

                {/* Calendar button */}
                <div className="mt-6 flex justify-center">
                    <AddToCalendarButton date={date} />
                </div>
            </main>
        </div>
    );
}
