---
name: "YMTA Dental Clinic"
description: "Premium, calm, clinically trustworthy dental care in Coimbatore."
colors:
  deep-forest: "#0E1815"
  dark-teal: "#274242"
  muted-mint: "#9DC2B8"
  soft-green: "#6AA468"
  soft-green-hover: "#5B8F5A"
  action-green: "#356B43"
  action-green-hover: "#295735"
  action-border: "#94BC97"
  review-gold: "#D4A853"
  pale-bg: "#EBEFEC"
  warm-white: "#F8FAF7"
  white: "#FFFFFF"
  text-primary: "#1A2825"
  text-secondary: "#4A5F5A"
  hero-overlay: "rgba(7, 15, 13, 0.58)"
  hero-text-shadow: "rgba(7, 15, 13, 0.32)"
  error-focus: "rgba(196, 75, 75, 0.1)"
  error-border-soft: "rgba(196, 75, 75, 0.2)"
  warning-bg: "#FFF8E7"
  warning-border: "#E8D5A0"
  warning-text: "#8B6B14"
typography:
  display:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(3rem, 2rem + 2.5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.08
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(0.9rem, 0.85rem + 0.2vw, 1rem)"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.action-green}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: YMTA Dental Clinic

## Overview

**Creative North Star: “Clinical Calm”**

YMTA pairs a warm, low-saturation green palette with generous spacing and editorial serif
headings. The experience should feel current and premium without looking like a luxury
concept detached from ordinary patients. Photography and motion create atmosphere; clear
language and strong contrast establish trust.

Key characteristics:

- Calm, patient-first presentation with a low text burden.
- DM Serif Display for warmth and distinction; DM Sans for clarity.
- One cinematic hero moment, followed by restrained functional motion.
- Rounded controls and soft surfaces that remain clinically precise.

## Colors

Deep forest and dark teal carry authority. Mint and soft green are supporting accents, used
sparingly for action and wayfinding. Warm white and pale green-gray maintain a consistent
neutral temperature.

## Typography

**Display Font:** DM Serif Display with Georgia fallback  
**Body Font:** DM Sans with system sans-serif fallback

Headings use compact line-height and balanced wrapping. Body copy stays near 65 characters
per line. Small labels may use modest positive tracking; medical and conversion copy stays
plain, direct, and reassuring.

## Layout

The site uses a fluid 1280px maximum container, responsive side padding, and an 8px-derived
spacing rhythm. Sections gain breathing room at tablet and desktop widths. Mobile fixed
actions respect safe-area insets and important content remains visible.

## Elevation & Depth

Depth is ambient rather than glossy: tinted forest shadows, tonal surface changes, and
photographic overlays. Cards remain mostly flat until interaction. Hero overlays always
protect text contrast.

## Shapes

Cards use 16–24px radii. Form controls use 10px radii. Pills are reserved for buttons, small
labels, and filters. Borders are light and secondary to tonal separation.

## Components

- **Buttons:** action green (#356B43), bold white labels, a mint border (#94BC97),
  and a darker hover fill (#295735). White-on-fill contrast is 6.3:1 (8.37:1 on hover).
  Decorative soft green stays unchanged. Secondary buttons retain outlined styling.
- **Cards:** warm-white or white surfaces with light borders and a restrained hover lift.
- **Inputs:** white fields, 1.5px borders, dark-teal focus treatment, inline error feedback.
- **Navigation:** centered warm-white capsule, 720px resting width and up to 1040px after
  scrolling. Header actions reveal beyond 24px and hide near the top (8px hysteresis).
  Below 1024px, a 560px-max capsule uses a menu; the Call/Book Visit bottom bar follows
  the same scroll state. Links, calls, and booking retain their existing destinations.
- **WhatsApp:** a visible 56px action, a one-time dismissible invitation after 1.6 seconds,
  and intermittent icon/ring cues. Ambient motion pauses when the document is hidden.
- **FAQ:** single-open accordion with intrinsic grid expansion; heading and opened answers
  use a bounded blur-to-sharp word reveal. Reduced motion keeps text immediately readable.
- **Media comparisons:** native range controls provide pointer, touch, and keyboard access.

## Do's and Don'ts

### Do:

- Do preserve the approved forest, teal, mint, and warm-white palette.
- Do use verified clinic facts, patient-consented media, and cautious clinical wording.
- Do stop ambient motion for reduced-motion users and hidden browser tabs.

### Don't:

- Don't introduce new fonts, fabricated outcomes, or unsupported clinical claims.
- Keep the requested contact cue small and intermittent; avoid aggressive motion or neon glow.
- Don't publish WhatsApp or before-and-after content until its configuration is confirmed.
