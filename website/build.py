#!/usr/bin/env python3
"""Build the bilingual portfolio and compact CV from verified content.json."""
from pathlib import Path
from string import Template
from html import escape
import json

ROOT=Path(__file__).resolve().parent
DATA=json.loads((ROOT/'content.json').read_text())
COPY={
 'tr':{
  'title':'Uğur Can Çeribaşı — Yazılım Geliştirici & Ürün Üreticisi',
  'description':'Senior Software Developer. Frontend mimarisi, ekip liderliği ve AI ürünleri. Deneyim, açık kaynak projeler ve eğitim geçmişi.',
  'nav':['Hakkımda','Deneyim','Projeler','Teknolojiler','Eğitim','İletişim'],
  'skip':'İçeriğe geç','menu':'Menüyü aç','cv':'CV görünümü','back':'Portfolyoya dön','print':'Yazdır / PDF olarak kaydet',
  'hello':'MERHABA, BEN UĞUR CAN',
  'hero':'Yazılım geliştiriyorum.<br><span>Fikirleri ürüne<br>dönüştürüyorum.</span>',
  'intro':'Frontend mimarisi, ekip liderliği ve uçtan uca ürün geliştirme. Bugün Trendyol’da Senior Software Developer olarak çalışıyor, kendi açık kaynak ürünlerimi geliştiriyorum.',
  'projects_cta':'Projelerimi keşfet','contact_cta':'LinkedIn’de buluşalım','current':'ŞU ANDA','since':'2014’TEN BU YANA','since_text':'Yazılım, mimari ve sürekli öğrenme.',
  'photo_alt':'Uğur Can Çeribaşı’nın GitHub profil fotoğrafı',
  'scene_label':'FİKİR → SİSTEM → ÜRÜN','scene_hint':'Fareyle keşfet','scene_toggle':'Hareketi durdur','scene_resume':'Hareketi başlat','scene_shape':'Formu değiştir',
  'about_label':'01 / HAKKIMDA','about_title':'Arayüzden mimariye.<br>Meraktan üretime.',
  'about_p1':'2014’ten bu yana yazılım geliştiriyorum. Frontend ve Backend-for-Frontend katmanlarında React, Next.js, TypeScript ve NestJS ile çalışıyor; mikro frontend mimarisi, GraphQL ve modüler sistem tasarımına odaklanıyorum.',
  'about_p2':'Takım liderliği deneyimimde teknik yönetişim, mimari kararlar ve ekip gelişimi önemli bir yer tuttu. Bugün bu birikimi, LLM tabanlı uygulamalar ve veri odaklı kişisel projelerle birleştiriyorum.',
  'about_p3':'Üretmeyi öğrenmenin bir parçası olarak görüyorum. Readling, NU AI Video Editor ve PasteCompiler; dil öğrenme, video düzenleme ve veri dönüştürme alanlarında geliştirdiğim açık kaynak ürünler.',
  'focus':['Frontend & BFF','Mimari & ekip gelişimi','AI & veri'],
  'experience_label':'02 / DENEYİM','experience_title':'Çalıştığım yerler.<br>Üstlendiğim roller.',
  'experience_intro':'E-ticaret, finans teknolojileri, dijital yayıncılık ve eğitim alanlarında yazılım geliştirme geçmişim.',
  'earlier':'Önceki deneyimler · 2014–2020','present':'Devam ediyor','experience_all':'Kariyer geçmişi',
  'projects_label':'03 / SEÇİLİ PROJELER','projects_title':'Kendi sorularımdan<br>doğan ürünler.',
  'projects_intro':'Fikirden çalışan ürüne taşıdığım, kaynak kodunu paylaştığım üç proje.',
  'visit':'Siteyi ziyaret et','source':'Kaynak kodu','technical':'Teknik notlar','project_note':'Proje görselleri uygulamalardan ve kendi tanıtım sayfalarından alınmıştır.',
  'skills_label':'04 / ARAÇLAR & UZMANLIK','skills_title':'Çalıştığım alanlar.<br>Kullandığım araçlar.',
  'skills_intro':'Profesyonel deneyimim ve kişisel projelerimde kullandığım teknolojiler.',
  'education_label':'05 / EĞİTİM & ÖĞRENME','education_title':'Öğrenmeye<br>devam ediyorum.','education':'Eğitim','certificates':'Sertifikalar','cert_link':'LinkedIn’de sertifikalar',
  'contact_label':'06 / İLETİŞİM','contact_title':'Bir fikir üzerine<br><span>konuşalım.</span>',
  'contact_body':'Yazılım, ürün geliştirme, açık kaynak veya ortak bir merak. Bana LinkedIn üzerinden ulaşabilir, çalışmalarımı GitHub’da inceleyebilirsin.',
  'footer':'Uğur Can Çeribaşı · Kişisel portfolyo','updated':'Son güncelleme · Ekim 2026',
  'cv_summary':'Frontend ve BFF geliştirme, mikro frontend mimarisi, GraphQL, teknik yönetişim ve ekip liderliği deneyimine sahip yazılım geliştirici. LLM uygulamaları, RAG ve veri odaklı projeler geliştiriyor. 2014’ten bu yana profesyonel yazılım geliştirme geçmişi.',
  'cv_projects':'Açık kaynak projeler','cv_tech':'Teknolojiler & odak alanları','cv_name':'Kısa özgeçmiş','cv_location':'İstanbul, Türkiye',
 },
 'en':{
  'title':'Uğur Can Çeribaşı — Software Developer & Product Builder',
  'description':'Senior Software Developer. Frontend architecture, team leadership and AI products. Experience, open-source projects and education.',
  'nav':['About','Experience','Projects','Technologies','Education','Contact'],
  'skip':'Skip to content','menu':'Open menu','cv':'CV view','back':'Back to portfolio','print':'Print / Save as PDF',
  'hello':'HELLO, I’M UĞUR CAN',
  'hero':'I develop software.<br><span>I turn ideas<br>into products.</span>',
  'intro':'Frontend architecture, team leadership and end-to-end product development. Currently a Senior Software Developer at Trendyol, while building my own open-source products.',
  'projects_cta':'Explore my projects','contact_cta':'Connect on LinkedIn','current':'CURRENTLY','since':'BUILDING SINCE 2014','since_text':'Software, architecture and continuous learning.',
  'photo_alt':'Uğur Can Çeribaşı’s GitHub profile photo',
  'scene_label':'IDEA → SYSTEM → PRODUCT','scene_hint':'Move to explore','scene_toggle':'Pause motion','scene_resume':'Resume motion','scene_shape':'Change shape',
  'about_label':'01 / ABOUT','about_title':'From interfaces to architecture.<br>From curiosity to building.',
  'about_p1':'I have been developing software since 2014. I work across frontend and Backend-for-Frontend layers with React, Next.js, TypeScript and NestJS, with a focus on micro frontends, GraphQL and modular system design.',
  'about_p2':'Technical governance, architectural decisions and team development were an important part of my experience as a team lead. Today I combine that background with LLM applications and data-focused personal projects.',
  'about_p3':'I see building as a way of learning. Readling, NU AI Video Editor and PasteCompiler are my open-source products for language learning, video editing and data conversion.',
  'focus':['Frontend & BFF','Architecture & team development','AI & data'],
  'experience_label':'02 / EXPERIENCE','experience_title':'Where I’ve worked.<br>The roles I’ve taken.',
  'experience_intro':'A software development background across e-commerce, financial technology, digital streaming and education.',
  'earlier':'Earlier experience · 2014–2020','present':'Present','experience_all':'Professional experience',
  'projects_label':'03 / SELECTED PROJECTS','projects_title':'Products that started<br>with my own questions.',
  'projects_intro':'Three projects I took from an idea to a working product, with their source code shared openly.',
  'visit':'Visit website','source':'Source code','technical':'Technical notes','project_note':'Project images come from the applications and their own product websites.',
  'skills_label':'04 / TOOLS & EXPERTISE','skills_title':'The areas I work in.<br>The tools I work with.',
  'skills_intro':'Technologies I use in professional work and personal projects.',
  'education_label':'05 / EDUCATION & LEARNING','education_title':'Always<br>learning.','education':'Education','certificates':'Certifications','cert_link':'Certifications on LinkedIn',
  'contact_label':'06 / CONTACT','contact_title':'Let’s talk<br><span>about an idea.</span>',
  'contact_body':'Software, product development, open source, or a shared curiosity. Connect with me on LinkedIn or explore my work on GitHub.',
  'footer':'Uğur Can Çeribaşı · Personal portfolio','updated':'Last updated · October 2026',
  'cv_summary':'Software developer with experience in frontend and BFF development, micro frontend architecture, GraphQL, technical governance and team leadership. Builds LLM applications, RAG systems and data-focused personal projects. Professional software development background since 2014.',
  'cv_projects':'Open-source projects','cv_tech':'Technologies & focus areas','cv_name':'Curriculum vitae','cv_location':'Istanbul, Türkiye',
 }
}
IDS=['about','experience','projects','technologies','education','contact']
MONTHS={'tr':['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],'en':['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']}
def loc(value,lang):return value[lang] if isinstance(value,dict) else value
def date(value,lang):
 if value is None:return COPY[lang]['present']
 if len(value)==4:return value
 year,month=value.split('-')
 return MONTHS[lang][int(month)-1]+' '+year
def period(row,lang):return date(row['start'],lang)+' — '+date(row['end'],lang)
def e(value):return escape(str(value),quote=True)
def job(row,lang,compact=False):
 company=e(loc(row['company'],lang));role=e(loc(row['role'],lang));dates=e(period(row,lang))
 mode=' · '+e(loc(row['mode'],lang)) if row.get('mode') else ''
 if compact:return '<div class="cv-job"><div><strong>'+role+'</strong><span>'+company+mode+'</span></div><time>'+dates+'</time></div>'
 current='<span class="current-badge">'+COPY[lang]['present']+'</span>' if row['end'] is None else ''
 return '<article class="job"><span class="company-mark" aria-hidden="true">'+company[0]+'</span><div class="job-main"><div class="job-company"><h3>'+company+'</h3>'+current+'</div><p class="job-role">'+role+'</p><p class="job-mode">'+(e(loc(row['mode'],lang)) if row.get('mode') else '')+'</p></div><time>'+dates+'</time></article>'
def school(row,lang):return '<article class="school"><span class="education-mark" aria-hidden="true">↗</span><div><h4>'+e(loc(row['school'],lang))+'</h4><p>'+e(loc(row['degree'],lang))+'</p><time>'+e(period(row,lang))+'</time></div></article>'
def project(p,lang,prefix):
 c=COPY[lang]
 bullets=''.join('<li>'+e(x)+'</li>' for x in p['details'][lang])
 tags=''.join('<span>'+e(t)+'</span>' for t in p['stack'])
 return '<article class="project project-'+p['id']+'"><div class="project-visual"><img src="'+prefix+'/assets/'+p['image']+'" alt="'+e(p['name'])+'" loading="lazy" width="1440" height="900"></div><div class="project-content"><div class="project-heading"><img src="'+prefix+'/assets/'+p['logo']+'" width="38" height="38" alt=""><div><p class="project-category">'+e(p['category'][lang])+'</p><h3>'+e(p['name'])+'</h3></div></div><p class="project-description">'+e(p['description'][lang])+'</p><div class="tech-tags">'+tags+'</div><div class="project-links"><a href="'+e(p['site'])+'" target="_blank" rel="noopener noreferrer">'+c['visit']+' <span aria-hidden="true">↗</span></a><a href="'+e(p['repo'])+'" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div><details class="project-details"><summary>'+c['technical']+'<span aria-hidden="true">+</span></summary><ul>'+bullets+'</ul></details></div></article>'

PAGE=Template('''<!doctype html><html lang="$lang"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>$title</title><meta name="description" content="$description"><meta name="theme-color" content="#f7f7f4"><meta property="og:title" content="$title"><meta property="og:description" content="$description"><meta property="og:type" content="profile"><link rel="icon" href="$prefix/assets/mark.svg" type="image/svg+xml"><link rel="stylesheet" href="$prefix/styles.css"><link rel="stylesheet" href="$prefix/motion.css"><link rel="alternate" hreflang="tr" href="$tr_url"><link rel="alternate" hreflang="en" href="$en_url"></head><body>
<a class="skip" href="#main">$skip</a><div class="page-shell"><aside class="sidebar"><a href="#main" class="identity"><span class="monogram" aria-hidden="true">uc.</span><span class="identity-name">Uğur Can<br>Çeribaşı<span class="identity-role">Senior Software Developer</span></span></a><button class="menu-button" type="button" aria-label="$menu" aria-expanded="false" aria-controls="main-nav">☰</button><nav id="main-nav" aria-label="$nav_label">$nav_html</nav><div class="sidebar-bottom"><div class="languages" aria-label="$language_label"><a href="$tr_url" $tr_current>TR</a><span>/</span><a href="$en_url" $en_current>EN</a></div><a class="cv-link" href="cv.html">$cv <span aria-hidden="true">↗</span></a><div class="sidebar-socials"><a href="$github" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="$linkedin" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div><p class="sidebar-location">$location</p></div></aside>
<main id="main"><section class="hero" aria-labelledby="hero-title"><div class="hero-kicker"><span class="tiny-dot"></span>$hello</div><div class="hero-layout"><div class="hero-copy"><h1 id="hero-title">$hero</h1><p class="hero-intro">$intro</p><div class="hero-actions"><a class="button" href="#projects">$projects_cta <span aria-hidden="true">↘</span></a><a class="text-link" href="cv.html">$cv <span aria-hidden="true">↗</span></a></div></div><div class="hero-scene" id="hero-scene"><div class="scene-topline"><span>$scene_label</span><span class="scene-index" aria-hidden="true">01 / 03</span></div><div class="scene-surface"><div class="scene-fallback" aria-hidden="true"><span></span><span></span><span></span></div><canvas id="scene-canvas" aria-hidden="true"></canvas></div><div class="scene-bottomline"><span class="scene-hint">$scene_hint <span aria-hidden="true">↗</span></span><div class="scene-controls" hidden><button type="button" id="scene-shape" aria-label="$scene_shape" title="$scene_shape">↻</button><button type="button" id="scene-toggle" aria-label="$scene_toggle" data-pause="$scene_toggle" data-resume="$scene_resume" aria-pressed="false" title="$scene_toggle">Ⅱ</button></div></div></div></div><div class="hero-footer"><div><span class="micro-label">$current</span><p>Senior Software Developer <span class="muted">/</span> <strong>Trendyol Group</strong></p></div><div><span class="micro-label">$since</span><p>$since_text</p></div></div></section>
<section class="section about-section" id="about" aria-labelledby="about-title"><div class="section-label">$about_label</div><div class="about-layout"><div class="about-identity"><h2 id="about-title">$about_title</h2><div class="portrait-wrap"><img class="portrait" src="$prefix/assets/portrait.jpg" alt="$photo_alt" width="460" height="460"><div class="portrait-note"><span>$location</span><span aria-hidden="true">↗</span></div></div></div><div class="about-text"><p>$about_p1</p><p>$about_p2</p><p>$about_p3</p><div class="focus-tags">$focus_html</div></div></div></section>
<section class="section experience-section" id="experience" aria-labelledby="experience-title"><div class="section-label">$experience_label</div><div class="section-top"><h2 id="experience-title">$experience_title</h2><p>$experience_intro</p></div><div class="timeline">$experience_html</div><details class="earlier"><summary>$earlier <span aria-hidden="true">+</span></summary><div class="timeline">$earlier_html</div></details></section>
<section class="section projects-section" id="projects" aria-labelledby="projects-title"><div class="section-label">$projects_label</div><div class="section-top"><h2 id="projects-title">$projects_title</h2><p>$projects_intro</p></div><div class="projects-grid">$projects_html</div><p class="project-image-note">$project_note</p></section>
<section class="section skills-section" id="technologies" aria-labelledby="skills-title"><div class="section-label">$skills_label</div><div class="section-top"><h2 id="skills-title">$skills_title</h2><p>$skills_intro</p></div><div class="skills-grid">$skills_html</div></section>
<section class="section education-section" id="education" aria-labelledby="education-title"><div class="section-label">$education_label</div><h2 id="education-title">$education_title</h2><div class="education-grid"><div><h3 class="subheading">$education</h3>$education_html</div><div><h3 class="subheading">$certificates</h3><div class="certificates">$certificates_html</div><a class="text-link cert-link" href="$linkedin" target="_blank" rel="noopener noreferrer">$cert_link <span aria-hidden="true">↗</span></a></div></div></section>
<section class="section contact-section" id="contact" aria-labelledby="contact-title"><div class="section-label">$contact_label</div><h2 id="contact-title">$contact_title</h2><div class="contact-bottom"><p>$contact_body</p><div class="contact-links"><a class="button" href="$linkedin" target="_blank" rel="noopener noreferrer">$contact_cta <span aria-hidden="true">↗</span></a><a class="text-link" href="$github" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div></div></section>
<footer><p>$footer</p><p>$updated</p><a href="#main" aria-label="$top_label">↑</a></footer></main></div><script src="$prefix/script.js" defer></script><script type="module" src="$prefix/scene.bundle.js"></script></body></html>''')

CV=Template('''<!doctype html><html lang="$lang"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Uğur Can Çeribaşı — CV</title><meta name="description" content="$description"><link rel="icon" href="$prefix/assets/mark.svg"><link rel="stylesheet" href="$prefix/cv.css"></head><body><div class="cv-toolbar"><a href="./">← $back</a><button id="print-cv" type="button">$print</button></div><main class="resume"><header><div><p class="cv-eyebrow">$cv_name</p><h1>Uğur Can Çeribaşı</h1><p class="cv-role">Senior Software Developer · Trendyol Group</p></div><div class="cv-contact"><span>$cv_location</span><a href="$github">github.com/uceribasi</a><a href="$linkedin">LinkedIn ↗</a></div></header><p class="cv-summary">$cv_summary</p><section><h2>$experience_all</h2>$cv_experience_html</section><section><h2>$cv_projects</h2>$cv_projects_html</section><section><h2>$cv_tech</h2><p class="cv-technologies">$cv_skills_html</p></section><section><h2>$education</h2>$cv_education_html</section><section><h2>$certificates</h2><p class="cv-cert-list">$cv_certificates_html</p></section><footer>$updated</footer></main><script src="$prefix/script.js" defer></script></body></html>''')

for lang,copy in COPY.items():
 d=dict(copy);prefix='..' if lang=='en' else '.'
 d.update(lang=lang,prefix=prefix,github=DATA['github'],linkedin=DATA['linkedin'],location=e(DATA['location'][lang]),tr_url='../' if lang=='en' else './',en_url='./' if lang=='en' else 'en/',tr_current='aria-current="page"' if lang=='tr' else '',en_current='aria-current="page"' if lang=='en' else '',nav_label='Bölümler' if lang=='tr' else 'Sections',language_label='Sayfa dili' if lang=='tr' else 'Page language',top_label='Başa dön' if lang=='tr' else 'Back to top')
 d['nav_html']=''.join('<a href="#'+ident+'"><span>0'+str(i+1)+'</span>'+label+'</a>' for i,(ident,label) in enumerate(zip(IDS,copy['nav'])))
 d['focus_html']=''.join('<span>'+e(t)+'</span>' for t in copy['focus'])
 d['experience_html']=''.join(job(j,lang) for j in DATA['experience'][:6])
 d['earlier_html']=''.join(job(j,lang) for j in DATA['experience'][6:])
 d['projects_html']=''.join(project(p,lang,prefix) for p in DATA['projects'])
 d['skills_html']=''.join('<article><span class="skill-num">0'+str(i+1)+'</span><h3>'+e(loc(s['name'],lang))+'</h3><div class="skill-tags">'+''.join('<span>'+e(t)+'</span>' for t in s['items'])+'</div></article>' for i,s in enumerate(DATA['skills']))
 d['education_html']=''.join(school(s,lang) for s in DATA['education'])
 d['certificates_html']=''.join('<article class="certificate"><span class="cert-mark" aria-hidden="true">↗</span><div><h4>'+e(c['name'])+'</h4><p>'+e(c['issuer'])+' <span>·</span> '+date(c['date'],lang)+'</p></div></article>' for c in DATA['certifications'])
 d['cv_experience_html']=''.join(job(j,lang,True) for j in DATA['experience'])
 d['cv_projects_html']=''.join('<article class="cv-project"><h3>'+e(p['name'])+' <a href="'+e(p['repo'])+'">GitHub ↗</a></h3><p>'+e(p['description'][lang])+'</p></article>' for p in DATA['projects'])
 d['cv_skills_html']=' · '.join(e(t) for group in DATA['skills'] for t in group['items'])
 d['cv_education_html']=''.join('<div class="cv-school"><div><strong>'+e(loc(s['school'],lang))+'</strong><span>'+e(loc(s['degree'],lang))+'</span></div><time>'+e(period(s,lang))+'</time></div>' for s in DATA['education'])
 d['cv_certificates_html']='<br>'.join(e(c['name'])+' — IBM · '+date(c['date'],lang) for c in DATA['certifications'])
 dest=ROOT/'en' if lang=='en' else ROOT
 dest.mkdir(exist_ok=True)
 (dest/'index.html').write_text(PAGE.substitute(d),encoding='utf-8')
 (dest/'cv.html').write_text(CV.substitute(d),encoding='utf-8')
 print(lang+': portfolio + CV generated')
