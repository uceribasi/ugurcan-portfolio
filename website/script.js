'use strict';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('.menu-button');
const navigation = document.getElementById('main-nav');
if (menuButton && navigation) {
  const close = () => {navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');};
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('open', open); menuButton.setAttribute('aria-expanded', String(open));
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {close(); menuButton.focus();}
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigation.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin: '-15% 0px -60% 0px'});
  document.querySelectorAll('main>section[id]').forEach(section => observer.observe(section));
}
const projectTabs = [...document.querySelectorAll('.project-tab')];
const tablist = document.querySelector('.project-tabs');
if (tablist && projectTabs.length) {
  tablist.setAttribute('role', 'tablist');
  const activate = (tab, moveFocus = false) => {
    projectTabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('role', 'tab');
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      panel.setAttribute('role', 'tabpanel');
      panel.hidden = !selected;
      panel.classList.remove('is-entering');
      if (selected && !reduceMotion.matches) {void panel.offsetWidth; panel.classList.add('is-entering');}
    });
    document.dispatchEvent(new CustomEvent('portfolio:project-change', {detail: {id: tab.id.replace('tab-','')}}));
    if (moveFocus) tab.focus();
  };
  projectTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % projectTabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + projectTabs.length) % projectTabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = projectTabs.length - 1;
      else return;
      event.preventDefault(); activate(projectTabs[next], true);
    });
  });
  document.querySelector('.project-explorer').classList.add('projects-enhanced');
  activate(projectTabs[0]);
}
if (!reduceMotion.matches) {
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([{transform:'translateY(24px)',opacity:.55},{transform:'translateY(0)',opacity:1}], {duration:800,easing:'cubic-bezier(.2,.7,.2,1)'});
      reveal.unobserve(entry.target);
    });
  }, {threshold:.1});
  document.querySelectorAll('.section-heading,.about-story,.about-portrait,.learning-intro,.skills-grid,.career-list,.contact-cta').forEach(element => reveal.observe(element));
}
const header = document.querySelector('.site-header');
if (header) {
  let ticking = false;
  const progress = () => {
    const length = document.documentElement.scrollHeight - innerHeight;
    header.style.setProperty('--progress', length > 0 ? Math.min(scrollY / length, 1) : 0);
    ticking = false;
  };
  addEventListener('scroll', () => {if (!ticking) {ticking = true; requestAnimationFrame(progress);}}, {passive:true});
  addEventListener('resize', progress, {passive:true}); progress();
}
const printButton = document.getElementById('print-cv');
if (printButton) printButton.addEventListener('click', () => window.print());

document.querySelectorAll('.project-in-scene').forEach(button => button.addEventListener('click', () => {document.dispatchEvent(new CustomEvent('portfolio:explore-project', {detail:{id:button.dataset.project}}));}));
