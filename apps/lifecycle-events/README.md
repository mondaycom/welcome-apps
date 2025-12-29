# monday.com Lifecycle Events App

This app demonstrates how to handle monday.com app feature lifecycle events with both synchronous and asynchronous processing patterns.

## Overview

This example app shows developers how to:

- Handle feature-level lifecycle events (e.g., board view delete, column delete, etc.)
- Process events synchronously with immediate response (200 OK)
- Process events asynchronously with deferred response (202 Accepted + callback)
- Verify JWT token

## Documentation

For complete information about monday.com app lifecycle subscriptions, see the official documentation:

- [App Lifecycle Subscriptions API Reference](https://developer.monday.com/api-reference/reference/app-lifecycle-subscriptions)

## Features

### Synchronous Processing (`POST /lifecycle/sync`)

- Receives lifecycle event
- Processes immediately
- Returns 200 OK with success response
- Use case: Simple, fast operations that complete quickly

### Asynchronous Processing (`POST /lifecycle/async`)

- Receives lifecycle event
- Returns 202 Accepted immediately
- Processes in background for up to 5 minutes
- Calls back to `back_to_url` when complete
- Use case: Long-running operations, external API calls, complex processing

## Quick Start

### 1. Install Dependencies

```bash
cd apps/lifecycle-events
npm install
```

### 2. Environment Configuration

Create a `.env` file with the following variables:

```bash
# Port for the application to run on
PORT=8080

# JWT Signing Secret - Required for JWT verification (get from your monday.com app page)
MONDAY_SIGNING_SECRET=your_monday_signing_secret_here
```

### 3. Initialize monday.com App

```bash
# Initialize the monday.com app (first time setup)
npm run init
```

### 4. Development

```bash
# Start development server with auto-reload and tunnel
npm run dev

# Or start production server
npm run start
```

### 5. Testing

The app will be available at `http://localhost:8080` with the following endpoints:

- `GET /` - Health check
- `GET /health` - Health check with endpoint info
- `POST /lifecycle/sync` - Sync lifecycle event handler
- `POST /lifecycle/async` - Async lifecycle event handler

## API Endpoints

### Health Check

```http
GET /
GET /health
```

Returns app status and available endpoints.

### Sync Lifecycle Event Handler

```http
POST /lifecycle/sync
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "type": "AppFeatureObject:create",
  "payload": {
    // Event-specific data
  },
  "accountId": 12345,
  "userId": 67890,
  "back_to_url": "https://monday-apps-ms.monday.com/webhook?token={token}"
}
```

**Response (200 OK):**

```json
{
  "message": "Lifecycle event processed successfully",
  "success": true
}
```

### Async Lifecycle Event Handler

```http
POST /lifecycle/async
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "type": "AppFeatureObject:create",
  "payload": {
    // Event-specific data
  },
  "accountId": 12345,
  "userId": 67890,
  "back_to_url": "https://monday-apps-ms.monday.com/webhook?token={token}"
}
```

**Immediate Response (202 Accepted):**

```json
{
  "message": "Async event accepted, processing...",
  "status": "accepted",
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

**Callback to back_to_url (after processing completes):**

```http
POST https://monday-apps-ms.monday.com/webhook?token={token}
Content-Type: application/json

{
  "success": true
}
```

## Authentication

This app uses monday.com standard JWT verification:

- Requires `MONDAY_SIGNING_SECRET` environment variable (get from monday.com app settings)
- Extracts session data: `accountId`, `userId`, and `shortLivedToken`
- Returns 401 for invalid tokens, 500 if signing secret is missing

## Project Structure

```
src/
├── app.ts              # Main Express application
├── routes/
│   ├── index.ts        # Route organization and health checks
│   └── lifecycle.ts    # Simple route definitions
├── controllers/
│   └── lifecycle-controller.ts  # Business logic for lifecycle events
└── middlewares/
    └── authentication.ts        # JWT verification middleware
```

## Use Cases

### Sync Processing Examples

Use sync when the work is fast, deterministic, and doesn't depend on external systems.

- Validate and acknowledge the event (payload checks, auth checks, idempotency checks)
- Small, local state updates (mark "deleted" or "duplicated", update a flag, store a reference)
- Write an audit log or event record (lightweight insert for observability and debugging)
- Cache invalidation or lightweight cache refresh (quick local cache updates)
- Lightweight in-app notifications (signal internally that something happened - avoid anything that requires retries or third-party delivery)

### Async Processing Examples

Use async when the work is slow, may fail or require retries, is rate-limited, or touches external systems.

- External API integrations
- File processing (generate, parse, upload, transform files)
- Email sending or external notifications (deliverability, retries, provider downtime)
- Complex calculations or enrichment (aggregation, ML or AI tagging, heavy compute)
- Database migrations, backfills, or re-indexing (long-running batch operations)

**Rule of thumb**: if it might take more than a moment or needs retries, handle it async.

## Error Handling

The app includes comprehensive error handling:

- JWT verification errors (401 Unauthorized)
- Missing back_to_url for async requests (400 Bad Request)
- Internal server errors (500 Internal Server Error)
- Detailed logging for debugging

## Development

### Available Scripts

- `npm run init` - Initialize monday.com app project (run this first)
- `npm run dev` - Start development server with hot reload and tunnel
- `npm run start` - Start production server
- `npm run expose` - Create monday.com tunnel only (port 8080)

## Troubleshooting

### Common Issues

**401 Unauthorized:**

- Check JWT token is valid
- Verify `MONDAY_SIGNING_SECRET` is set in your `.env` file
- Ensure Authorization header or token query parameter is present
- Token should be received from monday.com webhooks/lifecycle events

**400 Missing back_to_url:**

- Async requests require `data.back_to_url` in request body
- URL must be accessible for callback from your app

**500 Missing MONDAY_SIGNING_SECRET:**

- Ensure `MONDAY_SIGNING_SECRET` is properly set in your `.env` file
- Get the signing secret from your monday.com app settings
- Restart the server after updating `.env`
