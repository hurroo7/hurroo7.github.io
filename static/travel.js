const travelMap=document.querySelector('.travel-map-dialog');
if(travelMap&&typeof travelMap.showModal==='function'){
 const openers=document.querySelectorAll('[data-map-open]');
 openers.forEach(button=>{button.hidden=false;button.addEventListener('click',()=>{travelMap.showModal();document.documentElement.classList.add('travel-map-is-open')})});
 travelMap.querySelector('.map-close').addEventListener('click',()=>travelMap.close());
 travelMap.addEventListener('close',()=>document.documentElement.classList.remove('travel-map-is-open'));
 travelMap.addEventListener('click',event=>{if(event.target===travelMap){const b=travelMap.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)travelMap.close()}});
 const svg=travelMap.querySelector('.travel-map-svg');
 travelMap.querySelectorAll('[data-map-view]').forEach(button=>button.addEventListener('click',()=>{
  const zoom=button.dataset.mapView==='nanjing';svg.setAttribute('viewBox',zoom?'710 75 230 210':'0 0 1000 500');
  travelMap.classList.toggle('map-zoomed',zoom);
  travelMap.querySelectorAll('[data-map-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 }));
}
