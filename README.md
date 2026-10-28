# TickerDesk

TickerDesk is a Malayalam-first newsroom workspace for turning source announcements into short, editable broadcast tickers. It keeps each source and ticker together, supports editorial ordering and approval, and exports only valid approved records.

## Features

- Manual Malayalam, English, and mixed-language intake
- UTF-8 `.txt` and CSV bulk import
- Server-side Groq generation through `app/api/generate/route.ts`
- Demo mode for UI testing without pretending output is AI-generated
- Live whitespace-token counter, editing, approval, and reorder controls
- Dark broadcast preview and validated JSON export
- Per-draft machine-readable JSON export for newsroom software

## Setup

### Prerequisites

- Node.js 18.17 or newer
- npm (included with Node.js)
- A [Groq API key](https://console.groq.com/keys) for AI-assisted ticker generation

### Install and configure

From the project directory:

```bash
npm install
```

Create a local environment file from the provided template:

```bash
# macOS/Linux
cp .env.example .env.local

# Windows PowerShell
Copy-Item .env.example .env.local
```

Open `.env.local` and set the API key:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

`GROQ_API_KEY` is required for AI generation. `GROQ_MODEL` is optional and defaults to `openai/gpt-oss-20b`; model availability can change, so set it to another model available to your Groq account when needed. Never commit `.env.local` or share the API key. The key is read only by the server route and is not exposed to browser code.

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser. The main newsroom workspace is available at `/`, and the ticker visual preview is available at `/news-preview`.

If `GROQ_API_KEY` is not configured, enable the explicitly labelled **Demo mode** in the workspace to test the editorial workflow without making AI requests.

### Verify the project

Run the production build and type check before deploying:

```bash
npm run typecheck
npm run build
```

To run the production build locally:

```bash
npm run start
```

## Import formats

TXT files contain one non-empty announcement per line. CSV files must contain an `announcement` or `text` column and may contain a `title` column. Quoted CSV fields and commas inside quoted announcements are supported by Papa Parse.

## Word count and faithfulness

The application counts whitespace-separated tokens using the same `countWords` helper for generation validation, live feedback, approval, and export. A ticker over 10 tokens cannot be approved. The prompt asks Groq to preserve language, names, figures, uncertainty, attribution, and meaning, and the route retries one structurally invalid response. Word-count validation is not factual verification; editors must compare every ticker with its immutable source.

## Export schema

Exports are UTF-8 JSON with `version`, an ISO-8601 `exportedAt`, and ordered `tickers` containing `id`, `order`, `sourceTitle`, `sourceAnnouncement`, `ticker`, and `status`.

Each review card also has an `Export JSON` action for the individual draft. It downloads a UTF-8 file containing the stable ID, source fields, ticker text, status, whitespace-token word count, and export timestamp. This file is intended as a simple machine-readable handoff to newsroom software.

## Manual checklist

1. Add Malayalam and English announcements and confirm they stay intact.
2. Load samples and verify five records, including the adversarial example.
3. Import a UTF-8 TXT file and a quoted CSV with commas.
4. Generate with configured credentials, or enable Demo mode and confirm the notice.
5. Edit a ticker, check the live count, and verify an over-limit ticker cannot be approved.
6. Approve two records, reorder them, and export; verify only approved valid records are present and Malayalam is preserved.

## Known limitations

Drafts are persisted in the browser's local storage, so navigating to the preview or refreshing the page keeps the current queue on that browser. This is local-only persistence: clearing site data, using another browser/device, or opening a private window will not transfer drafts. Automated factual checks cannot prove truth, and the application intentionally leaves final editorial verification to a human. Drag-and-drop, authentication, and server-side persistence are outside the assessment scope.
