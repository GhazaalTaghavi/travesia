# TRAVESIA

**An AI-powered travel companion prototype for planning memorable city trips.**

TRAVESIA brings the essential stages of trip planning into one guided experience: choose a destination, organize travel and accommodation, discover places to visit and eat, prepare for the weather, find local events, and shape a day-by-day itinerary with AI-inspired assistance.

## Overview

TRAVESIA is a responsive product prototype designed around the needs of travelers exploring a city for a few days. Instead of switching between separate planning tools, users can keep trip details, discoveries, reservations, and daily plans in one place.

The application demonstrates a personalized travel workflow across supported city experiences, with shared trip settings and selections carried through its feature areas. It is built to explore how an intelligent companion could help users move from inspiration to an organized itinerary.

## Key Features

- **Destination and trip setup**: Select a city and set travel dates and the number of travelers.
- **Travel and stay planning**: Browse transport and accommodation options and add selections to the trip.
- **Attractions discovery**: Explore landmark recommendations, save favorites, and add sights to the plan.
- **Landmark identifier**: Simulate recognizing an iconic place from a photo and view contextual travel information.
- **Food and restaurant tools**: Discover places to eat and add dining ideas to the itinerary.
- **Menu scanner and restaurant identifier**: Explore food-focused scan experiences intended to help travelers understand local dining options.
- **Weather and packing assistant**: Review destination weather guidance and packing recommendations.
- **Local events and reservations**: Find events, save activities, and walk through a reservation flow.
- **Day planner**: Review and edit a daily itinerary, rearrange or remove activities, and bring selected attractions, restaurants, and events into the plan.
- **Map view and AI chat**: Visualize activity locations and interact with simulated AI assistance for planning suggestions.

## Demo Flow

1. Start on the home screen and select a destination city.
2. Open trip settings to adjust dates and the number of travelers.
3. Visit **Travel & Stay** to select transport and accommodation options.
4. Explore **Attractions**, **Landmark Identifier**, and **Food & Drinks** to discover ideas and add them to the trip.
5. Check **Weather** for packing guidance and browse **Local Events** for activities and reservation options.
6. Open the **Day Planner** to review the generated itinerary, add selected experiences, edit the schedule, view the map, and use the AI-style chat tools to refine the day.

## Tech Stack

- [React](https://react.dev/) with TypeScript
- [Vite](https://vite.dev/) for development and production builds
- [React Router](https://reactrouter.com/) for client-side navigation
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons
- React Context for shared trip state across the prototype

## Project Structure

```text
src/
|-- components/       Shared navigation, layout, map, and modal components
|-- context/          Shared trip settings and selected-plan state
|-- data/             Mock city, travel, dining, weather, event, and planner data
|-- pages/            Feature screens for each stage of the trip experience
|-- types/            Shared TypeScript domain types
|-- App.tsx           Application routes and top-level provider setup
|-- index.css         Global styles and Tailwind CSS entry point
`-- main.tsx          React application entry point
public/               Static assets
```

## Run Locally

### Prerequisites

- Node.js and npm installed

### Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project for production:

```bash
npm run build
```

## Prototype Notes

TRAVESIA is a front-end product prototype. Destination content, transport and stay options, attractions, restaurants, weather information, events, reservation outcomes, maps, and itinerary recommendations are represented with mocked data for demonstration purposes.

Features described as AI-powered, including landmark recognition, scanning experiences, chat responses, packing guidance, and itinerary suggestions, are simulated interactions. The prototype does not connect to live booking providers, live location services, real-time weather or event feeds, image-recognition models, or a generative AI service.

## Future Improvements

- Connect live APIs for transportation, accommodation, weather, local events, maps, and restaurant availability.
- Add real AI-backed itinerary generation, travel chat, landmark recognition, and menu translation.
- Support authenticated user accounts, saved trips, sharing, and cross-device persistence.
- Enable real reservations and booking management with pricing and availability updates.
- Expand destination coverage, accessibility preferences, budget controls, and personalized recommendations.
- Add offline access, notifications, and richer route optimization for travelers on the go.
