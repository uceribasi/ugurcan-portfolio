"use strict";
const menuButton=document.querySelector(".menu-button");
const navigation=document.getElementById("main-nav");
if(menuButton&&navigation){
 const close=()=>{navigation.classList.remove("open");menuButton.setAttribute("aria-expanded","false");};
 menuButton.addEventListener("click",()=>{const open=menuButton.getAttribute("aria-expanded")!=="true";navigation.classList.toggle("open",open);menuButton.setAttribute("aria-expanded",String(open));});
 navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",close));
 document.addEventListener("keydown",event=>{if(event.key==="Escape"&&navigation.classList.contains("open")){close();menuButton.focus();}});
 const sections=Array.from(document.querySelectorAll("main>section[id]"));
 const observer=new IntersectionObserver(entries=>{
  const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
  if(!visible.length)return;
  const active=visible[0].target.id;
  navigation.querySelectorAll("a").forEach(link=>{if(link.getAttribute("href")==="#"+active)link.setAttribute("aria-current","location");else link.removeAttribute("aria-current");});
 },{rootMargin:"-10% 0px -65% 0px",threshold:0});
 sections.forEach(section=>observer.observe(section));
}
const printButton=document.getElementById("print-cv");
if(printButton)printButton.addEventListener("click",()=>window.print());
