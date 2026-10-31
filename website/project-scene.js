import * as THREE from 'three';

const tabs=[...document.querySelectorAll('.project-tab')];
const ids=['readling','nuai','pastecompiler'];
const assets=['readling.png','nuai.png','pastecompiler.jpg'];
const names=['Readling','NU AI Video Editor','PasteCompiler'];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const mobile=matchMedia('(max-width:650px)');
const tr=document.documentElement.lang==='tr';

async function startShowcase(){
  if(tabs.length!==3)return;
  const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;
  const textures=await Promise.all(assets.map(async asset=>{
    const img=new Image();img.src=new URL('./assets/'+asset,import.meta.url).href;await img.decode();
    const buffer=document.createElement('canvas');buffer.width=1024;buffer.height=640;
    const ctx=buffer.getContext('2d');ctx.fillStyle='#12171b';ctx.fillRect(0,0,1024,640);
    const scale=Math.min(1004/img.width,620/img.height),width=img.width*scale,height=img.height*scale;
    ctx.drawImage(img,(1024-width)/2,(640-height)/2,width,height);
    const texture=new THREE.CanvasTexture(buffer);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
  }));
  const shell=document.createElement('div');shell.className='work-3d-shell';shell.appendChild(canvas);
  const controls=document.createElement('div');controls.className='work-3d-controls';
  const previousButton=document.createElement('button');previousButton.type='button';previousButton.textContent='←';previousButton.setAttribute('aria-label',tr?'Önceki proje':'Previous project');
  const hint=document.createElement('span');hint.textContent=tr?'SÜRÜKLE / KEŞFET':'DRAG / EXPLORE';
  const nextButton=document.createElement('button');nextButton.type='button';nextButton.textContent='→';nextButton.setAttribute('aria-label',tr?'Sonraki proje':'Next project');
  controls.append(previousButton,hint,nextButton);shell.appendChild(controls);
  const live=document.createElement('span');live.className='scene-announcement';live.setAttribute('role','status');shell.appendChild(live);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(36,1,.1,40);camera.position.set(0,.08,8);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x6b7b76,3));
  const light=new THREE.DirectionalLight(0xffffff,4);light.position.set(-4,6,5);scene.add(light);
  const fill=new THREE.DirectionalLight(0xb9ccdc,2);fill.position.set(4,0,-2);scene.add(fill);
  const boardGeometry=new THREE.BoxGeometry(6.08,3.89,.1),screenGeometry=new THREE.PlaneGeometry(5.96,3.725),edgeGeometry=new THREE.EdgesGeometry(boardGeometry);
  const cards=textures.map((texture,index)=>{
    const group=new THREE.Group();
    const frameMaterial=new THREE.MeshStandardMaterial({color:0x293434,metalness:.55,roughness:.35});
    const frame=new THREE.Mesh(boardGeometry,frameMaterial);frame.userData.projectIndex=index;group.add(frame);
    const screenMaterial=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
    const screen=new THREE.Mesh(screenGeometry,screenMaterial);screen.position.z=.058;screen.userData.projectIndex=index;group.add(screen);
    const edge=new THREE.LineSegments(edgeGeometry,new THREE.LineBasicMaterial({color:0x879b94,transparent:true,opacity:.45}));group.add(edge);
    scene.add(group);return {group,screenMaterial,brightness:1,meshes:[screen,frame]};
  });
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=256;shadowCanvas.height=128;
  const shadowCtx=shadowCanvas.getContext('2d'),gradient=shadowCtx.createRadialGradient(128,64,4,128,64,115);gradient.addColorStop(0,'rgba(12,22,18,.28)');gradient.addColorStop(1,'rgba(12,22,18,0)');shadowCtx.fillStyle=gradient;shadowCtx.fillRect(0,0,256,128);
  const shadowTexture=new THREE.CanvasTexture(shadowCanvas),shadow=new THREE.Mesh(new THREE.PlaneGeometry(8,2),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(0,-2.1,0);scene.add(shadow);
  let active=Math.max(0,tabs.findIndex(tab=>tab.getAttribute('aria-selected')==='true')),frameId=0,visible=false,modalOpen=false,previous=0,time=0,pointer={x:0,y:0},drag=null;
  const targetPosition=new THREE.Vector3(),targetRotation=new THREE.Euler();
  const render=()=>renderer.render(scene,camera);
  function update(dt=0,instant=false){
    const damping=instant?1:1-Math.exp(-9*dt);
    cards.forEach((card,index)=>{
      let offset=(index-active+3)%3;if(offset===2)offset=-1;
      const selected=offset===0;
      targetPosition.set(selected?0:offset*4.05,selected?.04:-.17,selected?.65:-1.7);
      if(!reduced.matches&&selected)targetPosition.y+=Math.sin(time*.7)*.028;
      targetRotation.set(selected?-.09-pointer.y*.08:-.03,selected?-.09+pointer.x*.11:-offset*.38,selected?.02:-offset*.025);
      card.group.position.lerp(targetPosition,damping);
      card.group.rotation.x+=(targetRotation.x-card.group.rotation.x)*damping;card.group.rotation.y+=(targetRotation.y-card.group.rotation.y)*damping;card.group.rotation.z+=(targetRotation.z-card.group.rotation.z)*damping;
      const scale=selected?1:.66;card.group.scale.setScalar(card.group.scale.x+(scale-card.group.scale.x)*damping);
      card.brightness+=((selected?1:.45)-card.brightness)*damping;card.screenMaterial.color.setScalar(card.brightness);
    });
  }
  function animate(now){frameId=0;const dt=previous?Math.min((now-previous)/1000,.05):0;previous=now;time+=dt;update(dt);render();if(visible&&!modalOpen&&!document.hidden&&!reduced.matches)frameId=requestAnimationFrame(animate);}
  function stop(){cancelAnimationFrame(frameId);frameId=0;previous=0;}
  function start(){if(!frameId&&visible&&!modalOpen&&!document.hidden&&!reduced.matches){previous=0;frameId=requestAnimationFrame(animate);}}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){if(reduced.matches){update(0,true);render();}else start();}else stop();},{rootMargin:'100px'});
  function mount(index){
    const old=shell.closest('.project-visual');if(old)old.classList.remove('work-3d-ready');
    active=index;
    const parent=document.querySelector('#panel-'+ids[active]+' .project-image-wrap');if(!parent)return;
    parent.appendChild(shell);parent.closest('.project-visual').classList.add('work-3d-ready');
    observer.disconnect();observer.observe(parent);live.textContent=names[active];
    const bounds=parent.getBoundingClientRect();visible=bounds.bottom>-100&&bounds.top<innerHeight+100;
    if(reduced.matches){update(0,true);render();}else start();
  }
  const choose=index=>tabs[(index+3)%3].click();
  previousButton.addEventListener('click',()=>choose(active-1));nextButton.addEventListener('click',()=>choose(active+1));
  new ResizeObserver(()=>{
    const bounds=shell.getBoundingClientRect();if(bounds.width<1||bounds.height<1)return;
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobile.matches?1.25:1.75));renderer.setSize(bounds.width,bounds.height,false);
    camera.aspect=bounds.width/bounds.height;camera.position.z=Math.max(7.9,6.8/(2*Math.tan(THREE.MathUtils.degToRad(18))*camera.aspect));camera.updateProjectionMatrix();render();
  }).observe(shell);
  const raycaster=new THREE.Raycaster(),ndc=new THREE.Vector2();
  canvas.addEventListener('pointerdown',event=>{drag={x:event.clientX,y:event.clientY,id:event.pointerId};canvas.setPointerCapture(event.pointerId);},{passive:true});
  canvas.addEventListener('pointermove',event=>{if(reduced.matches)return;const bounds=canvas.getBoundingClientRect();pointer={x:(event.clientX-bounds.left)/bounds.width*2-1,y:(event.clientY-bounds.top)/bounds.height*2-1};},{passive:true});
  canvas.addEventListener('pointerleave',()=>{if(!drag)pointer={x:0,y:0};});
  canvas.addEventListener('pointercancel',()=>{drag=null;pointer={x:0,y:0};});
  canvas.addEventListener('pointerup',event=>{
    if(!drag)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;drag=null;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){choose(active+(dx<0?1:-1));return;}
    if(Math.abs(dx)>8||Math.abs(dy)>8)return;
    const bounds=canvas.getBoundingClientRect();ndc.set((event.clientX-bounds.left)/bounds.width*2-1,-((event.clientY-bounds.top)/bounds.height*2-1));raycaster.setFromCamera(ndc,camera);
    const hit=raycaster.intersectObjects(cards.flatMap(card=>card.meshes))[0];if(hit&&hit.object.userData.projectIndex!==active)choose(hit.object.userData.projectIndex);
  },{passive:true});
  document.addEventListener('portfolio:project-change',event=>{const index=ids.indexOf(event.detail.id);if(index>=0)mount(index);});
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  document.addEventListener('portfolio:scene-modal',event=>{modalOpen=event.detail.open;if(modalOpen)stop();else start();});
  reduced.addEventListener('change',()=>{pointer={x:0,y:0};if(reduced.matches){stop();update(0,true);render();}else start();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();stop();shell.closest('.project-visual')?.classList.remove('work-3d-ready');shell.hidden=true;});
  canvas.addEventListener('webglcontextrestored',()=>{shell.hidden=false;shell.closest('.project-visual')?.classList.add('work-3d-ready');render();start();});
  update(0,true);mount(active);
}
startShowcase().catch(()=>{/* Product images remain visible if 3D assets fail. */});
