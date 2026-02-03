# Pegasus

A clean authentication app built with React Native and Expo. Swiss-inspired design with dark mode, live clock, and route protection.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Accounts](#test-accounts)
- [Features](#features)
- [Route Protection](#route-protection)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Testing](#testing)
- [Validation Rules](#validation-rules)
- [Tech Stack](#tech-stack)
- [Troubleshooting](#troubleshooting)

## Quick Start

```bash
npm install
npm run web        # browser
npm run ios        # iOS simulator
npm run android    # Android emulator
```

## Test Accounts

Don't want to sign up? Use these:

| Email | Password |
|-------|----------|
| john@example.com | Password123 |
| jane@example.com | Password123 |

These show as "DEMO" accounts on the home screen. Sign up your own and you'll see "NEW" instead.

## Features

**Screens**
- Login - email/password with forgot password link
- Sign Up - with password strength indicator
- Forgot Password - email validation, success toast
- Home - live clock, account badge, profile info

**Core Features**
- Session persistence (stays logged in across page reloads)
- Route protection (can't access protected routes without auth)
- Dark mode toggle (persists)
- Toast notifications (error = red, success = green)
- Form validation with shake animation
- Password visibility toggle
- Responsive layout (works on web too)

**The Design**
- Swiss-inspired: black, white, red
- Bold typography
- Minimal, functional UI

## Route Protection

The app uses conditional screen rendering for auth protection:

| Auth State | Available Screens | URL Access |
|------------|-------------------|------------|
| Logged In | Home only | `/home` only, others redirect to `/home` |
| Logged Out | Login, Signup, ForgotPassword | `/`, `/signup`, `/forgot-password` only |

**How it works:**
- `isAuthenticated = true` → Only Home screen is registered
- `isAuthenticated = false` → Only auth screens are registered
- Attempting to access a non-existent route shows the first available screen
- Session persists via AsyncStorage (survives page reloads)

## Project Structure

```
├── __tests__/          # Unit tests
├── assets/             # App icons, splash screen
├── src/
│   ├── components/     # Reusable UI
│   ├── constants/      # Colors, spacing
│   ├── context/        # Auth, Theme, Toast providers
│   ├── hooks/          # Custom hooks
│   ├── navigation/     # Stack navigator with route guards
│   ├── screens/        # App screens
│   ├── styles/         # Shared styles
│   ├── types/          # TypeScript interfaces
│   └── utils/          # Validation functions
├── App.tsx             # Root component with navigation
├── app.json            # Expo config
├── .eslintrc.js        # ESLint config
├── .prettierrc         # Prettier config
├── jest.config.js      # Jest config
└── tsconfig.json       # TypeScript config
```

## Scripts

```bash
# Development
npm start              # Start Expo
npm run start:clean    # Start with cache cleared
npm run web            # Run in browser

# iOS
npm run ios            # Simulator
npm run ios:device     # Physical device

# Android
npm run android        # Emulator
npm run android:device # Physical device

# Testing
npm test               # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage report

# Code Quality
npm run lint           # Check for issues
npm run lint:fix       # Auto-fix issues
npm run format         # Format with Prettier
npm run typecheck      # TypeScript check

# Maintenance
npm run clean          # Clear build caches
```

## Testing

Tests are written with Jest and React Testing Library.

```bash
npm test                    # Run once
npm run test:watch          # Watch mode (TDD)
npm run test:coverage       # See what's covered
```

**What's tested:**

| Area | Coverage |
|------|----------|
| Validation utils | Email, password, name validation. Password strength. Form validators. |
| Auth context | Login, signup, logout. Demo vs new user detection. Error handling. Session restoration. |

**Test structure:**
- `__tests__/utils/validation.test.ts` - Pure function tests
- `__tests__/context/AuthContext.test.tsx` - Hook tests with renderHook

**Running specific tests:**
```bash
npm test validation         # Only validation tests
npm test AuthContext        # Only auth tests
```

## Validation Rules

**Login**: Email required + valid format. Password required.

**Sign Up**: Name required. Email required + valid + unique. Password 6+ chars.

**Password Strength**:
- Weak: < 3 criteria
- Medium: 3 criteria
- Strong: 4-5 criteria (length 6+, length 8+, uppercase, number, special char)

## Tech Stack

- React Native + Expo SDK 54
- TypeScript (strict mode)
- React Navigation 7
- AsyncStorage (session persistence)
- Jest + React Testing Library
- ESLint + Prettier

## Troubleshooting

**Stuck?** Try:
```bash
npm run clean && npm run start:clean
```

**TypeScript errors?**
```bash
npm run typecheck
```

**Tests failing after changes?**
```bash
npm test -- --clearCache
```

**iOS device not showing?** Unlock it, trust the computer, enable Developer Mode.

**Android device not showing?** Enable USB Debugging, run `adb devices`.

**Web route issues?** Make sure you're testing with `npm run web`, not direct file access.
