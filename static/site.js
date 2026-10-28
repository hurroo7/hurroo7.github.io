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
  let queued=0,point=null;
  function resetTilt(){instrument.style.removeProperty('--tilt-x');instrument.style.removeProperty('--tilt-y')}
  instrument.addEventListener('pointermove',event=>{
    if(reduced.matches||!fine.matches||event.pointerType==='touch')return;
    point={x:event.clientX,y:event.clientY};
    if(queued)return;
    queued=requestAnimationFrame(()=>{queued=0;const box=instrument.getBoundingClientRect();instrument.style.setProperty('--tilt-x',`${((point.x-box.left)/box.width-.5)*8}deg`);instrument.style.setProperty('--tilt-y',`${-((point.y-box.top)/box.height-.5)*8}deg`)})
  },{passive:true});
  instrument.addEventListener('pointerleave',resetTilt);
  reduced.addEventListener('change',resetTilt);
  document.querySelectorAll('.atlas-node').forEach(link=>{
    const activate=()=>{instrument.dataset.active=link.dataset.chapter};
    const clear=()=>{delete instrument.dataset.active};
    link.addEventListener('pointerenter',activate);link.addEventListener('focus',activate);
    link.addEventListener('pointerleave',clear);link.addEventListener('blur',clear);
  });
  core?.addEventListener('click',()=>{const on=instrument.classList.toggle('is-shifted');core.setAttribute('aria-pressed',String(on))});
}
