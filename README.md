# Mindful Bites - Track Your Meals, Build Healthier Habits

<p align="center">
  <img src="public/fav.svg" alt="Mindful Bites Logo" width="120" height="120">
</p>

Mindful Bites is a modern PWA that helps you develop healthier eating habits through simple meal tracking. Log what you eat, rate nutritional value, track portion sizes, and visualize your eating patterns - all without creating an account.

**[Try it now: https://www.mindful-bites.com](https://www.mindful-bites.com)**

Mindful Bites is a modern PWA that helps you develop healthier eating habits through simple meal tracking. Log what you eat, rate nutritional value, track portion sizes, and visualize your eating patterns - all without creating an account.

### About Development

Mindful Bites started as a vibe coding experiment. The initial version was created with bolt.new. Further improvements were done with GitHub Copilot Chat. Some parts were rewritten by hand after the initial AI-generated version was no longer sufficient.

## Features

- **Quick Meal Logging**: Record what you ate with customizable meal components
- **Health Tracking**: Rate meals on health value and portion size
- **Visualized Stats**: View eating patterns on calendar and in charts
- **No Account Required**: Start using immediately with an anonymous token
- **Cross-Device Access**: Access your data anywhere by saving your token
- **Data Privacy**: Your data belongs to you with easy export options

## Technical Documentation

### Architecture Overview

Mindful Bites uses a modern stack with a focus on simplicity and performance:

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Serverless Netlify Functions
- **Database**: Supabase (PostgreSQL)
- **Routing**: Wouter (lightweight alternative to React Router)
- **UI Components**: Radix UI primitives with custom styling

### Token-Based User System

The application uses a "no-signup" approach for frictionless onboarding:

- Each user receives a unique token on first visit
- This token serves as both identifier and authentication key
- Users can share their token across devices to access their data
- All API requests include the token for authentication
- Tokens are stored locally in the browser's localStorage

This approach provides:

- Zero-friction onboarding (no forms, email verification, or passwords)
- Privacy-first design (no personal data collection)
- Simplified authentication flow

### Progressive Web App

Mindful Bites is built as a PWA with:

- Offline capability
- Install-to-home-screen functionality
- Responsive design for mobile and desktop

### Deployment

The application is deployed to Netlify with:

- Automated builds from GitHub
- Environment variable management
- Edge function distribution

---

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## License

MIT
