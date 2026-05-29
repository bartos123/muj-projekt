# AMS

A lightweight stock asset manager built with a strict focus on visual composition, data density, and user resilience. Inspired by the typographic functionalism of Angiolo Giuseppe Fronzoni.

https://ams-intel.vercel.app/

## TECH STACK
- **Frontend:** React 18, TypeScript (Strict Mode, 0% `any` types)
- **Styling:** Tailwind CSS
- **Data Streams:** Finnhub API, Polygon.io API
- **Charts:** Recharts

## RESILIENCE ENGINEERING
- **Fail-safe Concurrent Loading:** Implemented isolated internal `try-catch` wrappers inside `Promise.all` to prevent cascade failures. If a single stock request fails or hits API rate limits, the application dampens the error, provides cached fallbacks, and keeps the rest of the stream active.
- **Offline-First Capabilities:** Global application state seamlessly synchronizes with `localStorage`. In case of network loss or API throttling (HTTP 429), the interface automatically shifts to cache rendering and triggers a indicator panel in the UI.
- **Dynamic Grid Sizing:** Eliminates visual clutter by automatically backfilling the portfolio view up to an exact multiple of 4/8 cards using empty interactive slots (`+`). Row heights scale dynamically (`auto-rows-max` merged with dynamic flex containment) to prevent layout breakages.

## DESIGN PHILOSOPHY
"We strongly need to avoid waste and excess." Following Fronzoni’s principles, this interface strips away all contemporary UI noise—no drop shadows, no smooth gradients, no generic icons. Information density is achieved strictly by treating white space not as an emptiness, but as a structural architecture. By stripping the interface down to its bare essence, the layout relies entirely on the severe geometric tension of 2px black grids, absolute high-contrast monochrome, and a rigid typographic scale using raw monospaced and heavy sans-serif fonts. Every element is forced to justify its existence; lines exist only to bound data, and the surrounding vacuum exists only to give that data absolute authority.

## LOCAL DEVELOPMENT
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME
npm install
npm run dev
