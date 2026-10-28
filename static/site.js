const button=document.querySelector('.theme');
let dark=false;
try{dark=localStorage.getItem('hurroo-theme')==='dark'}catch{}
function renderTheme(){document.documentElement.classList.toggle('dark',dark);button.textContent=dark?'☾':'☼';button.setAttribute('aria-label',document.querySelector('.grimoire')?(dark?'切换烛光模式':'切换星夜模式'):(dark?'切换浅色模式':'切换深色模式'));button.setAttribute('aria-pressed',String(dark))}
renderTheme();
button.addEventListener('click',()=>{document.documentElement.classList.add('theme-ready');dark=!dark;renderTheme();try{localStorage.setItem('hurroo-theme',dark?'dark':'light')}catch{}});

// The enchantment is decorative; every chapter remains a normal link.
const grimoire=document.querySelector('.grimoire');
if(grimoire){
  document.documentElement.classList.add('magic-home');
  const seal=document.querySelector('.spell-seal');
  const status=document.querySelector('.spell-status');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const canvas=document.createElement('canvas');
  canvas.className='magic-dust';canvas.setAttribute('aria-hidden','true');
  document.body.append(canvas);
  const ctx=canvas.getContext('2d');
  let w=innerWidth,h=innerHeight,particles=[],frame=0,last=0,lit=false,started=0;
  function resize(){w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx?.setTransform(dpr,0,0,dpr,0,0)}
  resize();addEventListener('resize',resize,{passive:true});
  function spark(x,y,burst=false){
    if(reduced.matches||!ctx)return;
    const angle=Math.random()*Math.PI*2,speed=burst?1+Math.random()*4:.2+Math.random()*.7;
    particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-(burst?1:.4),age:0,life:burst?70+Math.random()*45:35+Math.random()*30,size:burst?1+Math.random()*2:.5+Math.random()*1.2});
    if(particles.length>180)particles.splice(0,particles.length-180);
  }
  function draw(time){
    frame=0;if(reduced.matches||document.hidden||!ctx)return;
    const step=Math.min((time-last)/16.67||1,2);last=time;
    ctx.clearRect(0,0,w,h);
    if(time-started>260){spark(Math.random()*w,h*Math.random());started=time}
    const color=document.documentElement.classList.contains('dark')?'180,205,255':'235,193,112';
    for(const p of particles){p.age+=step;p.x+=p.vx*step;p.y+=p.vy*step;
      const alpha=Math.sin(Math.PI*p.age/p.life)*.8;
      ctx.fillStyle=`rgba(${color},${Math.max(0,alpha)})`;ctx.shadowColor=`rgba(${color},.8)`;ctx.shadowBlur=lit?12:6;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
    }
    particles=particles.filter(p=>p.age<p.life);frame=requestAnimationFrame(draw);
  }
  function start(){if(!frame&&!reduced.matches&&!document.hidden){last=performance.now();frame=requestAnimationFrame(draw)}}
  function stop(){cancelAnimationFrame(frame);frame=0;particles=[];ctx?.clearRect(0,0,w,h)}
  let lastPointer=0;
  addEventListener('pointermove',e=>{if(e.pointerType==='touch'||performance.now()-lastPointer<24)return;lastPointer=performance.now();spark(e.clientX,e.clientY);spark(e.clientX,e.clientY)},{passive:true});
  seal.addEventListener('click',()=>{
    lit=!lit;document.documentElement.classList.toggle('spell-lit',lit);seal.setAttribute('aria-pressed',String(lit));
    seal.setAttribute('aria-label',lit?'收起荧光魔法':'施放荧光魔法');
    status.textContent=lit?'Lumos · 荧光闪烁，故事已经苏醒。':'Nox · 星光归于书页，故事仍在继续。';
    const box=seal.getBoundingClientRect();for(let i=0;i<90;i++)spark(box.x+box.width/2,box.y+box.height/2,true);
    start();
  });
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  reduced.addEventListener('change',()=>reduced.matches?stop():start());
  start();
}
