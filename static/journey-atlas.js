(() => {
 const atlas=document.querySelector('.journey-atlas');if(!atlas)return;
 const svg=atlas.querySelector('.journey-chart-svg'),year=document.querySelector('.atlas-year');
 const trips=[...atlas.querySelectorAll('.atlas-trip')],markers=[...atlas.querySelectorAll('.atlas-destination')],tabs=[...atlas.querySelectorAll('.atlas-trip-tabs button')];
 const panel=atlas.querySelector('.atlas-trip-panel'),chart=atlas.querySelector('.atlas-chart');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let hoverTimer=0;
 let selected='',region='china',box=[690,85,210,150],drag=null,ignoreClickUntil=0;
 function updateBox(){svg.setAttribute('viewBox',box.join(' '));placePopup()}
 function setRegion(value){region=value;box=value==='world'?[0,0,1000,500]:[690,85,210,150];atlas.classList.toggle('is-world',value==='world');atlas.querySelectorAll('[data-atlas-region]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.atlasRegion===value)));updateBox()}
 function placePopup(){
  if(panel.hidden||!selected)return;
  const marker=markers.find(m=>m.dataset.trip===selected);if(!marker)return;
  const r=marker.querySelector('.destination-aura').getBoundingClientRect(),c=chart.getBoundingClientRect();
  const x=r.left+r.width/2-c.left,y=r.top+r.height/2-c.top,w=panel.offsetWidth,h=panel.offsetHeight;
  let left=x+25;if(left+w>c.width-18)left=x-w-25;
  left=Math.max(18,Math.min(c.width-w-18,left));
  panel.style.left=`${left}px`;panel.style.top=`${Math.max(65,Math.min(c.height-h-28,y-70))}px`;
 }
 function closePopup(){panel.hidden=true;markers.forEach(m=>{m.classList.remove('is-selected');m.setAttribute('aria-expanded','false')})}
 function choose(id,animate=true){
  selected=id;trips.forEach(t=>t.hidden=t.dataset.trip!==id);
  markers.forEach(m=>{m.classList.toggle('is-selected',m.dataset.trip===id);m.setAttribute('aria-expanded',String(m.dataset.trip===id))});
  panel.hidden=!id;placePopup();
  atlas.querySelector('.atlas-selection-status').textContent=id?`已选择${trips.find(t=>t.dataset.trip===id)?.querySelector('h2').textContent||''}旅行票根`:'';
  if(id&&animate&&!reduced.matches){panel.getAnimations().forEach(a=>a.cancel());panel.animate([{opacity:0,transform:'translateY(8px) rotate(-2deg)'},{opacity:1,transform:'translateY(0) rotate(0)'}],{duration:350,easing:'cubic-bezier(.2,.7,.2,1)'});}
 }
 function filter(){
  const permitted=trips.filter(t=>year.value==='all'||t.dataset.year===year.value);
  markers.forEach(m=>{m.style.display=year.value==='all'||m.dataset.year===year.value?'':'none'});
  document.querySelectorAll('.journal-year').forEach(g=>g.hidden=year.value!=='all'&&g.dataset.year!==year.value);
  if(selected&&!permitted.some(t=>t.dataset.trip===selected)){selected='';closePopup()}
 }
 markers.forEach(m=>{m.setAttribute('aria-expanded','false');m.addEventListener('pointerenter',e=>{clearTimeout(hoverTimer);if(e.pointerType==='mouse'&&matchMedia('(hover: hover) and (min-width: 701px)').matches)hoverTimer=setTimeout(()=>choose(m.dataset.trip),220)});m.addEventListener('pointerleave',()=>clearTimeout(hoverTimer));});
 panel.querySelector('.atlas-popup-close').addEventListener('click',()=>{const marker=markers.find(m=>m.dataset.trip===selected);closePopup();marker?.focus({preventScroll:true})});
 chart.addEventListener('keydown',e=>{if(e.key==='Escape'){closePopup();markers.find(m=>m.dataset.trip===selected)?.focus({preventScroll:true})}});
 window.addEventListener('resize',placePopup);
 markers.forEach(m=>m.addEventListener('click',event=>{event.preventDefault();clearTimeout(hoverTimer);if(Date.now()<ignoreClickUntil)return;if(region==='world')setRegion('china');choose(m.dataset.trip)}));
 tabs.forEach(t=>t.addEventListener('click',()=>{if(region==='world')setRegion('china');choose(t.dataset.trip)}));
 year.addEventListener('change',filter);
 atlas.querySelectorAll('[data-atlas-region]').forEach(b=>b.addEventListener('click',()=>setRegion(b.dataset.atlasRegion)));
 atlas.querySelectorAll('[data-atlas-zoom]').forEach(b=>b.addEventListener('click',()=>{const factor=b.dataset.atlasZoom==='in'?.8:1.25;const w=Math.min(1000,Math.max(70,box[2]*factor)),h=w*box[3]/box[2];box=[box[0]+(box[2]-w)/2,box[1]+(box[3]-h)/2,w,h];updateBox()}));
 atlas.querySelector('[data-atlas-reset]').addEventListener('click',()=>setRegion(region));
 svg.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.atlas-destination'))return;closePopup();drag={id:e.pointerId,x:e.clientX,y:e.clientY,box:[...box],moved:false};svg.setPointerCapture(e.pointerId)});
 svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)<7&&!drag.moved)return;drag.moved=true;svg.classList.add('is-dragging');const rect=svg.getBoundingClientRect(),scale=Math.min(rect.width/drag.box[2],rect.height/drag.box[3]);box=[Math.max(-100,Math.min(1000,drag.box[0]-dx/scale)),Math.max(-100,Math.min(500,drag.box[1]-dy/scale)),drag.box[2],drag.box[3]];updateBox()});
 function end(){if(drag?.moved)ignoreClickUntil=Date.now()+300;drag=null;svg.classList.remove('is-dragging')}
 svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);svg.addEventListener('lostpointercapture',end);
 atlas.querySelector('.atlas-chart-controls').hidden=false;filter();
})();
