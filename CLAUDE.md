# Unscheduled — Project Context

## What It Is

A PWA for spontaneous road trips out of Fort Wayne, Indiana. No itineraries, no sign-ups. Pick a drive time, pick a vibe, hit go. Built to feel like a magazine, not a utility app.

**Tagline:** Go when the feeling hits.

---

## Tech Stack

- Vanilla JS (no framework)
- Plain CSS (custom properties, no Tailwind)
- PWA: manifest.json + service-worker.js
- No build step — everything runs directly from files
- Google Fonts: Playfair Display + Inter (via CDN, cached by SW on first load)

---

## Design System

### Colors
- `--bg: #FAF8F3` — warm cream background
- `--surface: #FFFFFF` — card surfaces
- `--accent: #C25B2F` — terracotta (CTAs, highlights)
- `--accent-dark: #9E3F1A` — pressed state
- `--accent-light: #F5E6DC` — soft accent fill
- `--text: #1C1208` — deep warm brown
- `--text-secondary: #6B5B4E` — secondary text
- `--text-muted: #9A8A7D` — muted labels
- `--border: #E8E0D5` — dividers and borders

### Tag Colors
- History: `#8B5E3C` on `#F5EBE0`
- Nature: `#3A6645` on `#E6F0E8`
- Quirky: `#7B4F8F` on `#F0E8F5`
- Arts: `#2D6B9E` on `#E3EFF8`
- Food: `#B87C22` on `#FBF0DC`
- Music: `#B84B6F` on `#F8E6ED`

### Typography
- Display/headings: Playfair Display (serif, editorial)
- Body/UI: Inter (sans, clean)

---

## File Structure

```
/
├── index.html
├── style.css
├── app.js
├── data.js
├── manifest.json
├── service-worker.js
└── CLAUDE.md
```

---

## The 12 Destinations (from Fort Wayne, IN)

| # | Destination | State | Drive | Anchor | Vibes |
|---|-------------|-------|-------|--------|-------|
| 1 | Indianapolis | IN | 1.5 hrs | Indianapolis Motor Speedway | History, Arts, Food |
| 2 | Cincinnati | OH | 2 hrs | Over-the-Rhine Historic District | History, Arts, Food |
| 3 | Detroit | MI | 2 hrs | Motown Museum | History, Arts, Music, Food |
| 4 | Columbus | OH | 2.5 hrs | Short North Arts District | Arts, Food, Quirky |
| 5 | Chicago | IL | 2.5 hrs | Art Institute & Millennium Park | Arts, Food, History |
| 6 | Louisville | KY | 2.5 hrs | Churchill Downs & Bourbon Row | History, Food, Quirky |
| 7 | Put-in-Bay | OH | 3 hrs | Perry's Victory Monument | Nature, History, Quirky |
| 8 | Cleveland | OH | 3 hrs | Rock & Roll Hall of Fame | History, Arts, Music |
| 9 | Galena | IL | 3.5 hrs | Ulysses S. Grant's Hometown | History, Quirky, Arts |
| 10 | Sleeping Bear Dunes | MI | 3.5 hrs | 450-Ft Sand Dunes over Lake Michigan | Nature, Quirky |
| 11 | Mackinac Island | MI | 4.5 hrs | A Car-Free Island Frozen in Time | Nature, History, Quirky, Food |
| 12 | Nashville | TN | 5 hrs | Honky-Tonk Row on Broadway | Music, Food, Arts |

---

## Filters

- **Drive time selector:** 1 / 2 / 3 / 4 / 5 / 6 hrs — shows destinations where `driveHours <= selected`
- **When selector:** Tonight / This Weekend / Flexible — stored in state, shown in results header
- Default: 3 hrs / This Weekend

## PWA Details

- `theme_color: #C25B2F`
- `background_color: #FAF8F3`
- `display: standalone`
- Icons: reference `icons/icon-192.png` and `icons/icon-512.png` (generate from icon.svg)
- Service worker: cache-first for app shell, network-fallback-to-cache for external resources

---

## Booking.com Integration

Each card links to: `https://www.booking.com/searchresults.html?ss=CITY+STATE`

No affiliate tracking in Phase 1.

---

## Phase Roadmap

- **Phase 1 (current):** Static PWA shell with 12 destinations, filtering, booking links
- **Phase 2:** Geolocation to auto-detect home city, user-saved trips
- **Phase 3:** Dynamic data, real-time availability, photos
