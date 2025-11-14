/* Server component assembling time converter.
   Provides per-request initial timestamp and timezone list.
*/
import { TIMEZONES } from "./Timezones";
import TimeConverterClient from "./TimeConverterClient";

export default function TimeConverterPage() {
  // Per-request timestamp (trimmed to minutes for datetime-local)
  const initialIso = new Date().toISOString().slice(0, 16);
  return <TimeConverterClient initialIso={initialIso} timezones={TIMEZONES} />;
}
