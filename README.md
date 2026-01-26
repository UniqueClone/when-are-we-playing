# When Are We Playing?

A simple timezone converter app to help coordinate gaming sessions (or any event) with friends across different timezones.

## Features

- 🌍 **Multi-timezone support** - Convert times between Dublin, Madrid, and Perth
- ⏰ **Quick time adjustments** - Add/subtract hours or days with one click
- 📅 **Google Calendar integration** - Add events directly to your calendar
- 🌙 **Dark mode support** - Respects your system preferences
- 📱 **Responsive design** - Works on mobile and desktop

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/UniqueClone/when-are-we-playing.git
cd when-are-we-playing

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm start
```

## Configuration

### Adding or Modifying Timezones

Edit `src/app/components/Timezones.ts` to customize the available timezones:

```typescript
export const TIMEZONES: Timezone[] = [
  { label: "Dublin", tz: "Europe/Dublin" },
  { label: "Madrid", tz: "Europe/Madrid" },
  { label: "Perth", tz: "Australia/Perth" },
  // Add more timezones using IANA timezone identifiers
];
```

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Luxon](https://moment.github.io/luxon/) - DateTime handling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## License

MIT
