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
  const sparkLayer=document.createElement('div');
  sparkLayer.className='starburst-layer';sparkLayer.setAttribute('aria-hidden','true');
  document.body.append(sparkLayer);
  function turn(amount){orbitAngle+=amount;instrument.style.setProperty('--orbit-angle',`${orbitAngle}deg`)}
  function emitLightPoints(){
    if(reduced.matches)return;
    while(sparkLayer.childElementCount>120)sparkLayer.firstElementChild.remove();
    const box=core.getBoundingClientRect(),x=box.x+box.width/2,y=box.y+box.height/2;
    const radius=instrument.getBoundingClientRect().width*.52;
    for(let i=0;i<64;i++){
      const point=document.createElement('span');
      point.className='starburst-point';
      const angle=Math.random()*Math.PI*2,distance=radius*(.55+Math.random()*.65);
      const dx=Math.cos(angle)*distance,dy=Math.sin(angle)*distance;
      const size=2+Math.random()*2;
      Object.assign(point.style,{left:`${x}px`,top:`${y}px`,width:`${size}px`,height:`${size}px`});
      sparkLayer.append(point);
      const animation=point.animate([
        {transform:'translate(-50%,-50%) scale(.3)',opacity:0},
        {transform:`translate(calc(-50% + ${dx*.12}px),calc(-50% + ${dy*.12}px)) scale(1.2)`,opacity:1,offset:.12},
        {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.5)`,opacity:0}
      ],{duration:1800+Math.random()*1200,easing:'cubic-bezier(.12,.6,.25,1)',fill:'forwards'});
      animation.onfinish=()=>point.remove();
      animation.oncancel=()=>point.remove();
    }
  }
  function clearSparks(){sparkLayer.getAnimations({subtree:true}).forEach(animation=>animation.cancel());sparkLayer.replaceChildren()}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearSparks()});
  reduced.addEventListener('change',()=>{if(reduced.matches)clearSparks()});
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
  core?.addEventListener('click',()=>{
    if(suppressClick){suppressClick=false;return}
    const on=instrument.classList.toggle('is-shifted');core.setAttribute('aria-pressed',String(on));turn(36);emitLightPoints();
  });
}
