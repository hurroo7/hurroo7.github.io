const button=document.querySelector('.theme');
let dark=false;
try{dark=localStorage.getItem('hurroo-theme')==='dark'}catch{}
function renderTheme(){document.documentElement.classList.toggle('dark',dark);button.textContent=dark?'☾':'☼';button.setAttribute('aria-label',dark?'切换浅色模式':'切换深色模式');button.setAttribute('aria-pressed',String(dark))}
renderTheme();
button.addEventListener('click',()=>{dark=!dark;renderTheme();try{localStorage.setItem('hurroo-theme',dark?'dark':'light')}catch{}});
