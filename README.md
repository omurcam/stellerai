# Stellar AI Landing Page - Gemini Effects Setup

## Gemini API (Preview Image Generation)

This project can generate effect previews using Google Gemini.

### 1) Install SDK (already added)

```
npm i @google/generative-ai
```

### 2) Set API Key

Create a `.env` at the project root:

```
GEMINI_API_KEY=your_api_key_here
VITE_GEMINI_API_KEY=your_api_key_here
```

Restart dev server after adding the key.

### 3) Where it’s used

- `lib/gemini.ts` exposes `generateEffectImage` which calls `gemini-2.5-flash` and returns a PNG data URL.
- `components/ImagePlaygroundEnhanced.tsx` calls `generateEffectImage` inside `handleProcess` with the selected effect/enhance.

Note: API keys in the browser are visible. For production, proxy Gemini calls via a backend.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1_YKOR5MbAMJMO5znnd5t2pu7JkJzzyDB

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
