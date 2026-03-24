export interface Update {
  id: string;
  date: string;
  title: string;
  summary: string;
  status?: "Pre-Alpha" | "Alpha" | "In Development";
  content: string;
}

export const updates: Update[] = [
  {
    id: "update-3",
    date: "2026-02-01",
    title: "Alpha Build 0.3 - Vande Bharat Express",
    summary:
      "Major update introducing the Vande Bharat Express with improved physics and new route segments.",
    status: "Alpha",
    content: `
**New Features:**
- Vande Bharat Express now available with full interior and exterior modeling
- Enhanced train physics system for more realistic acceleration and braking
- Added 50km of new track between Delhi and Agra
- Improved signaling system with automatic train protection (ATP)

**Improvements:**
- Better performance optimization for lower-end devices
- Enhanced weather effects and lighting
- Improved UI/UX for train controls
- Fixed multiple collision detection issues

**Bug Fixes:**
- Resolved camera clipping issues in cab view
- Fixed signal timing inconsistencies
- Corrected speed limit displays on certain track sections
    `,
  },
  {
    id: "update-2",
    date: "2026-01-15",
    title: "Pre-Alpha Build 0.2 - Route Expansion",
    summary:
      "Expanded route network with Chennai-Bangalore corridor and passenger train improvements.",
    status: "Pre-Alpha",
    content: `
**New Content:**
- Chennai to Bangalore route now available (362 km)
- Passenger train model with improved detail
- 15 new stations with accurate platform layouts
- Dynamic passenger boarding/alighting system

**Technical Updates:**
- Optimized track rendering for better performance
- Improved AI traffic system
- Enhanced sound effects for trains and stations
- Better multiplayer synchronization

**Known Issues:**
- Some texture pop-in on distant objects
- Occasional desync in multiplayer mode
- Weather transitions need smoothing
    `,
  },
  {
    id: "update-1",
    date: "2025-12-20",
    title: "Pre-Alpha Build 0.1 - Initial Release",
    summary:
      "First public pre-alpha release featuring Delhi-Mumbai route and basic train operations.",
    status: "Pre-Alpha",
    content: `
**Initial Features:**
- Delhi to Mumbai Central route (1,384 km)
- Express locomotive with basic controls
- 25 major stations with platform infrastructure
- Day/night cycle and basic weather system
- Single-player career mode (beta)

**What's Working:**
- Basic train driving mechanics
- Signal system (simplified)
- Station stops and departure procedures
- Speed restrictions and track limits

**Known Limitations:**
- Limited train variety
- Simplified physics model
- No multiplayer support yet
- Basic graphics and effects
- Limited customization options

Thank you to all our early testers for your valuable feedback!
    `,
  },
];
