# 🐾 Bear Tracks

A lightweight, privacy-focused web analytics solution designed for Atlas|Bear's applications. Track essential visitor metrics while maintaining strong security and privacy standards.

## Features

- Privacy-first analytics collection
- Page view tracking
- Visitor information tracking:
  - Country
  - Device type
  - Referrer source
- Visit duration monitoring
- Analytics dashboard with:
  - Total visits and trends
  - Page popularity metrics
  - Geographic distribution
  - Traffic source analysis
  - Time-based analytics

## Tech Stack

- **Frontend**:

  - Next.js 14+
  - React 19
  - TypeScript
  - Tailwind CSS
  - Recharts for data visualization
  - shadcn/ui components

- **Backend**:

  - Next.js API routes
  - Edge functions for tracking
  - Supabase for database

- **Infrastructure**:
  - Netlify for hosting and edge functions
  - Supabase project for data storage

## Getting Started

### Prerequisites

- Node.js 22.x or later
- npm
- Supabase account
- Netlify account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/atlas-bear/bear-tracks.git
cd bear-tracks
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Maintain comprehensive documentation

### Security Considerations

- Minimize data collection to essential metrics
- Implement proper access controls
- Follow privacy-by-design principles
- Regular security audits

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
