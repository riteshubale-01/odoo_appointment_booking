# Slot & Availability Module

This is the **Slot & Availability Module** for the appointment booking platform, built using NestJS, Prisma, PostgreSQL, and Redis. It handles the core responsibilities for **Person 3**, providing APIs for slot generation and availability checking.

## Prerequisites

- **Node.js** (v18+)
- **Docker Desktop** (If you want to run PostgreSQL and Redis easily)
- **npm** (Node Package Manager)

## Setup Instructions

### 1. Start Database & Redis (Docker)
Since you need PostgreSQL and Redis, the easiest way is to use Docker Compose.
Open your terminal in this directory (`c:\Ritesh\Work\slot-availability-service`) and run:
```bash
docker-compose up -d
```
*Note: If you don't have Docker installed, you will need to manually install PostgreSQL and Redis and update the `.env` file accordingly.*

### 2. Configure Environment Variables
Copy `.env.example` (or just create `.env`) and ensure your `DATABASE_URL` is pointing to the Postgres database:
```env
DATABASE_URL="postgresql://admin:password@localhost:5432/booking_db?schema=public"
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PORT=3000
```

### 3. Initialize Prisma Schema
Push the Prisma schema to the database to create the required tables:
```bash
npx prisma db push
```

### 4. Run the Application
Install any remaining dependencies (if needed) and run the app:
```bash
npm install
npm run start:dev
```

The server will start on `http://localhost:3000`.

---

## Testing the APIs

You can use Postman, or any REST client to test the following APIs:

### 1. Generate Slots
**POST** `http://localhost:3000/slots/generate`
```json
{
  "service_id": "YOUR_SERVICE_UUID",
  "start_date": "2026-05-02",
  "end_date": "2026-05-08"
}
```
*Note: Ensure you have manually inserted a mock `Service` record into your Postgres database using Prisma Studio (`npx prisma studio`) before generating slots!*

### 2. Get Available Slots
**GET** `http://localhost:3000/slots?service_id=YOUR_SERVICE_UUID&date=2026-05-02`

Response Example:
```json
{
  "success": true,
  "message": "Slots retrieved successfully",
  "data": [
    {
      "slot_id": "uuid",
      "service_id": "uuid",
      "date": "2026-05-02",
      "start_time": "10:00",
      "end_time": "10:30",
      "available_capacity": 2,
      "total_capacity": 3,
      "status": "available"
    }
  ],
  "error": null
}
```

### 3. Internal Booking API
This API is an internal endpoint to be used by the **Booking Engine (Person 2)** to lock and decrement a slot's capacity using Redis distributed locks and DB Transactions.
**POST** `http://localhost:3000/slots/internal/book`
```json
{
  "slot_id": "SLOT_UUID"
}
```

---

## Integration Details for the Team

- **Response Format:** Implemented a global interceptor to enforce the `{ success, message, data, error }` contract.
- **Validation:** Implemented global `ValidationPipe` with `class-validator` to automatically reject bad request payloads.
- **Error Handling:** Global Exception filter maps all errors into the standard response format.
- **Locking:** Redis is used via `ioredis` to prevent race conditions during slot booking.
