const root=document.documentElement;
const button=document.querySelector('.theme');
let dark=false;
try{dark=localStorage.getItem('hurroo-theme')==='dark'}catch{}
function renderTheme(){root.classList.toggle('dark',dark);if(button){button.textContent=dark?'◑':'◐';button.setAttribute('aria-label',dark?'切换浅色模式':'切换深色模式');button.setAttribute('aria-pressed',String(dark))}}
renderTheme();
button?.addEventListener('click',()=>{root.classList.add('theme-ready');dark=!dark;renderTheme();try{localStorage.setItem('hurroo-theme',dark?'dark':'light')}catch{}});
const instrument=document.querySelector('.atlas-instrument');
if(instrument){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const core=document.querySelector('.atlas-core');
  let queued=0,point=null,drag=null,orbitAngle=0,suppressClick=false;
  const chart=instrument.querySelector('.celestial-chart');
  const ray=document.createElementNS('http://www.w3.org/2000/svg','line');
  ray.classList.add('chapter-ray');ray.setAttribute('x1','400');ray.setAttribute('y1','400');
  chart.append(ray);
  function turn(amount){orbitAngle+=amount;instrument.style.setProperty('--orbit-angle',`${orbitAngle}deg`)}
  function pulse(){
    if(reduced.matches)return;
    core.classList.remove('is-pulsing');
    void core.offsetWidth;
    core.classList.add('is-pulsing');
  }
  core.addEventListener('animationend',()=>core.classList.remove('is-pulsing'));
  core.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    suppressClick=false;drag={id:event.pointerId,x:event.clientX,y:event.clientY,angle:orbitAngle,moved:false};
    core.setPointerCapture(event.pointerId);instrument.classList.add('is-dragging');resetTilt();
  });
  core.addEventListener('pointermove',event=>{
    if(!drag||drag.id!==event.pointerId)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(Math.hypot(dx,dy)>5)drag.moved=true;
    if(drag.moved){orbitAngle=drag.angle+(dx-dy)*.65;instrument.style.setProperty('--orbit-angle',`${orbitAngle}deg`)}
  });
  function endDrag(event){
    if(!drag||drag.id!==event.pointerId)return;
    suppressClick=event.type==='pointerup'&&drag.moved;drag=null;instrument.classList.remove('is-dragging');
    if(core.hasPointerCapture(event.pointerId))core.releasePointerCapture(event.pointerId);
  }
  core.addEventListener('pointerup',endDrag);core.addEventListener('pointercancel',endDrag);
  core.addEventListener('lostpointercapture',endDrag);
  core.addEventListener('keydown',event=>{
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key)){
      event.preventDefault();
      if(event.key==='Home'){orbitAngle=0;instrument.style.setProperty('--orbit-angle','0deg')}
      else turn(['ArrowLeft','ArrowDown'].includes(event.key)?-15:15);
    }
  });
  function resetTilt(){instrument.style.removeProperty('--tilt-x');instrument.style.removeProperty('--tilt-y')}
  instrument.addEventListener('pointermove',event=>{
    if(drag||reduced.matches||!fine.matches||event.pointerType==='touch')return;
    point={x:event.clientX,y:event.clientY};
    if(queued)return;
    queued=requestAnimationFrame(()=>{queued=0;const box=instrument.getBoundingClientRect();instrument.style.setProperty('--tilt-x',`${((point.x-box.left)/box.width-.5)*8}deg`);instrument.style.setProperty('--tilt-y',`${-((point.y-box.top)/box.height-.5)*8}deg`)})
  },{passive:true});
  instrument.addEventListener('pointerleave',resetTilt);
  reduced.addEventListener('change',resetTilt);
  document.querySelectorAll('.atlas-node').forEach(link=>{
    const activate=()=>{
      instrument.dataset.active=link.dataset.chapter;
      const marker=link.querySelector('.node-marker').getBoundingClientRect();
      const box=instrument.getBoundingClientRect();
      ray.setAttribute('x2',String((marker.x+marker.width/2-box.x)/box.width*800));
      ray.setAttribute('y2',String((marker.y+marker.height/2-box.y)/box.height*800));
    };
    const clear=()=>{delete instrument.dataset.active};
    link.addEventListener('pointerenter',activate);link.addEventListener('focus',activate);
    link.addEventListener('pointerleave',clear);link.addEventListener('blur',clear);
  });
  core?.addEventListener('click',()=>{
    if(suppressClick){suppressClick=false;return}
    const on=instrument.classList.toggle('is-shifted');core.setAttribute('aria-pressed',String(on));turn(36);pulse();
  });
}
