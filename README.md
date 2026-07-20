# AI Lab — Laravel AI SDK

A hands-on learning lab for the [Laravel AI SDK](https://laravel.com/docs/13.x/ai-sdk) (`laravel/ai`). One page per feature, each with a plain-language explanation, a step-by-step breakdown (input → process → output), and an interactive demo.

Built as a study project — not a production app.

## Features

Accessible from the sidebar after login:

- **Basic prompt** — send text to an agent and get a response
- **File analysis** — attach a document and let the model analyze it
- **Images** — generate images from a text prompt
- **Audio (TTS)** — turn text into speech
- **Transcription (STT)** — transcribe an audio file, with optional diarization
- **Embeddings** — turn text into vectors and visualize them
- **RAG** — conceptual page explaining retrieval-augmented generation

## Stack

Laravel 13 · PHP 8.4 · Inertia v3 · React 19 · Tailwind CSS v4 · Pest 4

## Provider

The lab uses **OpenAI** only — it's the single provider that covers every capability demonstrated here (text, images, TTS, STT, embeddings), so one API key runs everything. Since the SDK is multi-provider, switching later is just a config/key change.

## Setup

```bash
# 1. Install dependencies
composer install
npm install

# 2. Environment
cp .env.example .env
php artisan key:generate

# 3. Add your OpenAI key to .env
#    OPENAI_API_KEY=sk-...

# 4. Database (--seed creates a demo admin: admin@app.com / password)
php artisan migrate --seed

# 5. Run (server + queue + vite)
composer run dev
```

Then open the app, register (or log in with the seeded admin), and explore the AI Lab from the sidebar.

## Tests

```bash
php artisan test
```
