const travelMap=document.querySelector('.travel-map-dialog');
if(travelMap&&typeof travelMap.showModal==='function'){
 const openers=document.querySelectorAll('[data-map-open]');
 openers.forEach(button=>{button.hidden=false;button.addEventListener('click',()=>{travelMap.showModal();document.documentElement.classList.add('travel-map-is-open')})});
 travelMap.querySelector('.map-close').addEventListener('click',()=>travelMap.close());
 travelMap.addEventListener('close',()=>document.documentElement.classList.remove('travel-map-is-open'));
 travelMap.addEventListener('click',event=>{if(event.target===travelMap){const b=travelMap.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)travelMap.close()}});
 const svg=travelMap.querySelector('.travel-map-svg');
 travelMap.querySelectorAll('[data-map-view]').forEach(button=>button.addEventListener('click',()=>{
  const zoom=button.dataset.mapView!=='world';svg.setAttribute('viewBox',zoom?'710 75 230 210':'0 0 1000 500');
  travelMap.classList.toggle('map-zoomed',zoom);
  travelMap.querySelectorAll('[data-map-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 }));
}

// The paper responds to a fine pointer; links retain normal navigation.
const ticketMotion=matchMedia('(prefers-reduced-motion: reduce)');
const ticketPointer=matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.trip-ticket').forEach(ticket=>{
 let frame=0,latest=null;
 function reset(){if(frame)cancelAnimationFrame(frame);frame=0;ticket.style.removeProperty('--ticket-x');ticket.style.removeProperty('--ticket-y')}
 ticket.addEventListener('pointermove',event=>{
  if(ticketMotion.matches||!ticketPointer.matches||event.pointerType==='touch')return;
  latest={x:event.clientX,y:event.clientY};
  if(frame)return;
  frame=requestAnimationFrame(()=>{frame=0;const box=ticket.getBoundingClientRect();ticket.style.setProperty('--ticket-x',`${((latest.x-box.left)/box.width-.5)*3}deg`);ticket.style.setProperty('--ticket-y',`${-((latest.y-box.top)/box.height-.5)*3}deg`)});
 },{passive:true});
 ticket.addEventListener('pointerleave',reset);ticket.addEventListener('blur',reset);
 ticketMotion.addEventListener('change',reset);
});
