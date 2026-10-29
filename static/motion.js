// Original, dependency-free interactions inspired by React Bits' effect categories.
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const resets=[];
 document.querySelectorAll('.atlas-node').forEach(link=>{
  const copy=link.querySelector('.node-copy'),icon=link.querySelector('.node-marker');
  let frame=0,point=null;
  function reset(){cancelAnimationFrame(frame);frame=0;[copy,icon].forEach(e=>{if(e)e.style.translate='0px 0px'})}
  [copy,icon].forEach(e=>{if(e)e.style.transition='translate 450ms cubic-bezier(.2,.8,.2,1)'});
  link.addEventListener('pointermove',event=>{
   if(reduced.matches||!fine.matches||event.pointerType==='touch')return;
   point={x:event.clientX,y:event.clientY};if(frame)return;
   frame=requestAnimationFrame(()=>{frame=0;const r=link.getBoundingClientRect();const dx=Math.max(-1,Math.min(1,(point.x-r.left-r.width/2)/(r.width/2))),dy=Math.max(-1,Math.min(1,(point.y-r.top-r.height/2)/(r.height/2)));if(copy)copy.style.translate=`${dx*16}px ${dy*12}px`;if(icon)icon.style.translate=`${dx*25}px ${dy*20}px`});
  },{passive:true});
  link.addEventListener('pointerleave',reset);link.addEventListener('blur',reset);resets.push(reset);
 });
 document.querySelectorAll('.academy-instrument').forEach(button=>{
  const art=button.querySelector('svg');if(!art)return;
  let frame=0,point=null;
  art.style.transition='transform 500ms cubic-bezier(.2,.8,.2,1), filter 500ms';
  function reset(){cancelAnimationFrame(frame);frame=0;art.style.transform='';art.style.filter=''}
  button.addEventListener('pointermove',event=>{
   if(reduced.matches||!fine.matches||event.pointerType==='touch')return;
   point={x:event.clientX,y:event.clientY};if(frame)return;
   frame=requestAnimationFrame(()=>{frame=0;const r=button.getBoundingClientRect(),x=(point.x-r.left)/r.width-.5,y=(point.y-r.top)/r.height-.5;art.style.transform=`perspective(800px) rotateX(${-y*16}deg) rotateY(${x*20}deg) translateY(-8px)`;art.style.filter='drop-shadow(12px 22px 12px #14251e35)'});
  },{passive:true});
  button.addEventListener('pointerleave',reset);button.addEventListener('blur',reset);resets.push(reset);
 });
 function stop(){resets.forEach(reset=>reset())}
 reduced.addEventListener('change',()=>{if(reduced.matches)stop()});fine.addEventListener('change',()=>{if(!fine.matches)resets.forEach(reset=>reset())});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
})();
