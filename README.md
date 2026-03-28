# IndiaLens — Photography Location Scout for India

**Discover the best photography spots across India. Plan your shoot with exact golden hour times, sun direction, live weather, and community tips.**

> [Live App](https://india-lens.vercel.app) &nbsp;|&nbsp; Built with Next.js, Leaflet, SunCalc & Open-Meteo

![IndiaLens Map View](https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80)

---

## The Problem

India has some of the most photogenic locations on Earth — from the Taj Mahal at dawn to Ladakh's Pangong Lake under the Milky Way. But planning a photography trip here is painful:

- **"When should I go?"** — India has extreme seasonal variation. Shooting the Rann of Kutch in monsoon is a washout; visiting the Valley of Flowers in winter means bare rock. Most travel guides don't think in terms of *light quality* and *weather windows* the way photographers do.

- **"Where exactly do I stand?"** — Knowing a location exists isn't enough. You need the *exact vantage point* — which side of the river, which rooftop, which trail bend gives you the composition you saw online. GPS coordinates for the camera position and the subject position are essential but almost never shared.

- **"What time do I need to be there?"** — Golden hour, blue hour, sunrise azimuth — these change by date and location. Photographers currently juggle 3-4 separate apps (PhotoPills, weather apps, Google Maps) to plan a single shoot.

- **"Is it worth the effort?"** — Crowd levels, accessibility, monsoon closures, permit requirements — this practical info is scattered across blog posts, forum threads, and years-old TripAdvisor reviews.

**There's no single platform that combines location scouting, sun planning, weather, and photographer-specific tips for India.**

---

## How IndiaLens Solves It

IndiaLens is a **community-driven map + metadata layer** built specifically for photographers scouting locations in India. It combines four things that are usually spread across separate apps:

### 1. Curated Photo Spots with GPS Precision
Every spot includes:
- **Exact GPS coordinates** for the location
- **Camera position** (where to stand) and **subject position** (what to point at) — just like LocationScout
- **Shot types** — landscape, architecture, wildlife, street, astro, portrait, aerial, waterscape
- Photographer-written **tips** (best lens, angles, what to avoid)
- **Parking & access notes**

### 2. Sun Calculator (Built-in)
Powered by [SunCalc.js](https://github.com/mourner/suncalc), every spot detail page shows:
- **Sunrise / sunset times** for any date you pick
- **Golden hour windows** (AM & PM)
- **Solar noon, dusk, and nadir**
- **Azimuth compass dials** — see exactly which direction the sun rises and sets from your vantage point

No need to switch to PhotoPills or The Photographer's Ephemeris.

### 3. Live Weather
Pulled from [Open-Meteo](https://open-meteo.com/) (free, no API key):
- Current temperature & feels-like
- Humidity, wind speed
- Weather condition with visual icons

### 4. India-Specific Seasonal Intelligence
- **Best months** highlighted per spot — based on light quality, weather, and accessibility (not just tourist season)
- **Monsoon accessibility flag** — critical for half of India from June-September
- **Nearby festivals** — Dev Deepawali in Varanasi, Desert Festival in Jaisalmer, Rann Utsav in Kutch
- **Crowd level ratings** — so you know if you need to arrive at 4 AM or can shoot at leisure

### 5. Smart Filtering
Find what you need fast:
- Filter by **region** (15 states/territories)
- Filter by **shot type** (8 categories)
- Filter by **best month** — current month is auto-highlighted
- **Text search** across names, regions, and tags

---

## What's in the App

| Page | What It Does |
|---|---|
| `/` **Map** | Dark-themed interactive map with colour-coded pins (blue = landscape, violet = architecture, green = wildlife, orange = street, indigo = astro). Sidebar with scrollable spot cards. Search + filters. Map/List toggle. |
| `/explore` | Browse all 30 spots in a responsive grid. Filter by month, shot type, and region with one-click chips. Featured spots section. |
| `/spots/[id]` | Full spot detail — hero image, description, month heatmap bar, time-of-day badges, tips, GPS coords with Google Maps link, Sun Calculator with date picker + compass dials, live weather widget, crowd/accessibility/monsoon badges, nearby festivals. |
| `/submit` | Community submission form — name, GPS, shot types, best months, time of day, accessibility, crowd level, tips, parking notes, tags. |

---

## Spots Covered (30 locations across 15 regions)

| Region | Spots |
|---|---|
| **Rajasthan** | Taj Mahal (Mehtab Bagh), Jaisalmer Fort, Sam Sand Dunes, Ranthambore |
| **Ladakh** | Pangong Tso, Nubra Valley, Magnetic Hill |
| **Himachal Pradesh** | Key Monastery (Spiti), Triund Ridge |
| **Uttarakhand** | Valley of Flowers, Roopkund Lake, Har Ki Dun |
| **Kerala** | Alleppey Backwaters, Munnar Tea Estates, Kovalam Lighthouse |
| **Goa** | Chapora Fort |
| **Tamil Nadu** | Brihadeeswarar Temple, Pamban Bridge |
| **Karnataka** | Hampi (Hemakuta Hill), Coorg (Abbey Falls) |
| **Maharashtra** | Ajanta Caves, Lonavala (Tiger's Leap) |
| **West Bengal** | Tiger Hill (Darjeeling), Sundarbans |
| **Meghalaya** | Dawki River, Living Root Bridges |
| **Gujarat** | Rann of Kutch |
| **Sikkim** | Gurudongmar Lake |
| **Andhra Pradesh** | Araku Valley |
| **Uttar Pradesh** | Varanasi Ghats |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router, TypeScript) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Map | [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) + [CartoDB Dark Matter](https://carto.com/basemaps/) tiles |
| Sun Position | [SunCalc.js](https://github.com/mourner/suncalc) |
| Weather | [Open-Meteo API](https://open-meteo.com/) (free, no key) |
| Icons | [Lucide React](https://lucide.dev/) |
| Dates | [date-fns](https://date-fns.org/) |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/ritwikraj16/india-lens.git
cd india-lens

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

No API keys needed — the app uses free, keyless services (CartoDB tiles, Open-Meteo weather).

---

## Roadmap

### Crowdsourced Data — Making the Dataset Richer

The app currently ships with 30 curated spots, but the real power comes when **thousands of photographers contribute their own hidden gems**. The crowdsourcing roadmap:

- [ ] **Public spot submissions with moderation** — Anyone can submit a spot via the `/submit` form. Submissions go into a review queue. Approved spots are merged into the live dataset, credited to the contributor.
- [ ] **User accounts & profiles** — Sign in with Google/GitHub. Your profile shows all spots you've contributed, your upvotes, and a "Scout Score" reputation badge (Explorer, Pathfinder, Trailblazer) based on contribution quality.
- [ ] **Upvote & verify system** — Community members can upvote spots and mark them as "Verified" (I've been here, the info is accurate). Higher-verified spots rank higher in search and get the "Community Verified" badge.
- [ ] **Photo uploads per spot** — Contributors can attach their own photos (Cloudinary-hosted) to any spot, building a real gallery that shows the location in different seasons, light conditions, and compositions.
- [ ] **Edits & corrections** — Wiki-style edit suggestions: update access notes, flag a closed trail, add a new festival, correct GPS — reviewed by spot owner or moderators before going live.
- [ ] **Comments & shot logs** — Photographers leave timestamped notes: "Visited Mar 2026, fog cleared by 7:30am, 70-200mm was perfect from the east bank." Over time this builds a living knowledge base per spot.
- [ ] **Regional ambassadors** — Verified local photographers who moderate submissions for their region, ensuring data quality stays high as the dataset scales.
- [ ] **Bulk import via GPS-tagged photos** — Drag-drop a batch of GPS-tagged images, and the app auto-extracts coordinates, clusters nearby shots into spots, and pre-fills the submission form.
- [ ] **Open data API** — A public REST API (`/api/spots`) so third-party apps, travel blogs, and mapping tools can query the crowdsourced dataset (with attribution).

The goal: go from 30 curated spots to **5,000+ community-verified locations** across every state in India, with real photographer data that no single person could ever collect alone.

### Other Enhancements

- [ ] **Database** — Move from static JSON to PostgreSQL + PostGIS (Supabase)
- [ ] **User auth** — Google OAuth via NextAuth for accounts + spot ownership
- [ ] **Offline mode** — Cache spots + sun data for field use without connectivity
- [ ] **Drone/permit overlay** — Show DGCA no-fly zones and permit requirements on the map
- [ ] **Mobile app** — React Native wrapper with native map + GPS
- [ ] **AI recommendations** — "I'm in Rajasthan for 3 days in November, what should I shoot?" powered by Claude

---

## Contributing

Found a great photo spot in India? Use the **Add Spot** page in the app or open a PR adding to `lib/spots.ts`.

---

## License

MIT

---

Built with [Claude Code](https://claude.ai/code)
