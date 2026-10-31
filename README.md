# Uğur Can Çeribaşı — portfolio

A bilingual creative frontend portfolio, project explorer and printable CV.
Live temporary address: http://ugurcan.77.92.144.145.sslip.io/

## Update and build

- Structured professional content: `website/content.json`.
- Turkish/English copy and CV generation: `website/build.py`.
- Portfolio structure: `website/template.html`.
- Layout and locally hosted typography: `website/styles.css`.
- Keyboard-accessible project tabs and navigation: `website/script.js`.
- Interactive interface, logic and system layers: `website/scene.js`.

Run `npm ci` and `npm run build`. Generated HTML and the local Three.js bundle are
checked in. Preview with `npm run preview` on port 4175.

Coolify uses the Static build pack and `/website` as its base directory, internal
port 80. No runtime npm install or server build is required. Publish an update by
pushing the built files to main and redeploying the application in Coolify.

Turkish pages are `index.html` and `cv.html`; English pages are `en/index.html` and
`en/cv.html`. The CV pages have an isolated print layout and a browser print/PDF
button and do not load Three.js.

## Interaction and accessibility

The original 3D interface illustration splits into three layers. Visitors can
pause motion. Rendering pauses off-screen and in background tabs, caps device
pixel ratio, honors reduced-motion preferences and has a static CSS fallback.
Project tabs support left/right arrows, Home and End with visible focus. Content
is visible without scroll-reveal JavaScript. The CV remains separately readable.

Three.js 0.187.0 is pinned and bundled locally. Its MIT license is included in
`website/vendor/three/LICENSE`. Space Grotesk and Instrument Serif are hosted
locally with their OFL licenses in `website/assets/fonts/`. Runtime assets do not
require third-party CDNs.

## Content sources

Career, education and certifications were read from the user-provided LinkedIn
profile on 2026-10-31. Job dates are preserved, including overlapping GittiGidiyor
and Finartz entries. Employer achievements and per-role technology stacks are
not inferred. Project details come from the user's repositories; project images
are actual app or product site captures. The hero's 3D interface is an original
illustration, not a screenshot of a shipped product. Portrait: public GitHub avatar.
Contact links use public GitHub and LinkedIn profiles.
