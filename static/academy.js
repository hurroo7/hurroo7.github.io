// Small, finite bursts confined to deliberate instrument interactions.
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const active=new Set();
 function clear(){active.forEach(el=>{el.getAnimations().forEach(a=>a.cancel());el.remove()});active.clear()}
 document.querySelectorAll('.academy-instrument').forEach(button=>{
  button.addEventListener('click',()=>{
   if(reduced.matches||button.hasAttribute('data-map-open'))return;
   const box=button.getBoundingClientRect();
   for(let i=0;i<24&&active.size<72;i++){
    const dot=document.createElement('i'),angle=Math.random()*Math.PI*2,distance=45+Math.random()*110;
    dot.className='academy-spark';dot.setAttribute('aria-hidden','true');
    dot.style.left=`${box.left+box.width*.57}px`;dot.style.top=`${box.top+box.height*.32}px`;
    document.body.append(dot);active.add(dot);
    const animation=dot.animate([{opacity:0,transform:'scale(.3)'},{opacity:1,offset:.15},{opacity:0,transform:`translate(${Math.cos(angle)*distance}px,${Math.sin(angle)*distance}px) scale(.2)`}],{duration:1200+Math.random()*900,easing:'cubic-bezier(.16,.6,.3,1)'});
    const remove=()=>{dot.remove();active.delete(dot)};animation.onfinish=remove;animation.oncancel=remove;
   }
  });
 });
 reduced.addEventListener('change',()=>{if(reduced.matches)clear()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()});
})();
