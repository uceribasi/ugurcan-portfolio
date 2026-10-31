# Uğur Can Çeribaşı — portfolio

A bilingual creative frontend portfolio, project explorer and printable CV.
Live temporary address: http://ugurcan.77.92.144.145.sslip.io/

## Update and build

- Structured professional content: `website/content.json`.
- Turkish/English copy and CV generation: `website/build.py`.
- Portfolio structure: `website/template.html`.
- Layout and locally hosted typography: `website/styles.css`.
- Keyboard-accessible project tabs and navigation: `website/script.js`.
- GPU particle morphing, pointer force fields and native modal: `website/scene.js`.
- 3D product screen carousel, raycast selection and swipe controls: `website/project-scene.js`.

Run `npm ci` and `npm run build`. Generated HTML and the local Three.js bundle are
checked in. Preview with `npm run preview` on port 4175.

Coolify uses the Static build pack and `/website` as its base directory, internal
port 80. No runtime npm install or server build is required. Publish an update by
pushing the built files to main and redeploying the application in Coolify.

Turkish pages are `index.html` and `cv.html`; English pages are `en/index.html` and
`en/cv.html`. The CV pages have an isolated print layout and a browser print/PDF
button and do not load Three.js.

## Interaction and accessibility

The hero is a custom GLSL particle field that assembles a pixel signature, code
brackets, a breathing sphere or actual project images. Visitors can scatter and
rebuild it, push particles with a pointer and trigger shockwaves. A native modal
expands the same canvas, supports Escape and restores focus. Project tabs update
the particle source; each project's Explore in 3D control opens its sampled image.

The work section uses one shared Three.js renderer with textured 3D application
screens. Tab selection moves the selected screen forward; arrows, horizontal
swipes and raycast clicks on neighboring screens choose projects. Original images
remain as a fallback. Renderers pause off-screen/in background tabs and cap pixel
density. Reduced-motion preferences disable automatic animation and make manual
transitions immediate. Project tabs support arrow keys, Home and End; all career
content is available without scroll animations. The CV uses a separate layout.

Three.js 0.187.0 is pinned and bundled locally. Its MIT license is included in
`website/vendor/three/LICENSE`. Space Grotesk and Instrument Serif are hosted
locally with their OFL licenses in `website/assets/fonts/`. Runtime assets do not
require third-party CDNs.

## Content sources

Career, education and certifications were read from the user-provided LinkedIn
profile on 2026-10-31. Job dates are preserved, including overlapping GittiGidiyor
and Finartz entries. Employer achievements and per-role technology stacks are
not inferred. Project details come from the user's repositories; project images
are actual app or product site captures. The initial particle signature is original artwork. Project-mode particles and
3D screens use the actual app/product captures. Portrait: public GitHub avatar.
Contact links use public GitHub and LinkedIn profiles.
