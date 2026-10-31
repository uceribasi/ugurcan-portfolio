import * as THREE from 'three';
import './project-scene.js';

const host=document.getElementById('hero-scene');
const canvas=document.getElementById('scene-canvas');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const compact=matchMedia('(max-width:650px)');
const tr=document.documentElement.lang==='tr';

const vertexShader=/* glsl */`
attribute vec3 aImage;
attribute vec3 aCode;
attribute vec3 aSphere;
attribute vec3 aScatter;
attribute vec3 aImageColor;
attribute vec3 aCodeColor;
attribute vec3 aSphereColor;
attribute float aImageAlpha;
attribute float aCodeAlpha;
attribute float aSeed;
uniform vec3 uWeights;
uniform float uDisperse;
uniform float uTime;
uniform float uSize;
uniform vec3 uPointer;
uniform float uPointerStrength;
uniform vec3 uPulse;
uniform float uPulseTime;
varying vec3 vColor;
varying float vAlpha;
vec3 rotateY(vec3 p,float a){return vec3(p.x*cos(a)+p.z*sin(a),p.y,-p.x*sin(a)+p.z*cos(a));}
void main(){
  vec3 sphere=rotateY(aSphere,uTime*.15);
  sphere+=normalize(sphere)*sin(sphere.y*3.0+uTime*1.5+aSeed*2.0)*.12;
  vec3 target=aImage*uWeights.x+aCode*uWeights.y+sphere*uWeights.z;
  target.z+=sin(target.x*1.7+uTime*.8)*.07*(uWeights.x+uWeights.y);
  vec3 galaxy=rotateY(aScatter,uTime*.075);
  galaxy.xy+=vec2(sin(uTime*.3+aSeed*10.0),cos(uTime*.4+aSeed*7.0))*.11;
  float d=smoothstep(0.0,1.0,uDisperse);
  vec3 p=mix(target,galaxy,d);
  p+=vec3(sin(aSeed*30.0+uTime),cos(aSeed*23.0+uTime*.7),sin(aSeed*17.0))*sin(d*3.14159265)*.8;
  vec3 away=p-uPointer;away.z*=.45;
  float proximity=exp(-dot(away,away)*1.6)*uPointerStrength;
  p+=normalize(away+vec3(.001))*proximity*.95;
  float age=max(0.0,uTime-uPulseTime);
  vec3 wave=p-uPulse;
  float ring=exp(-pow((length(wave)-age*3.1)*4.0,2.0))*max(0.0,1.0-age*.48);
  p+=normalize(wave+vec3(.001))*ring*.6;
  vec3 color=aImageColor*uWeights.x+aCodeColor*uWeights.y+aSphereColor*uWeights.z;
  color=mix(color,aSphereColor,d*.85);
  vColor=color+vec3(.22,.32,.15)*(proximity+ring*.75);
  float opacity=aImageAlpha*uWeights.x+aCodeAlpha*uWeights.y+uWeights.z*.82;
  vAlpha=mix(opacity,.8,d);
  vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mvPosition;
  gl_PointSize=clamp(uSize*(7.7/-mvPosition.z)*(.8+aSeed*.36),1.0,22.0);
}`;
const fragmentShader=/* glsl */`
varying vec3 vColor;
varying float vAlpha;
void main(){
  float r=length(gl_PointCoord-.5);
  if(r>.5)discard;
  float core=1.0-smoothstep(.15,.5,r);
  float alpha=core*vAlpha;
  if(alpha<.012)discard;
  gl_FragColor=vec4(vColor*(.82+core*.45),alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

function sourceCanvas(code=false){
  const image=document.createElement('canvas');image.width=1024;image.height=650;
  const ctx=image.getContext('2d');ctx.fillStyle='#060b08';ctx.fillRect(0,0,1024,650);
  const gradient=ctx.createLinearGradient(120,100,930,580);
  gradient.addColorStop(0,'#eaffc5');gradient.addColorStop(.45,'#d4ff72');gradient.addColorStop(1,code?'#86e5ee':'#8bbc52');
  ctx.fillStyle=gradient;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font=code?'bold 390px monospace':'700 520px Space,Arial,sans-serif';
  ctx.fillText(code?'</>':'uc.',512,code?332:322);
  return image;
}
function sample(source,columns,rows){
  const surface=document.createElement('canvas');surface.width=columns;surface.height=rows;
  const ctx=surface.getContext('2d',{willReadFrequently:true});
  ctx.fillStyle='#090e09';ctx.fillRect(0,0,columns,rows);
  const fit=Math.min(columns/source.width,rows/source.height);
  const width=source.width*fit,height=source.height*fit;
  ctx.drawImage(source,(columns-width)/2,(rows-height)/2,width,height);
  const pixels=ctx.getImageData(0,0,columns,rows).data;
  const colors=new Float32Array(columns*rows*3),alpha=new Float32Array(columns*rows);
  for(let i=0;i<columns*rows;i++){
    const r=pixels[i*4]/255,g=pixels[i*4+1]/255,b=pixels[i*4+2]/255;
    colors.set([Math.pow(r,2.2),Math.pow(g,2.2),Math.pow(b,2.2)],i*3);
    alpha[i]=Math.max(.025,Math.min(1,Math.max(r,g,b)*1.3-.035));
  }
  return {colors,alpha};
}

if(host&&canvas){
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'low-power'});}catch{/* Static CSS composition remains available. */}
  if(renderer){
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(44,1,.1,35);camera.position.z=7.7;
    const columns=compact.matches?76:120,rows=compact.matches?48:76,count=columns*rows;
    const imageSample=sample(sourceCanvas(),columns,rows),codeSample=sample(sourceCanvas(true),columns,rows);
    const image=new Float32Array(count*3),code=new Float32Array(count*3),sphere=new Float32Array(count*3),scatter=new Float32Array(count*3),colors=new Float32Array(count*3),seeds=new Float32Array(count);
    const palette=[new THREE.Color('#d4ff72'),new THREE.Color('#88dfe5'),new THREE.Color('#c69aff'),new THREE.Color('#fff3c0')];
    for(let i=0;i<count;i++){
      const x=i%columns,y=Math.floor(i/columns),seed=((i*16807)%2147483647)/2147483647;
      const random=(n)=>{const value=Math.sin((i+1)*n)*43758.5453;return value-Math.floor(value);};
      image.set([(x/(columns-1)-.5)*6.1,(.5-y/(rows-1))*3.88,(random(12.73)-.5)*.11],i*3);
      code.set([(x/(columns-1)-.5)*5.7,(.5-y/(rows-1))*3.62,(random(8.21)-.5)*.18],i*3);
      const longitude=i*2.3999632,latitude=Math.acos(1-2*(i+.5)/count),radius=2.12+.08*Math.sin(i*.021);
      sphere.set([Math.sin(latitude)*Math.cos(longitude)*radius,Math.cos(latitude)*radius,Math.sin(latitude)*Math.sin(longitude)*radius],i*3);
      const r=.28+Math.pow(random(3.15),.65)*3.5,angle=(i%5)*Math.PI*.4+r*1.65+random(7.7)*.4;
      scatter.set([Math.cos(angle)*r,Math.sin(angle)*r*.76,(random(4.13)-.5)*(3.4-r*.35)],i*3);
      const color=palette[Math.floor(random(2.33)*palette.length)].clone().lerp(palette[(i+1)%palette.length],.25);
      color.toArray(colors,i*3);seeds[i]=random(15.9)+seed;
    }
    const geometry=new THREE.BufferGeometry();
    for(const [name,array,size] of [['position',image,3],['aImage',image,3],['aCode',code,3],['aSphere',sphere,3],['aScatter',scatter,3],['aImageColor',imageSample.colors,3],['aCodeColor',codeSample.colors,3],['aSphereColor',colors,3],['aImageAlpha',imageSample.alpha,1],['aCodeAlpha',codeSample.alpha,1],['aSeed',seeds,1]])geometry.setAttribute(name,new THREE.BufferAttribute(array,size));
    const weights=new THREE.Vector3(1,0,0),targetWeights=weights.clone();
    const uniforms={uWeights:{value:weights},uDisperse:{value:reduced.matches?0:1},uTime:{value:0},uSize:{value:3},uPointer:{value:new THREE.Vector3(20,20,0)},uPointerStrength:{value:0},uPulse:{value:new THREE.Vector3()},uPulseTime:{value:-100}};
    const material=new THREE.ShaderMaterial({uniforms,vertexShader,fragmentShader,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});
    const cloud=new THREE.Points(geometry,material);cloud.frustumCulled=false;scene.add(cloud);
    const surface=host.querySelector('.scene-surface'),toggle=document.getElementById('scene-toggle'),disperse=document.getElementById('scene-disperse'),pulseButton=document.getElementById('scene-pulse'),expand=document.getElementById('scene-expand'),dialog=document.getElementById('scene-dialog'),anchor=document.getElementById('scene-anchor');
    const modeButtons=[...host.querySelectorAll('[data-scene-mode]')];
    const sceneName=document.getElementById('scene-name'),announcement=host.querySelector('.scene-announcement');
    let paused=reduced.matches,visible=true,frame=0,time=0,previous=0,scatterValue=reduced.matches?0:1,scatterTarget=0,pointerStrength=0,currentProject=null,loadId=0,lastTrigger=null;
    const raycaster=new THREE.Raycaster(),pointerNdc=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,0,1),0);
    const render=()=>{
      const width=6.65*weights.x+6.2*weights.y+4.95*weights.z;
      const height=4.3*weights.x+4.1*weights.y+4.95*weights.z;
      const blend=scatterValue*scatterValue*(3-2*scatterValue);
      const contentWidth=width+(7.7-width)*blend,contentHeight=height+(6.1-height)*blend;
      const tangent=Math.tan(THREE.MathUtils.degToRad(22));
      camera.position.z=Math.max(contentHeight/(2*tangent),contentWidth/(2*tangent*Math.max(.35,camera.aspect)));
      renderer.render(scene,camera);
    };
    const ease=(speed,dt)=>1-Math.exp(-speed*dt);
    function settle(){weights.copy(targetWeights);scatterValue=scatterTarget;uniforms.uDisperse.value=scatterValue;render();}
    function animate(now){
      frame=0;const dt=previous?Math.min((now-previous)/1000,.05):0;previous=now;
      if(!paused){time+=dt;weights.lerp(targetWeights,ease(4,dt));scatterValue+=(scatterTarget-scatterValue)*ease(2.2,dt);uniforms.uPointerStrength.value+=(pointerStrength-uniforms.uPointerStrength.value)*ease(7,dt);}
      uniforms.uTime.value=time;uniforms.uDisperse.value=scatterValue;render();
      if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(animate);
    }
    function stop(){cancelAnimationFrame(frame);frame=0;previous=0;}
    function start(){if(!frame&&!paused&&visible&&!document.hidden){previous=0;frame=requestAnimationFrame(animate);}}
    function updatePause(){const label=paused?toggle.dataset.resume:toggle.dataset.pause;toggle.setAttribute('aria-label',label);toggle.title=label;toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'▷':'Ⅱ';}
    function setMode(index){
      targetWeights.set(index===0?1:0,index===1?1:0,index===2?1:0);
      modeButtons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.sceneMode)===index)));
      if(paused||reduced.matches)settle();else start();
    }
    function setScatter(value){
      scatterTarget=value;disperse.setAttribute('aria-pressed',String(Boolean(value)));
      disperse.innerHTML=(value?disperse.dataset.gather:disperse.dataset.scatter)+' <span aria-hidden="true">↗</span>';
      if(paused||reduced.matches)settle();else start();
    }
    function wave(position=new THREE.Vector3()){
      uniforms.uPulse.value.copy(position);uniforms.uPulseTime.value=time-(paused?.16:0);
      if(paused)render();else start();
    }
    function locate(event){
      const bounds=surface.getBoundingClientRect();pointerNdc.set((event.clientX-bounds.left)/bounds.width*2-1,-((event.clientY-bounds.top)/bounds.height*2-1));raycaster.setFromCamera(pointerNdc,camera);raycaster.ray.intersectPlane(plane,uniforms.uPointer.value);
    }
    surface.addEventListener('pointermove',event=>{if(paused||reduced.matches)return;locate(event);pointerStrength=1;},{passive:true});
    surface.addEventListener('pointerdown',event=>{if(reduced.matches)return;locate(event);wave(uniforms.uPointer.value);},{passive:true});
    surface.addEventListener('pointerleave',()=>{pointerStrength=0;});
    modeButtons.forEach(button=>button.addEventListener('click',()=>setMode(Number(button.dataset.sceneMode))));
    disperse.addEventListener('click',()=>setScatter(scatterTarget?0:1));pulseButton.addEventListener('click',()=>wave());
    toggle.addEventListener('click',()=>{paused=!paused;updatePause();if(paused)stop();else start();});
    function leaveDialog(){
      if(!dialog.open)return;anchor.appendChild(host);host.classList.remove('scene-expanded');dialog.close();expand.innerHTML=expand.dataset.expand+' <span aria-hidden="true">↗</span>';expand.setAttribute('aria-expanded','false');document.body.classList.remove('scene-modal-open');document.dispatchEvent(new CustomEvent('portfolio:scene-modal',{detail:{open:false}}));if(lastTrigger?.isConnected)lastTrigger.focus();visible=true;start();
    }
    function openDialog(){
      if(dialog.open)return;lastTrigger=document.activeElement;dialog.appendChild(host);host.classList.add('scene-expanded');dialog.showModal();expand.innerHTML=expand.dataset.close+' <span aria-hidden="true">×</span>';expand.setAttribute('aria-expanded','true');document.body.classList.add('scene-modal-open');document.dispatchEvent(new CustomEvent('portfolio:scene-modal',{detail:{open:true}}));expand.focus();visible=true;start();
    }
    expand.addEventListener('click',()=>dialog.open?leaveDialog():openDialog());
    dialog.addEventListener('cancel',event=>{event.preventDefault();leaveDialog();});dialog.addEventListener('click',event=>{if(event.target===dialog)leaveDialog();});
    new ResizeObserver(()=>{
      const bounds=surface.getBoundingClientRect(),ratio=Math.min(devicePixelRatio,compact.matches?1.25:1.75);
      if(bounds.width<1||bounds.height<1)return;
      renderer.setPixelRatio(ratio);renderer.setSize(bounds.width,bounds.height,false);
      camera.aspect=bounds.width/bounds.height;camera.updateProjectionMatrix();
      uniforms.uSize.value=Math.max(1.7,bounds.height/rows*.55)*ratio;render();
    }).observe(surface);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting||dialog.open;if(visible)start();else stop();},{rootMargin:'80px'}).observe(host);
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
    reduced.addEventListener('change',()=>{paused=reduced.matches;pointerStrength=0;uniforms.uPointerStrength.value=0;updatePause();if(paused){stop();settle();}else start();});
    const projects={readling:{name:'Readling',asset:'readling.png'},nuai:{name:'NU AI Video Editor',asset:'nuai.png'},pastecompiler:{name:'PasteCompiler',asset:'pastecompiler.jpg'}};
    const samples=new Map();
    async function showProject(id,full=false){
      const project=projects[id];if(!project)return;
      if(full)openDialog();const request=++loadId;
      try{
        if(!samples.has(id))samples.set(id,(async()=>{const img=new Image();img.src=new URL('./assets/'+project.asset,import.meta.url).href;await img.decode();return sample(img,columns,rows);})());
        const data=await samples.get(id);if(request!==loadId)return;
        currentProject=id;geometry.attributes.aImageColor.array.set(data.colors);geometry.attributes.aImageColor.needsUpdate=true;geometry.attributes.aImageAlpha.array.set(data.alpha);geometry.attributes.aImageAlpha.needsUpdate=true;
        sceneName.textContent=project.name+' / '+(tr?'CANLI TUVAL':'LIVE CANVAS');announcement.textContent=project.name;
        setMode(0);setScatter(0);scatterValue=reduced.matches||paused?0:1;uniforms.uDisperse.value=scatterValue;if(paused)settle();else start();
      }catch{announcement.textContent=tr?'Proje görseli yüklenemedi.':'The project image could not be loaded.';}
    }
    document.addEventListener('portfolio:project-change',event=>showProject(event.detail.id));
    document.addEventListener('portfolio:explore-project',event=>showProject(event.detail.id,true));
    document.fonts.ready.then(()=>{if(currentProject)return;const data=sample(sourceCanvas(),columns,rows);geometry.attributes.aImageColor.array.set(data.colors);geometry.attributes.aImageAlpha.array.set(data.alpha);geometry.attributes.aImageColor.needsUpdate=true;geometry.attributes.aImageAlpha.needsUpdate=true;render();});
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();stop();host.classList.remove('scene-ready');host.querySelector('.particle-ui').hidden=true;if(!dialog.open)expand.hidden=true;});
    canvas.addEventListener('webglcontextrestored',()=>{host.classList.add('scene-ready');host.querySelector('.particle-ui').hidden=false;expand.hidden=false;render();start();});
    document.querySelectorAll('.project-in-scene').forEach(button=>button.disabled=false);
    updatePause();animate(0);host.classList.add('scene-ready');host.querySelector('.particle-ui').hidden=false;expand.hidden=false;
  }
}
