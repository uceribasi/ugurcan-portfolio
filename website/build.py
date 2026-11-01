#!/usr/bin/env python3
"""Build the bilingual portfolio and compact CV from verified content.json."""
from pathlib import Path
from string import Template
from html import escape
import json

ROOT=Path(__file__).resolve().parent
DATA=json.loads((ROOT/'content.json').read_text())
COPY={'tr': {'title': 'Uğur Can Çeribaşı — AI Odaklı Full Stack Developer',
        'description': 'Frontend kökenli, AI odaklı full stack geliştirici. AI agent tasarımı, iş akışları '
                       've uçtan uca ürün geliştirme. Projeler, deneyim ve özgeçmiş.',
        'nav': ['Hakkımda', 'Deneyim', 'Projeler', 'Teknolojiler', 'Eğitim', 'İletişim'],
        'skip': 'İçeriğe geç',
        'menu': 'Menüyü aç',
        'cv': 'CV görünümü',
        'back': 'Portfolyoya dön',
        'print': 'Yazdır / PDF olarak kaydet',
        'hello': 'MERHABA, BEN UĞUR CAN',
        'hero': 'AI ile<br><em>uçtan uca.</em>',
        'intro': 'AI odaklı full stack geliştiriciyim. Agentlar tasarlıyor, AI iş akışları kuruyor ve '
                 'fikirleri uçtan uca ürüne dönüştürüyorum.',
        'projects_cta': 'Projelerimi keşfet',
        'contact_cta': 'LinkedIn’de buluşalım',
        'current': 'ŞU ANDA',
        'since': '2014’TEN BU YANA',
        'since_text': 'Yazılım, mimari ve sürekli öğrenme.',
        'photo_alt': 'Uğur Can Çeribaşı’nın GitHub profil fotoğrafı',
        'scene_label': 'FİKİR → SİSTEM → ÜRÜN',
        'scene_hint': 'Fareyle keşfet',
        'scene_toggle': 'Hareketi durdur',
        'scene_resume': 'Hareketi başlat',
        'scene_shape': 'Formu değiştir',
        'about_label': '01 / HAKKIMDA',
        'about_title': 'Agentlardan<br><em>çalışan ürünlere.</em>',
        'about_p1': 'Frontend kökenli, AI odaklı bir full stack geliştiriciyim. Son dönemde AI agentları '
                    'tasarlamaya, iş akışları oluşturmaya ve AI’ı çalışan ürünlere entegre etmeye '
                    'yoğunlaşıyorum.',
        'about_p2': 'AI’ı geliştirme sürecinde etkin kullanıyorum: fikirleri prototiplere dönüştürüyor, '
                    'agentların ve iş akışlarının uygulama içinde nasıl birlikte çalışacağını tasarlıyorum. '
                    'LLM uygulamaları, RAG, embedding ve vektör veritabanları üzerine de çalışıyorum.',
        'about_p3': '2014’ten bu yana yazılım geliştiriyorum. React, Next.js, TypeScript ve NestJS ile '
                    'edindiğim frontend/BFF deneyimini; mimari kararlar, ekip liderliği ve açık kaynak ürün '
                    'geliştirme birikimiyle birleştiriyorum.',
        'focus': ['AI agentları & iş akışları', 'AI ürünleri', 'Full stack geliştirme'],
        'experience_label': '02 / DENEYİM',
        'experience_title': 'Çalıştığım yerler.<br>Üstlendiğim roller.',
        'experience_intro': 'E-ticaret, finans teknolojileri, dijital yayıncılık ve eğitim alanlarında '
                            'yazılım geliştirme geçmişim.',
        'earlier': 'Önceki deneyimler · 2014–2020',
        'present': 'Devam ediyor',
        'experience_all': 'Kariyer geçmişi',
        'projects_label': '03 / SEÇİLİ PROJELER',
        'projects_title': 'Kendi sorularımdan<br>doğan ürünler.',
        'projects_intro': 'AI entegrasyonlarını ürün deneyimine taşıdığım üç açık kaynak proje: dil öğrenme, '
                          'video düzenleme ve veri dönüştürme.',
        'visit': 'Siteyi ziyaret et',
        'source': 'Kaynak kodu',
        'technical': 'Teknik notlar',
        'project_note': 'Proje görselleri uygulamalardan ve kendi tanıtım sayfalarından alınmıştır.',
        'skills_label': '04 / ARAÇLAR & UZMANLIK',
        'skills_title': 'Çalıştığım alanlar.<br>Kullandığım araçlar.',
        'skills_intro': 'AI agent tasarımı, iş akışları ve uçtan uca uygulama geliştirmede odaklandığım '
                        'alanlar.',
        'education_label': '05 / EĞİTİM & ÖĞRENME',
        'education_title': 'Öğrenmeye<br>devam ediyorum.',
        'education': 'Eğitim',
        'certificates': 'Sertifikalar',
        'cert_link': 'LinkedIn’de sertifikalar',
        'contact_label': '06 / İLETİŞİM',
        'contact_title': 'Bir fikir üzerine<br><span>konuşalım.</span>',
        'contact_body': 'AI ürünleri, agent tasarımı, iş akışları ve uçtan uca uygulama geliştirme üzerine '
                        'konuşmak için LinkedIn’den ulaşabilirsin.',
        'footer': 'Uğur Can Çeribaşı · Kişisel portfolyo',
        'updated': 'Son güncelleme · Kasım 2026',
        'cv_summary': 'Frontend kökenli, AI odaklı full stack geliştirici. Son dönemde AI agent tasarımı, AI '
                      'iş akışları ve LLM tabanlı uygulamalara yoğunlaşıyor; AI’ı geliştirme sürecinde etkin '
                      'kullanıyor. RAG, embedding ve vektör veritabanları üzerine çalışıyor. 2014’ten bu '
                      'yana yazılım geliştirme, frontend/BFF mimarisi ve ekip liderliği deneyimine sahip.',
        'cv_projects': 'AI entegrasyonları & açık kaynak ürünler',
        'cv_tech': 'AI, full stack & mimari',
        'cv_name': 'Kısa özgeçmiş',
        'cv_location': 'İstanbul, Türkiye'},
 'en': {'title': 'Uğur Can Çeribaşı — AI-Focused Full Stack Developer',
        'description': 'Frontend-rooted, AI-focused full stack developer. AI agent design, workflows and '
                       'end-to-end product development. Projects, experience and CV.',
        'nav': ['About', 'Experience', 'Projects', 'Technologies', 'Education', 'Contact'],
        'skip': 'Skip to content',
        'menu': 'Open menu',
        'cv': 'CV view',
        'back': 'Back to portfolio',
        'print': 'Print / Save as PDF',
        'hello': 'HELLO, I’M UĞUR CAN',
        'hero': 'AI products.<br><em>End to end.</em>',
        'intro': 'I’m an AI-focused full stack developer. I design agents, build AI workflows and turn ideas '
                 'into end-to-end products.',
        'projects_cta': 'Explore my projects',
        'contact_cta': 'Connect on LinkedIn',
        'current': 'CURRENTLY',
        'since': 'BUILDING SINCE 2014',
        'since_text': 'Software, architecture and continuous learning.',
        'photo_alt': 'Uğur Can Çeribaşı’s GitHub profile photo',
        'scene_label': 'IDEA → SYSTEM → PRODUCT',
        'scene_hint': 'Move to explore',
        'scene_toggle': 'Pause motion',
        'scene_resume': 'Resume motion',
        'scene_shape': 'Change shape',
        'about_label': '01 / ABOUT',
        'about_title': 'From agents<br><em>to working products.</em>',
        'about_p1': 'I’m a frontend-rooted, AI-focused full stack developer. My current focus is designing '
                    'AI agents, building workflows and integrating AI into working products.',
        'about_p2': 'I use AI actively throughout development, moving ideas into prototypes and designing '
                    'how agents and workflows fit into applications. I also work with LLM applications, RAG, '
                    'embeddings and vector databases.',
        'about_p3': 'I have been developing software since 2014. I combine frontend and BFF experience with '
                    'React, Next.js, TypeScript and NestJS with architectural decisions, team leadership and '
                    'open-source product development.',
        'focus': ['AI agents & workflows', 'AI products', 'Full stack development'],
        'experience_label': '02 / EXPERIENCE',
        'experience_title': 'Where I’ve worked.<br>The roles I’ve taken.',
        'experience_intro': 'A software development background across e-commerce, financial technology, '
                            'digital streaming and education.',
        'earlier': 'Earlier experience · 2014–2020',
        'present': 'Present',
        'experience_all': 'Professional experience',
        'projects_label': '03 / SELECTED PROJECTS',
        'projects_title': 'Products that started<br>with my own questions.',
        'projects_intro': 'Three open-source projects that bring AI integrations into product experiences: '
                          'language learning, video editing and data conversion.',
        'visit': 'Visit website',
        'source': 'Source code',
        'technical': 'Technical notes',
        'project_note': 'Project images come from the applications and their own product websites.',
        'skills_label': '04 / TOOLS & EXPERTISE',
        'skills_title': 'The areas I work in.<br>The tools I work with.',
        'skills_intro': 'My focus across AI agent design, workflows and end-to-end application development.',
        'education_label': '05 / EDUCATION & LEARNING',
        'education_title': 'Always<br>learning.',
        'education': 'Education',
        'certificates': 'Certifications',
        'cert_link': 'Certifications on LinkedIn',
        'contact_label': '06 / CONTACT',
        'contact_title': 'Let’s talk<br><span>about an idea.</span>',
        'contact_body': 'Connect on LinkedIn to talk about AI products, agent design, workflows and '
                        'end-to-end application development.',
        'footer': 'Uğur Can Çeribaşı · Personal portfolio',
        'updated': 'Last updated · November 2026',
        'cv_summary': 'Frontend-rooted, AI-focused full stack developer. Currently focused on AI agent '
                      'design, AI workflows and LLM applications, using AI actively throughout development. '
                      'Works with RAG, embeddings and vector databases. Professional software development '
                      'background since 2014, including frontend/BFF architecture and team leadership.',
        'cv_projects': 'AI integrations & open-source products',
        'cv_tech': 'AI, full stack & architecture',
        'cv_name': 'Curriculum vitae',
        'cv_location': 'Istanbul, Türkiye'}}
CREATIVE={'tr': {'nav_work': 'İşler',
        'nav_about': 'Hakkımda',
        'nav_journey': 'Yolculuk',
        'hero_eyebrow': 'AI ODAKLI FULL STACK DEVELOPER',
        'creative_hero': 'AI ile<br><em>uçtan uca.</em>',
        'creative_intro': 'AI odaklı full stack geliştiriciyim. Agentlar tasarlıyor, AI iş akışları kuruyor '
                          've fikirleri uçtan uca ürüne dönüştürüyorum.',
        'live_canvas': 'CANLI TUVAL',
        'scene_expand': 'Tam ekran keşfet',
        'scene_close': 'Kapat',
        'scene_modes': 'Sahne görünümü',
        'mode_pixels': 'Piksel',
        'mode_code': 'Akış',
        'mode_sphere': 'Küre',
        'scatter': 'Dağıt',
        'gather': 'Toparla',
        'scene_pulse': 'Dalga yarat',
        'scene_instruction': 'Fareyle it · tıkla ve dalga yarat',
        'scene_dialog_label': 'Etkileşimli parçacık sahnesi',
        'scene_caption': 'Yüzeyin altında bir sistem var.',
        'layers_open': 'Katmanları aç',
        'layers_close': 'Katmanları kapat',
        'work_eyebrow': 'SEÇİLİ İŞLER',
        'work_title': 'AI ile<br><em>gerçek ürünler.</em>',
        'work_intro': 'AI entegrasyonlarını ürün deneyimine taşıdığım üç açık kaynak proje: dil öğrenme, '
                      'video düzenleme ve veri dönüştürme.',
        'project_tabs_label': 'Projeler arasında geçiş yap',
        'about_eyebrow': 'AI ODAĞIM',
        'creative_about_title': 'Agentlardan<br><em>çalışan ürünlere.</em>',
        'craft_title': 'AI’dan ürüne: odaklandığım alanlar',
        'journey_eyebrow': 'DENEYİM',
        'creative_experience_title': 'Her ekip,<br><em>yeni bir bakış.</em>',
        'career_note': 'E-ticaret, fintech, dijital yayıncılık ve eğitim. Farklı ürünler, farklı ölçekler, '
                       'biriken deneyim.',
        'learning_eyebrow': 'ÖĞRENME',
        'creative_education_title': 'Merak, hep<br><em>devam ediyor.</em>',
        'contact_eyebrow': 'İLETİŞİM',
        'contact_short': 'AI ürünleri, agentlar ve iş akışları üzerine.',
        'creative_contact_title': 'Bir sonraki<br><em>iyi fikre.</em>',
        'footer_note': 'Düşünerek tasarlandı. Kodla üretildi.',
        'hero_tools': 'AI agentları / İş akışları / Full stack'},
 'en': {'nav_work': 'Work',
        'nav_about': 'About',
        'nav_journey': 'Journey',
        'hero_eyebrow': 'AI-FOCUSED FULL STACK DEVELOPER',
        'creative_hero': 'AI products.<br><em>End to end.</em>',
        'creative_intro': 'I’m an AI-focused full stack developer. I design agents, build AI workflows and '
                          'turn ideas into end-to-end products.',
        'live_canvas': 'LIVE CANVAS',
        'scene_expand': 'Explore fullscreen',
        'scene_close': 'Close',
        'scene_modes': 'Scene view',
        'mode_pixels': 'Pixels',
        'mode_code': 'Flow',
        'mode_sphere': 'Sphere',
        'scatter': 'Scatter',
        'gather': 'Rebuild',
        'scene_pulse': 'Create a wave',
        'scene_instruction': 'Move to push · click to make a wave',
        'scene_dialog_label': 'Interactive particle scene',
        'scene_caption': 'There’s a system beneath the surface.',
        'layers_open': 'Explore layers',
        'layers_close': 'Close layers',
        'work_eyebrow': 'SELECTED WORK',
        'work_title': 'AI in<br><em>real products.</em>',
        'work_intro': 'Three open-source projects that bring AI integrations into product experiences: '
                      'language learning, video editing and data conversion.',
        'project_tabs_label': 'Switch between projects',
        'about_eyebrow': 'MY AI FOCUS',
        'creative_about_title': 'From agents<br><em>to working products.</em>',
        'craft_title': 'From AI to product: my focus areas',
        'journey_eyebrow': 'EXPERIENCE',
        'creative_experience_title': 'Every team,<br><em>a new perspective.</em>',
        'career_note': 'E-commerce, fintech, digital streaming and education. Different products, different '
                       'scales, growing experience.',
        'learning_eyebrow': 'LEARNING',
        'creative_education_title': 'Curiosity<br><em>never stops.</em>',
        'contact_eyebrow': 'CONTACT',
        'contact_short': 'On AI products, agents and workflows.',
        'creative_contact_title': 'Here’s to the<br><em>next good idea.</em>',
        'footer_note': 'Designed with intention. Built with code.',
        'hero_tools': 'AI agents / Workflows / Full stack'}}
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
 c=COPY[lang];number=DATA['projects'].index(p)+1;explore='3D’de keşfet' if lang=='tr' else 'Explore in 3D'
 bullets=''.join('<li>'+e(x)+'</li>' for x in p['details'][lang])
 tags=''.join('<span>'+e(t)+'</span>' for t in p['stack'])
 return '<article class="project-panel project-'+p['id']+'" id="panel-'+p['id']+'" aria-labelledby="tab-'+p['id']+'"><div class="project-visual"><div class="window-bar"><span class="window-dots" aria-hidden="true">● ● ●</span><span>'+e(p['name'])+'</span><span aria-hidden="true">↗</span></div><div class="project-image-wrap"><img src="'+prefix+'/assets/'+p['image']+'" alt="'+e(p['name'])+'" loading="lazy" width="1440" height="900"></div><span class="project-watermark" aria-hidden="true">0'+str(number)+'</span></div><div class="project-body"><div class="project-title"><span class="project-category">'+e(p['category'][lang])+'</span><h3>'+e(p['name'])+'</h3></div><div class="project-description"><p>'+e(p['description'][lang])+'</p><div class="tech-tags">'+tags+'</div></div><div class="project-links"><a class="button" href="'+e(p['site'])+'" target="_blank" rel="noopener noreferrer">'+c['visit']+' <span aria-hidden="true">↗</span></a><a class="text-link" href="'+e(p['repo'])+'" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a><button type="button" class="text-link project-in-scene" disabled data-project="'+p['id']+'">'+explore+' <span aria-hidden="true">↗</span></button></div></div><details class="project-details"><summary>'+c['technical']+'<span aria-hidden="true">+</span></summary><ul>'+bullets+'</ul></details></article>'

PAGE=Template((ROOT/'template.html').read_text())

CV=Template('''<!doctype html><html lang="$lang"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Uğur Can Çeribaşı — CV</title><meta name="description" content="$description"><link rel="icon" href="$prefix/assets/mark.svg"><link rel="stylesheet" href="$prefix/cv.css?v=6"></head><body><div class="cv-toolbar"><a href="./">← $back</a><button id="print-cv" type="button">$print</button></div><main class="resume"><header><div><p class="cv-eyebrow">$cv_name</p><h1>Uğur Can Çeribaşı</h1><p class="cv-positioning">$positioning</p><p class="cv-role">Senior Software Developer · Trendyol Group</p></div><div class="cv-contact"><span>$cv_location</span><a href="$github">github.com/uceribasi</a><a href="$linkedin">LinkedIn ↗</a></div></header><p class="cv-summary">$cv_summary</p><section><h2>$experience_all</h2>$cv_experience_html</section><section><h2>$cv_projects</h2>$cv_projects_html</section><section><h2>$cv_tech</h2><p class="cv-technologies">$cv_skills_html</p></section><section><h2>$education</h2>$cv_education_html</section><section><h2>$certificates</h2><p class="cv-cert-list">$cv_certificates_html</p></section><footer>$updated</footer></main><script src="$prefix/script.js" defer></script></body></html>''')

for lang,copy in COPY.items():
 d=dict(copy);d.update(CREATIVE[lang]);prefix='..' if lang=='en' else '.'
 d.update(lang=lang,prefix=prefix,github=DATA['github'],linkedin=DATA['linkedin'],location=e(DATA['location'][lang]),positioning=e(DATA['positioning'][lang]),tr_url='../' if lang=='en' else './',en_url='./' if lang=='en' else 'en/',tr_current='aria-current="page"' if lang=='tr' else '',en_current='aria-current="page"' if lang=='en' else '',nav_label='Bölümler' if lang=='tr' else 'Sections',language_label='Sayfa dili' if lang=='tr' else 'Page language',top_label='Başa dön' if lang=='tr' else 'Back to top')
 d['nav_html']=''.join('<a href="#'+ident+'"><span>0'+str(i+1)+'</span>'+label+'</a>' for i,(ident,label) in enumerate(zip(IDS,copy['nav'])))
 d['focus_html']=''.join('<span>'+e(t)+'</span>' for t in copy['focus'])
 d['experience_html']=''.join(job(j,lang) for j in DATA['experience'][:6])
 d['earlier_html']=''.join(job(j,lang) for j in DATA['experience'][6:])
 d['projects_html']=''.join(project(p,lang,prefix) for p in DATA['projects'])
 d['project_tabs']=''.join('<button type="button" class="project-tab" id="tab-'+p['id']+'" aria-controls="panel-'+p['id']+'"><span class="tab-number">0'+str(i+1)+'</span><img src="'+prefix+'/assets/'+p['logo']+'" width="28" height="28" alt=""><span>'+e(p['name'])+'</span><span class="tab-arrow" aria-hidden="true">↗</span></button>' for i,p in enumerate(DATA['projects']))
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
