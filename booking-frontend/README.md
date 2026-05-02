# Booking Platform Frontend

A premium, high-performance appointment booking platform built with Next.js, Tailwind CSS, and Zustand.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 (Custom Glassmorphic Theme)
- **State Management**: Zustand (with Persistence)
- **Form Handling**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Calendar**: FullCalendar
- **Analytics**: Recharts

## Project Structure

```
src/
  app/            # App router pages and layouts
  components/     # Reusable UI components
  features/       # Feature-specific logic (Auth, Bookings, etc.)
  lib/            # Utility functions
  services/api/   # Mock API layer matching backend contracts
  store/          # Zustand store definitions
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## API Contracts

This frontend is currently configured with **Mock API Services** located in `src/services/api/`. These services return data that strictly follows the contracts defined for:
- **Auth (Person 1)**: Login/Signup/OTP
- **Slots (Person 3)**: Slot availability browsing
- **Bookings (Person 2)**: Appointment creation and payment integration

To integrate with the real backend, simply replace the mock implementations in `src/services/api/` with real Axios calls.

## Key Features

- **Modern Auth Flow**: Login, Signup with Role selection, and OTP verification.
- **Service Discovery**: Beautifully animated service cards with category filtering.
- **Advanced Slot Picker**: Dynamic date swiper and real-time capacity visualization.
- **Secure Checkout**: Mocked Razorpay payment gateway integration.
- **Management Dashboards**:
  - **Customer**: View and manage (cancel/reschedule) bookings.
  - **Organiser**: FullCalendar visualization of the schedule.
  - **Admin**: Rich data visualization using Recharts.
