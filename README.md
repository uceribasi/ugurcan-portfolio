# Uğur Can Çeribaşı — portfolio

Static bilingual portfolio with a Three.js sculpture and compact CV. Turkish: `website/index.html` and
`website/cv.html`. English: `website/en/index.html` and `website/en/cv.html`.

Update `website/content.json` and the copy in `website/build.py`, then run:

`npm ci` followed by `npm run build`.

The checked-in browser bundle is generated from `website/scene.js` with esbuild.
Three.js 0.187.0 is pinned in the lockfile, bundled locally and carries its MIT
license in `website/vendor/three/LICENSE`. There are no third-party runtime CDN
requests. The scene pauses off-screen and in background tabs, caps pixel density,
respects reduced-motion preferences, and includes pause and shape controls. A CSS
sculpture is retained if WebGL is unavailable. The CV pages do not load Three.js.

Preview:

`python3 -m http.server 4175 --directory website`

Coolify: Public Git Repository, Static build pack, base directory `/website`,
internal port 80. Generated HTML is checked in; no npm installation or server-side
build is needed. CV pages have a print stylesheet and a browser print/PDF button.

Live temporary address: http://ugurcan.77.92.144.145.sslip.io/

Career, education and certifications were read from the user-provided LinkedIn
profile on 2026-10-31. Job dates are preserved, including overlapping GittiGidiyor
and Finartz entries. No per-employer achievements or technology stacks are inferred.
Project details come from the user's repositories. Portrait: public GitHub avatar.
Public contact links are GitHub and LinkedIn; no personal email, phone, grades,
private analytics or unrelated profile content is published.
