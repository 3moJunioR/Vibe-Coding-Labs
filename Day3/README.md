# Conversational Chat System

Minimal HTML + JavaScript frontend with a Node.js backend that generates the next assistant response from full conversation history.

## Setup

1. Install Node.js 18+.
2. Copy environment template and fill your Google Gemini API key:
   - Windows PowerShell:
     - `Copy-Item .env.example .env`
3. Edit `.env` and set:
   - `GEMINI_API_KEY=your_google_gemini_api_key_here`
  - `GEMINI_MODEL=gemini-2.0-flash-lite`
     - Get a free key at https://ai.google.dev/

## Run

```bash
npm start
```

Open the URL printed in the terminal (`http://localhost:3000` or next free port if 3000 is busy).

## Notes

- Keep API keys only on backend (never in browser JavaScript).
- The frontend sends full `messages` history to `/api/chat`.
- The backend prepends a system prompt and returns only the next assistant reply.
- Uses a configurable Gemini model (default: `gemini-2.0-flash-lite`) for free-tier friendly inference.
