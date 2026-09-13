# MUN Creations — System Architecture & Technical Documentation

This document outlines the full-stack architecture, frontend design tokens, backend server engine, and project structure for **MUN Creations — Mun Saree Elegance**.

---

## 1. High-Level Architecture Overview

This project is built as a **Full-Stack Server-Side Rendered (SSR) Web Application** using **TanStack Start**, **TanStack Router**, **React 19**, and **Vite** powered by the **Nitro** server engine.

```
                  ┌──────────────────────────────────────────────┐
                  │                 USER BROWSER                 │
                  └──────────────────────┬───────────────────────┘
                                         │
                   HTTP Requests (SSR)   │  Client Hydration / State
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │                BACKEND ENGINE                │
                  │             UnJS Nitro Runtime               │
                  │ (.output/server & SSR Middleware Hydration)  │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │                FRONTEND LAYER                │
                  │   TanStack Router + React 19 + Tailwind v4   │
                  └──────────────────────────────────────────────┘
```

---

## 2. Frontend Layer (UI & Client Logic)

### 🎨 Design & Styling Tokens ([styles.css](file:///c:/Users/Paul%20Adams/Documents/Anirban%202/project2/mun-saree-elegance/src/styles.css))

- **TailwindCSS v4**: Uses modern CSS variables for theme palette tokenization:
  - `--wine-deep` (`oklch(0.26 0.11 22)`): Royal Indian wine/maroon background.
  - `--gold` (`oklch(0.76 0.14 82)`): Antique gold accent.
  - `--ivory` (`oklch(0.975 0.012 82)`): Warm silk cream backdrop.
- **Metanoia Font System**: High-fashion editorial display typography configured via `@theme inline` with luxury fallbacks (`Cinzel`, `Marcellus`, `Cormorant Garamond`, `Montserrat`).
- **Wavy Reveal Animations** (`@keyframes wavy-flow-in`): Custom fluid section entrance keyframes using skewing, scale morphing, and cubic-bezier easing (`cubic-bezier(0.16, 1, 0.3, 1)`).

### 📱 Key UI Components (`src/components/site/`)

1. **Header & Announcement Bar** ([header.tsx](file:///c:/Users/Paul%20Adams/Documents/Anirban%202/project2/mun-saree-elegance/src/components/site/header.tsx)):
   - **Auto-Hiding Scroll Logic**: Listens to scroll direction (`lastScrollY` vs `currentScrollY`). Automatically slides off-screen when scrolling down to give full visibility to content, and reappears when scrolling back up or at the top.
   - **Transparent Overlay**: Remains 100% transparent at the top hero section to display the video.
   - **Language & Currency Switcher**: Live dropdown supporting `INR`, `USD`, `EUR`, `GBP`, `AUD`, `CAD`, and native language strings.
2. **Hero Section** ([hero.tsx](file:///c:/Users/Paul%20Adams/Documents/Anirban%202/project2/mun-saree-elegance/src/components/site/hero.tsx)):
   - Single edge-to-edge full-bleed background video (`/hero-video.mp4`).
   - Right-aligned typography and call-to-action buttons.
3. **Categories Section** ([sections.tsx](file:///c:/Users/Paul%20Adams/Documents/Anirban%202/project2/mun-saree-elegance/src/components/site/sections.tsx#L37)):
   - AI-generated high-res photography cards for **Silk Sarees**, **Pre-Draped**, **Bridal**, and **Cotton Handloom**.
4. **Story Banner** ([sections.tsx](file:///c:/Users/Paul%20Adams/Documents/Anirban%202/project2/mun-saree-elegance/src/components/site/sections.tsx#L101)):
   - "Six yards. Six generations of craft" feature section with an embedded looping artisan weaving video (`/story-video.mp4`).
5. **Accessories Teaser** ([index.tsx](file:///c:/Users/Paul%20Adams/Documents/Anirban%202/project2/mun-saree-elegance/src/routes/index.tsx#L102)):
   - Dedicated photography matching product titles: _Rose Gold Embroidered Blouse_, _Ivory Zari Dupatta_, _Kundan & Pearl Choker_, and _Handcrafted Potli Bag_.
6. **Wavy Scroll Animations** ([reveal.tsx](file:///c:/Users/Paul%20Adams/Documents/Anirban%202/project2/mun-saree-elegance/src/components/site/reveal.tsx)):
   - `<WavySection>` wrapper powered by `IntersectionObserver` to trigger section transitions one by one as the user scrolls.

---

## 3. Backend Layer (Server & Routing Engine)

### 🚀 Server Runtime — Nitro Engine

- **Nitro Runtime** (`nitro: 3.0.260603-beta`): Compiles SSR code and static assets into `.output/server` and `.output/public`.
- **Prebuilt Deployment Target**: Configured via [netlify.toml](file:///c:/Users/Paul%20Adams/Documents/Anirban%202/project2/mun-saree-elegance/netlify.toml) and Cloudflare module targets for zero-cold-start hosting.

### 🔀 File-Based Routing (`src/routes/`)

- **[__root.tsx](file:///c:/Users/Paul%20Adams/Documents/Anirban%202/project2/mun-saree-elegance/src/routes/__root.tsx)**:
  - Defines the global html document shell (`<html>`, `<head>`, `<body>`).
  - Injects global metadata, Google Fonts, brand favicon links (`/favicon.png`), and root error boundaries (`NotFoundComponent`, `ErrorComponent`).
- **[index.tsx](file:///c:/Users/Paul%20Adams/Documents/Anirban%202/project2/mun-saree-elegance/src/routes/index.tsx)**:
  - Defines the main homepage route (`/`), wrapping providers (`I18nProvider`, `CartProvider`) and section layouts.

---

## 4. Project File Map

```
mun-saree-elegance/
├── .nvmrc                   <-- Forces Node 20 LTS environment
├── netlify.toml             <-- Netlify deployment configuration
├── package.json             <-- Engine specs (^20.0.0 || ^22.0.0) & dependencies
├── public/                  <-- High-res media assets & favicons
│   ├── hero-video.mp4       <-- Widescreen hero background video
│   ├── story-video.mp4      <-- Artisan weaving section video
│   ├── logo-light.png       <-- Brand logo
│   └── favicon.png          <-- Brand favicon
└── src/
    ├── components/site/
    │   ├── header.tsx       <-- Auto-hiding transparent header
    │   ├── hero.tsx         <-- Single full-bleed hero video section
    │   ├── sections.tsx     <-- Category grid & StoryBanner video
    │   ├── product.tsx      <-- Product card & carousel components
    │   ├── reveal.tsx       <-- Wavy scroll reveal observer hook
    │   └── cart-drawer.tsx  <-- Interactive cart slide-out drawer
    ├── lib/
    │   ├── i18n.tsx         <-- Multi-currency & language state manager
    │   ├── cart.tsx         <-- Shopping cart state manager
    │   └── products.ts      <-- Product catalog data & image exports
    ├── routes/
    │   ├── __root.tsx       <-- Root HTML shell & head meta configuration
    │   └── index.tsx        <-- Homepage route & section assembly
    └── styles.css           <-- Tailwind v4 theme tokens & keyframes
```
