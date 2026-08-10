# Feather Gallery — Express + HTML/CSS

The original Feather Gallery frontend has been kept as HTML/CSS. API calls and secrets have been moved to an Express backend.

## Architecture

```text
Browser
  │
  ├── HTML + CSS
  └── small browser JS (DOM, GSAP, Swiper, navigation)
           │
           ▼
       Express API
           │
           ├── Gemini → bird details
           ├── Groq → explore/category birds
           ├── Unsplash → bird images
           └── Xeno-canto → bird audio
```

The browser must still have JavaScript for DOM manipulation, animations and click events. Express is the **server-side JavaScript** layer; it cannot directly manipulate the browser DOM.

## Setup

1. Install Node.js 18+.
2. Open this project folder.
3. Run:

```bash
npm install
```

4. Copy `.env.example` to `.env`.
5. Put your API keys in `.env`.
6. Start:

```bash
npm start
```

For development:

```bash
npm run dev
```

7. Open `http://localhost:3000`.

## API endpoints

- `GET /api/birds/details?name=Kingfisher`
- `GET /api/birds/explore`
- `GET /api/birds/category?category=raptors`
- `GET /api/images?bird=Kingfisher&count=3&orientation=landscape`
- `GET /api/audio?query=Common%20Kingfisher`
- `GET /api/health`

## Important

Never put Gemini, Groq, Unsplash or Xeno-canto secret keys in frontend JavaScript. The `.env` file is server-only and is ignored by Git.
