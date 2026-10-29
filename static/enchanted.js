// Original native effects inspired by React Bits; no React runtime required.
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 const resets=[];
 document.querySelectorAll('.atlas-node').forEach(link=>{
  const label=link.querySelector('.node-en');if(!label)return;
  const original=label.textContent;let timer=0;
  label.setAttribute('aria-hidden','true');link.setAttribute('aria-label',`${link.querySelector('.node-name').textContent} · ${original}`);
  function reset(){clearInterval(timer);timer=0;label.textContent=original}
  function decode(){reset();if(reduced.matches)return;let step=0;const glyphs='ᚠᚢᚦᚨᚱᚲᚷᚹᛃᛈᛉᛟ';
   timer=setInterval(()=>{step++;label.textContent=[...original].map((char,index)=>index<Math.floor(step/2)?char:glyphs[Math.floor(Math.random()*glyphs.length)]).join('');if(step>=original.length*2)reset()},42);
  }
  link.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')decode()});link.addEventListener('focus',decode);link.addEventListener('pointerleave',reset);link.addEventListener('blur',reset);resets.push(reset);
 });
 document.querySelectorAll('.atlas-trip .trip-ticket').forEach(ticket=>{
  const light=document.createElement('span');light.className='ticket-foil';light.setAttribute('aria-hidden','true');ticket.append(light);
  let frame=0,point=null;
  function reset(){cancelAnimationFrame(frame);frame=0;ticket.style.removeProperty('--foil-x');ticket.style.removeProperty('--foil-y');ticket.style.removeProperty('--foil-rx');ticket.style.removeProperty('--foil-ry');ticket.classList.remove('has-foil')}
  ticket.addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches||e.pointerType==='touch')return;point={x:e.clientX,y:e.clientY};if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const r=ticket.getBoundingClientRect(),x=Math.max(0,Math.min(1,(point.x-r.left)/r.width)),y=Math.max(0,Math.min(1,(point.y-r.top)/r.height));ticket.style.setProperty('--foil-x',`${x*100}%`);ticket.style.setProperty('--foil-y',`${y*100}%`);ticket.style.setProperty('--foil-rx',`${-(y-.5)*12}deg`);ticket.style.setProperty('--foil-ry',`${(x-.5)*14}deg`);ticket.classList.add('has-foil')})},{passive:true});
  ticket.addEventListener('pointerleave',reset);ticket.addEventListener('blur',reset);resets.push(reset);
 });
 document.querySelectorAll('.observatory-art').forEach(svg=>{
  const ns='http://www.w3.org/2000/svg',defs=svg.querySelector('defs');if(!defs)return;
  const gradient=document.createElementNS(ns,'linearGradient');gradient.id='enchanted-window-light';gradient.setAttribute('x1','0');gradient.setAttribute('y1','0');gradient.setAttribute('x2','1');gradient.setAttribute('y2','1');
  [['0','#c5ae79','0'],['.4','#c5ae79','.03'],['.53','#b8c3ad','.28'],['.65','#d2b68b','.06'],['1','#d2b68b','0']].forEach(([offset,color,opacity])=>{const stop=document.createElementNS(ns,'stop');stop.setAttribute('offset',offset);stop.setAttribute('stop-color',color);stop.setAttribute('stop-opacity',opacity);gradient.append(stop)});defs.append(gradient);
  const group=document.createElementNS(ns,'g');group.setAttribute('clip-path','url(#window-arch)');group.setAttribute('aria-hidden','true');group.setAttribute('pointer-events','none');
  const veil=document.createElementNS(ns,'rect');veil.setAttribute('x','-150');veil.setAttribute('y','20');veil.setAttribute('width','600');veil.setAttribute('height','410');veil.setAttribute('fill','url(#enchanted-window-light)');veil.classList.add('enchanted-window-veil');group.append(veil);
  svg.append(group);
 });
 function resetAll(){resets.forEach(reset=>reset())}
 reduced.addEventListener('change',()=>{if(reduced.matches)resetAll()});fine.addEventListener('change',()=>{if(!fine.matches)resetAll()});document.addEventListener('visibilitychange',()=>{if(document.hidden)resetAll()});
})();
