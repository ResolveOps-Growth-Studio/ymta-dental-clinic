# YMTA header, contact and FAQ update — 21 October 2026

## Delivered behavior

- Warm-white capsule navbar with balanced logo/link spacing and 44px controls.
- At the top: navbar actions are hidden and inert. Beyond 24px of scroll: Call Now and Book Appointment reveal as the capsule expands. They hide again near the top (8px threshold to avoid flicker).
- Mobile/tablet below 1024px: menu navigation and a Call/Book Visit bottom bar that follows the same scroll state. Drawer has a close button, Escape support and a keyboard focus loop.
- WhatsApp to +91 9482872744: visible action, invitation after 1.6 seconds (dismissible; auto-hides at 10 seconds), periodic icon nudge and ring. Instagram remains available.
- Green primary/accent buttons: bold white text, darker green fill, highlighted mint border. Contrast improves from 2.95:1 to 6.3:1 (8.37:1 hover).
- FAQ retains the supplied clinic questions and answers. Added intrinsic expand/collapse, plus-to-close indicator and short word-by-word blur reveal. No unavailable UI import or new dependency.
- Reduced-motion alternatives provided; navbar/contact loops pause when the document is hidden.

## Validation completed

- npm ci and production build passed.
- Actual browser viewport 1363px: compact/expanded states, FAQ navigation and switching, Book Appointment route.
- Browser iframe CSS viewports 390px and 820px: visual layout, WhatsApp invitation, mobile menu, FAQ and bottom controls.
- Browser iframe CSS viewport 1024px: expanded navbar fits; its action controls stay inside the capsule.
- No page horizontal overflow observed at 390px or 1024px.
- Returning to the top hides both desktop and mobile action controls (aria-hidden=true at scrollY=0).
- Independent source/screenshot review passed the scoped changes; documentation synchronized afterwards.
- These checks cover browser layout, not physical-device touch/OS behavior. Reduced-motion rules reviewed in source.

## Existing integration limitation

Appointment form remains preview-only because no booking backend is connected. WhatsApp opens a draft for the visitor to send. No Git push or deployment was performed.

## Run

npm ci
npm run dev

Build: npm run build

Changed source: Header, FloatingContact, FAQ, TextReveal (new), shared action button styles, and Vite's explicit terminal.local preview host allowance. Existing media, services fan and the rest of the site remain in the supplied project.
