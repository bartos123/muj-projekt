# AMS

A lightweight stock asset manager built with a strict focus on visual composition, data density, and user resilience. Inspired by the typographic functionalism of Angiolo Giuseppe Fronzoni.

👉 https://ams-intel.vercel.app/

<img width="1920" height="1115" alt="obrazek" src="https://github.com/user-attachments/assets/b6f37e64-828d-484d-9711-c382ca77b6f2" />

## TECH STACK
- **Frontend:** React 18, TypeScript (Strict Mode, 0% `any` types)
- **Styling:** Tailwind CSS 
- **Data Streams:** Finnhub API, Polygon.io API 
- **Charts:** Recharts

## SYSTEM ARCHITECTURE, CORE MODULES
The codebase is strictly modularized, separating volatile state logic (custom hooks) from declarative layouts and spatial UI experiments.

### 1. INTEL AGGREGATION ENGINE (`/hooks`)
- `usePortfolio.ts`: Orchestrates the global application state, handling defensive `localStorage` cache hydration with type-filtering safeguards. Features an asynchronous Finnhub pipeline with explicit HTTP 429 rate-limit logging and invalid symbol alerts. Manages real-time memoized financial statistics (`stats`) and a share-scaling controller that mathematically recalculates weighted Dollar-Cost Averaging (DCA) buy prices using strict `isFinite` and `isNaN` runtime blocks.
- `useNews.ts`: Controls the asynchronous news cycle, isolating data fetch layers to maintain application uptime during third-party service degradation.

### 2. DATAVISUALIZATION & ABSTRACTION (`/components`)
- `Dashboard.tsx` & `Matrix.tsx`: Rather than rendering raw lists, the analytical engine handles asset allocation weightings using a custom Long-Tail filter. It computes a specific percentage threshold (5%), automatically compressing low-exposure assets into a singular aggregated layout component (`+`) to preserve visual data density.

### 3. THE POSTER EXPERIMENTS (`/components/UI/Poster/variations`)
- A systematic design exploration consisting of 13 separate programmatic layouts (`Poster1.tsx` to `Poster13.tsx`).
- This module serves as a creative code archive.
- #### SELECTED VARIATIONS GALLERY
<table>
  <tr>
    <td width="33.3%"><img src="https://github.com/user-attachments/assets/d0725356-0753-45a1-95cd-721b836caddb" width="100%" /></td>
    <td width="33.3%"><img src="https://github.com/user-attachments/assets/744040bd-2e60-45de-830c-9b7baa914b83" width="100%" /></td>
    <td width="33.3%"><img src="https://github.com/user-attachments/assets/1493db28-7be2-4036-b182-5a625122973a" width="100%" /></td>
  </tr>
  <tr>
    <td width="33.3%"><img src="https://github.com/user-attachments/assets/ee557999-324c-48b8-9181-4a738fc50edb" width="100%" /></td>
    <td width="33.3%"><img src="https://github.com/user-attachments/assets/1304de0e-5b95-4160-893f-c567c2f01fa5" width="100%" /></td>
    <td width="33.3%"> <img src="https://github.com/user-attachments/assets/1ddf392e-8c1f-495c-9912-8a6d5cd0387a" ></td>
</table>

## RESILIENCE ENGINEERING
- **Fail-safe Concurrent Loading:** Implemented isolated internal `try-catch` wrappers inside `Promise.all` to prevent cascade failures. If a single stock request fails or hits API rate limits, the application dampens the error, provides cached fallbacks, and keeps the rest of the stream active.
- **Offline-First Capabilities:** Global application state seamlessly synchronizes with `localStorage`. In case of network loss or API throttling (HTTP 429), the interface automatically shifts to cache rendering and triggers a brutalist indicator panel in the UI.
- **Dynamic Grid Sizing:** Eliminates visual clutter by automatically backfilling the portfolio view up to an exact multiple of 4/8 cards using empty interactive slots (`+`). Row heights scale dynamically (`auto-rows-[50%]` inside a strict flex container) to guarantee perfect fold coverage on standard viewports.

## DESIGN PHILOSOPHY
"We strongly need to avoid waste and excess." Following Fronzoni’s principles, this interface strips away all contemporary UI noise—no drop shadows, no smooth gradients, no generic icons. Information density is achieved exactly how Fronzoni commanded layout: by treating white space not as an emptiness, but as a structural architecture. By stripping the interface down to its bare essence, the layout relies entirely on the severe geometric tension of 2px black grids, absolute high-contrast monochrome, and a rigid typographic scale using raw monospaced and heavy sans-serif fonts. Every element is forced to justify its existence; lines exist only to bound data, and the surrounding vacuum exists only to give that data absolute authority.

## LOCAL DEVELOPMENT
```bash
git clone https://github.com/bartos123/AMS.git
cd AMS
npm install
npm run dev
