# Uğur Can Çeribaşı — portfolio

Static bilingual portfolio and compact CV. Turkish: `website/index.html` and
`website/cv.html`. English: `website/en/index.html` and `website/en/cv.html`.

Update `website/content.json` and the copy in `website/build.py`, then run:

`python3 website/build.py`

Preview:

`python3 -m http.server 4175 --directory website`

Coolify: Public Git Repository, Static build pack, base directory `/website`,
internal port 80. Generated HTML is checked in; no npm installation or server-side
build is needed. CV pages have a print stylesheet and a browser print/PDF button.

Career, education and certifications were read from the user-provided LinkedIn
profile on 2026-10-31. Job dates are preserved, including overlapping GittiGidiyor
and Finartz entries. No per-employer achievements or technology stacks are inferred.
Project details come from the user's repositories. Portrait: public GitHub avatar.
Public contact links are GitHub and LinkedIn; no personal email, phone, grades,
private analytics or unrelated profile content is published.
