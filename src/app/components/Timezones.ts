/* Server-side timezone configuration module. */
export type Timezone = { label: string; tz: string };

export const TIMEZONES: Timezone[] = [
  { label: "Dublin", tz: "Europe/Dublin" },
  { label: "Amsterdam", tz: "Europe/Amsterdam" },
  { label: "Perth", tz: "Australia/Perth" },
];
