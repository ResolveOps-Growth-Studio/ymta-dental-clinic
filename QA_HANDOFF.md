# October 21 services update

- Interactive fan of six treatment cards; dental implants are first and centered initially.
- Hover/focus brings cards forward. Previous/next and treatment buttons select each service.
- On mobile, one readable card is shown with swipe and button controls.
- Connect and Plan your visit open /appointment with the matching service preselected.
- WhatsApp and Instagram dock appears on both routes; reduced-motion preferences disable animation.
- Existing Instagram profile and existing site fonts, palette, imagery, and earlier edits preserved.
- Added Vercel SPA rewrites for appointment direct links.

Validation: npm ci and npm run build passed. Independent source review found no material functional defects in scoped changes. Browser visual QA could not be completed: managed preview rejected its terminal.local host. Desktop/mobile appearance and live interaction should be checked locally before deployment. No Git push or deployment performed.

Run locally: npm ci, then npm run dev. Production build: npm run build.
Booking still uses the existing preview form: no appointment request is transmitted. WhatsApp opens a draft for the visitor to send.

---

# YMTA Dental Clinic QA Handoff

## What changed

- Replaced the floating hero thumbnails with a full-bleed, three-scene GSAP background sequence.
- Added a focused dental implant section and six-step illustrative treatment journey.
- Added a reusable, accessible before-and-after comparison component and consent-safe empty state.
- Refined service emphasis, review transitions, contrast tokens, focus behavior, touch targets, and image sizing.
- Added centralized, confirmation-gated WhatsApp URLs and the verified Instagram contact action.
- Added a skip link and corrected homepage/appointment landmarks.
- Documented the incumbent visual system in DESIGN.md.

## Relevant files

- src/components/Hero.jsx and Hero.css
- src/components/ImplantSpotlight.jsx and ImplantSpotlight.css
- src/components/Gallery.jsx and Gallery.css
- src/components/FloatingContact.jsx and FloatingContact.css
- src/components/Services.jsx and Services.css
- src/components/Footer.jsx and Footer.css
- src/config/clinic.js
- src/index.css, src/App.jsx, and src/pages/Home.jsx
- DESIGN.md and .impeccable/design.json

## Routes to verify

- / — complete homepage and all in-page anchors.
- /appointment — appointment form.
- /appointment?service=dental-implants — implant service should be preselected.

## Browser verification checklist

1. Hero fills the first viewport with no flash or content shift.
2. Hero scenes crossfade roughly every 6 seconds with gentle pan and zoom.
3. Switching browser tabs pauses the hero timeline; returning resumes it.
4. Reduced-motion mode shows a static first hero frame and readable content.
5. Implant journey is readable at 360px, 390px, tablet, and desktop widths.
6. No horizontal overflow; the mobile action bar and future WhatsApp button do not overlap.
7. Keyboard focus reaches the skip link, navigation, CTAs, FAQ controls, and appointment form.
8. Appointment navigation, query preselection, validation, and success/error states still work.
9. Instagram opens the configured clinic profile in a new tab.
10. With a temporary approved case, the comparison range works with pointer, touch, arrow keys,
    and visible keyboard focus.

## Expected animation behavior

- The hero is the primary authored motion moment.
- Section entrances run once as content enters view.
- Implant steps use a short bounded stagger.
- Hover and focus transitions are brief; there is no bouncing or aggressive pulsing.
- Ambient motion stops or becomes static for reduced-motion users.

## Configuration status

- Instagram: configured as https://www.instagram.com/ymta_dental_clinic/.
- WhatsApp: enabled with user-confirmed number +91 9482872744.
- Reviews: existing supplied testimonials are preserved. The rating summary remains gated by
  verifiedForLaunch.

## Missing clinic-owned assets

- Authentic, consented before-and-after patient photographs.
- Approved treatment descriptions, alt text, and optional clinical context for each case.
- Booking backend remains unconnected; the appointment form is preview-only.
- Confirmation that current illustrative media may be represented as clinic-owned photography.

## Adding an approved result case

Add an object to BEFORE_AFTER_CASES in src/config/clinic.js:

~~~js
{
  id: 'unique-case-id',
  treatmentType: 'Dental Implants',
  beforeImageUrl: '/images/gallery/approved-before.jpg',
  afterImageUrl: '/images/gallery/approved-after.jpg',
  approvedDescription: 'Clinic-approved description.',
  beforeAlt: 'Approved before-treatment description.',
  afterAlt: 'Approved after-treatment description.',
  clinicalContext: 'Optional clinician-approved context.',
  approved: true,
}
~~~

## Validation results

- npm run build — passed with Vite 7.3.6.
- Impeccable detector — one unused bounce-easing token found and removed.
- No lint or test script is defined in package.json.
- Playwright MCP was not used, per the implementation brief.

## Known limitations and regression risks

- Visual and interaction QA still requires a real browser; Codex had no Playwright MCP access.
- The comparison slider is implemented but has no public case data until approved assets arrive.
- Hero cropping should be checked on very tall mobile devices against the actual approved media.
- Google Maps iframe rendering depends on Google availability and third-party policy.
- The appointment form remains a request UI until backendConnected is enabled.
