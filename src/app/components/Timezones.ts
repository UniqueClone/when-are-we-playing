/* Server-side timezone configuration module. */
export type Timezone = { label: string; tz: string };

export const TIMEZONES: Timezone[] = [
  { label: "Dublin", tz: "Europe/Dublin" },
  { label: "Madrid", tz: "Europe/Madrid" },
  { label: "Perth", tz: "Australia/Perth" },
];
