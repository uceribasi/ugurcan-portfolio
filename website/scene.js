import * as THREE from 'three';

const host = document.getElementById('hero-scene');
const canvas = document.getElementById('scene-canvas');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width:650px)');

function rounded(ctx, x, y, width, height, radius, fill) {
  ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); ctx.fill();
}
function texture(kind) {
  const image = document.createElement('canvas'); image.width = 1024; image.height = 650;
  const ctx = image.getContext('2d');
  const isFront = kind === 'interface';
  ctx.fillStyle = isFront ? '#e9eee1' : '#172013'; ctx.fillRect(0,0,1024,650);
  ctx.strokeStyle = isFront ? '#b4bfa8' : '#344a26'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0,64); ctx.lineTo(1024,64); ctx.stroke();
  for (let i=0;i<3;i++) {ctx.fillStyle=isFront?'#a6b398':'#657c50';ctx.beginPath();ctx.arc(32+i*22,32,5,0,Math.PI*2);ctx.fill();}
  ctx.font='16px monospace'; ctx.fillStyle=isFront?'#728365':'#708b59'; ctx.fillText(kind === 'interface' ? 'uc / interface' : kind === 'logic' ? 'portfolio.tsx' : 'system / architecture', 140,38);
  if (isFront) {
    ctx.fillStyle='#192112';ctx.font='bold 32px Arial';ctx.fillText('uc.',56,124);
    ctx.font='15px monospace';ctx.fillStyle='#8a977f';ctx.fillText('WORK      ABOUT      CONTACT',480,119);
    ctx.fillStyle='#1b2614';ctx.font='72px Georgia';ctx.fillText('Ideas,',55,250);ctx.font='italic 76px Georgia';ctx.fillText('made real.',55,330);
    ctx.fillStyle='#86967b';ctx.font='17px monospace';ctx.fillText('INTERFACE / SYSTEM / PRODUCT',58,384);
    rounded(ctx,56,420,235,57,28,'#c3ed77');ctx.fillStyle='#283a18';ctx.font='17px monospace';ctx.fillText('Explore the work',77,455);
    ctx.save();ctx.translate(760,300);ctx.rotate(-.15);ctx.fillStyle='#c0e776';ctx.beginPath();ctx.arc(0,0,131,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#577731';ctx.lineWidth=2;for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(-155,i*32);ctx.lineTo(155,i*32);ctx.stroke();}
    ctx.fillStyle='#2b4120';ctx.fillRect(-26,-91,52,182);ctx.fillRect(-91,-26,182,52);ctx.restore();
    ctx.strokeStyle='#cbd5bf';ctx.beginPath();ctx.moveTo(56,529);ctx.lineTo(968,529);ctx.stroke();
    for(let i=0;i<3;i++){const x=56+i*313;ctx.fillStyle='#7e906c';ctx.font='12px monospace';ctx.fillText('0'+(i+1),x,572);rounded(ctx,x+40,559,170,7,3,'#b8c7a9');rounded(ctx,x+40,579,120,5,2,'#d1dbc7');}
  } else if (kind === 'logic') {
    const lines = [
      [0,'const portfolio = {','#8caf6f'],[1,'name: "Uğur Can Çeribaşı",','#d4e5c2'],[1,'focus: ["frontend", "systems"],','#d4e5c2'],[1,'projects: [','#94b77a'],[2,'"Readling",','#d2ff7d'],[2,'"NU AI Video Editor",','#d2ff7d'],[2,'"PasteCompiler"','#d2ff7d'],[1,'],','#94b77a'],[0,'};','#8caf6f'],[0,'','#8caf6f'],[0,'return <Ideas made="real" />;','#d4e5c2']
    ];
    lines.forEach(([indent,text,color],i)=>{ctx.font='20px monospace';ctx.fillStyle='#425d34';ctx.fillText(String(i+1).padStart(2,'0'),30,122+i*40);ctx.fillStyle=color;ctx.font='26px monospace';ctx.fillText(text,103+indent*30,122+i*40);});
  } else {
    ctx.strokeStyle='#293d1f';ctx.lineWidth=1;
    for(let x=32;x<1024;x+=40){ctx.beginPath();ctx.moveTo(x,65);ctx.lineTo(x,650);ctx.stroke();}
    for(let y=90;y<650;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1024,y);ctx.stroke();}
    const nodes=[{x:64,y:150,w:300,h:100,text:'Interface',num:'01'},{x:620,y:150,w:300,h:100,text:'State',num:'02'},{x:620,y:410,w:300,h:100,text:'Data',num:'03'},{x:64,y:410,w:300,h:100,text:'Product',num:'04'}];
    ctx.strokeStyle='#83ac55';ctx.lineWidth=2;ctx.setLineDash([8,9]);ctx.beginPath();ctx.moveTo(365,200);ctx.lineTo(620,200);ctx.moveTo(770,250);ctx.lineTo(770,410);ctx.moveTo(620,460);ctx.lineTo(365,460);ctx.moveTo(210,410);ctx.lineTo(210,250);ctx.stroke();ctx.setLineDash([]);
    nodes.forEach(n=>{rounded(ctx,n.x,n.y,n.w,n.h,8,'#24351b');ctx.strokeStyle='#658447';ctx.strokeRect(n.x,n.y,n.w,n.h);ctx.fillStyle='#709155';ctx.font='15px monospace';ctx.fillText(n.num,n.x+22,n.y+28);ctx.fillStyle='#c7e5a7';ctx.font='29px monospace';ctx.fillText(n.text,n.x+22,n.y+72);});
    ctx.fillStyle='#607c4a';ctx.font='16px monospace';ctx.fillText('small pieces / connected thoughtfully',64,590);
  }
  const result = new THREE.CanvasTexture(image); result.colorSpace=THREE.SRGBColorSpace;result.anisotropy=4;return result;
}

if (host && canvas) {
  let renderer;
  try {renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});} catch { /* The CSS interface remains available. */ }
  if (renderer) {
    renderer.setPixelRatio(Math.min(devicePixelRatio, compact.matches ? 1.25 : 1.75));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(35,1,.1,40);camera.position.set(0,0,9.3);
    scene.add(new THREE.HemisphereLight(0xe6efd8,0x172410,2.5));
    const light=new THREE.DirectionalLight(0xd8ffaf,4);light.position.set(-3,6,4);scene.add(light);
    const root=new THREE.Group();scene.add(root);
    const layers=[];
    const boardGeometry=new THREE.BoxGeometry(4,2.54,.035);
    const edgeGeometry=new THREE.EdgesGeometry(boardGeometry);
    const sideMaterial=new THREE.MeshStandardMaterial({color:0x899f70,roughness:.7,metalness:.25});
    const backMaterial=new THREE.MeshBasicMaterial({color:0x1c2b13});
    ['system','logic','interface'].forEach((kind,index)=>{
      const layer=new THREE.Group();
      const face=new THREE.MeshBasicMaterial({map:texture(kind),toneMapped:false});
      const board=new THREE.Mesh(boardGeometry,[sideMaterial,sideMaterial,sideMaterial,sideMaterial,face,backMaterial]);
      layer.add(board);
      const edges=new THREE.LineSegments(edgeGeometry,new THREE.LineBasicMaterial({color:index===2?0xc4e99b:0x648447,transparent:true,opacity:.7}));layer.add(edges);
      root.add(layer);layers.push(layer);
    });
    const grid=new THREE.GridHelper(11,22,0x29421c,0x1d2e15);grid.rotation.x=Math.PI/2;grid.position.z=-2.2;grid.material.transparent=true;grid.material.opacity=.25;scene.add(grid);
    const frame=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5.4,4.9,2.1)),new THREE.LineBasicMaterial({color:0x547738,transparent:true,opacity:.22}));root.add(frame);
    const pointGeometry=new THREE.SphereGeometry(.035,12,8);const pointMaterial=new THREE.MeshBasicMaterial({color:0xb3dd7d});
    const points=[];
    for(let i=0;i<8;i++){const p=new THREE.Mesh(pointGeometry,pointMaterial);p.position.set((i%2?1:-1)*2.7,(Math.floor(i/2)%2?1:-1)*2.45,(Math.floor(i/4)?1:-1)*1.05);root.add(p);points.push(p);}
    let paused=reduced.matches,open=false,spread=0,time=0,previous=0,frameId=0,visible=true,baseDistance=9.3;
    let pointer={x:0,y:0};
    const surface=host.querySelector('.scene-surface');
    const toggle=document.getElementById('scene-toggle');
    const explode=document.getElementById('scene-explode');
    const render=()=>renderer.render(scene,camera);
    function positionLayers(instant=false) {
      const target=open?1:0;spread=instant?target:spread+(target-spread)*.065;
      layers.forEach((layer,i)=>{
        const n=i-1;
        layer.position.set(n*(.16+spread*.05),n*(.25+spread*.97),n*(.23+spread*.46));
        layer.rotation.z=n*spread*.018;
      });
      frame.scale.y=1+spread*.13;
      camera.position.z=baseDistance+spread*1.7;
    }
    function animate(now) {
      frameId=0;
      const delta=previous?Math.min((now-previous)/1000,.05):0;previous=now;
      if(!paused)time+=delta;
      positionLayers(reduced.matches||paused);
      root.rotation.x+=(-.3-pointer.y*.13-root.rotation.x)*.045;
      root.rotation.y+=(-.52+pointer.x*.22-root.rotation.y)*.045;
      root.rotation.z=.12+(reduced.matches?0:Math.sin(time*.3)*.025);
      root.position.y=reduced.matches?0:Math.sin(time*.6)*.07;
      render();
      if(!paused&&visible&&!document.hidden)frameId=requestAnimationFrame(animate);
    }
    function stop(){cancelAnimationFrame(frameId);frameId=0;previous=0;}
    function start(){if(!frameId&&!paused&&visible&&!document.hidden){previous=0;frameId=requestAnimationFrame(animate);}}
    function updateToggle(){const label=paused?toggle.dataset.resume:toggle.dataset.pause;toggle.setAttribute('aria-label',label);toggle.setAttribute('title',label);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'▷':'Ⅱ';}
    new ResizeObserver(()=>{
      const bounds=surface.getBoundingClientRect();
      camera.aspect=bounds.width/Math.max(bounds.height,1);baseDistance=bounds.width<400?9.6:9.3;camera.position.z=baseDistance+spread*1.7;camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio,compact.matches?1.25:1.75));renderer.setSize(bounds.width,bounds.height,false);render();
    }).observe(surface);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{rootMargin:'80px'}).observe(host);
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
    surface.addEventListener('pointermove',event=>{if(paused||reduced.matches)return;const rect=surface.getBoundingClientRect();pointer={x:(event.clientX-rect.left)/rect.width*2-1,y:(event.clientY-rect.top)/rect.height*2-1};},{passive:true});
    surface.addEventListener('pointerleave',()=>{pointer={x:0,y:0};});
    explode.addEventListener('click',()=>{open=!open;explode.setAttribute('aria-pressed',String(open));explode.innerHTML=(open?explode.dataset.close:explode.dataset.open)+' <span aria-hidden="true">↗</span>';if(paused||reduced.matches){positionLayers(true);render();}});
    toggle.addEventListener('click',()=>{paused=!paused;updateToggle();if(paused){stop();positionLayers(true);render();}else start();});
    reduced.addEventListener('change',()=>{paused=reduced.matches;pointer={x:0,y:0};updateToggle();if(paused){stop();positionLayers(true);render();}else start();});
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();stop();host.classList.remove('scene-ready');host.querySelector('.scene-controls').hidden=true;});
    canvas.addEventListener('webglcontextrestored',()=>{render();host.classList.add('scene-ready');host.querySelector('.scene-controls').hidden=false;start();});
    root.rotation.set(-.3,-.52,.12);positionLayers(true);animate(0);updateToggle();
    host.classList.add('scene-ready');host.querySelector('.scene-controls').hidden=false;
  }
}
