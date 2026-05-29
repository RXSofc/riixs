const sleep = ms => new Promise(r => setTimeout(r, ms));
const qs    = s  => document.querySelector(s);
const qsa   = s  => document.querySelectorAll(s);
const rnd   = (a,b) => a + Math.random() * (b-a);

(function(){
  const cv=qs('#static-canvas'),cx=cv.getContext('2d');let frame=0;
  function resize(){cv.width=window.innerWidth;cv.height=window.innerHeight}
  resize();window.addEventListener('resize',resize,{passive:true});
  function drawNoise(){
    const w=cv.width,h=cv.height,id=cx.createImageData(w,h),d=id.data;
    for(let i=0;i<d.length;i+=4){const v=Math.random()>.5?255:0;d[i]=d[i+1]=d[i+2]=v;d[i+3]=Math.random()*55}
    cx.putImageData(id,0,0)
  }
  (function loop(){if(++frame%3===0)drawNoise();requestAnimationFrame(loop)})();
})();

(function(){
  const cur=qs('#cursor');let mx=-100,my=-100;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  (function tick(){cur.style.left=mx+'px';cur.style.top=my+'px';requestAnimationFrame(tick)})();
  document.addEventListener('mouseleave',()=>cur.style.opacity='0');
  document.addEventListener('mouseenter',()=>cur.style.opacity='1');
})();

(function(){
  const el=qs('#hud-time');
  function tick(){const n=new Date();el.textContent=[n.getHours(),n.getMinutes(),n.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':')}
  tick();setInterval(tick,1000);
})();

(function(){
  const el=qs('#hud-bars');const F='\u2588',E='\u2591';
  function upd(){const n=3+Math.floor(Math.random()*5);el.textContent=F.repeat(n)+E.repeat(8-n)}
  upd();setInterval(upd,rnd(700,1100));
})();

/* ───  EVILVOID TEAM────────────────── */
(async function(){
  const LINES=[
    {id:'bl0',text:'EVILVOID BROADCAST SYSTEM v2.4.1',speed:28},
    {id:'bl1',text:'TUNGGUAN,SEARCHING FOR SIGNAL........',speed:42},
    {id:'bl2',text:'BEUNANG SIAH........',speed:35,pause:9000},
    {id:'bl3',text:'LOCK: 87.3 MHz  //  SNR: 14.2 dB',speed:28},
    {id:'bl4',text:'DECRYPTING IDENT PACKET...',speed:30,pause:400},
    {id:'bl5',text:'\u258c SIGNAL LOCKED. TRANSMISSION BEGINS.',speed:22},
  ];

  async function typeLine(id,text,speed,lead=0){
    await sleep(lead);
    const el=qs('#'+id);
    for(const ch of text){
      el.textContent+=ch;
      await sleep(speed+Math.random()*20);
    }
  }

  let offset=0;
  for(const{id,text,speed,pause=0}of LINES){
    typeLine(id,text,speed,offset+pause);
    offset+=text.length*(speed+10)+pause+80;
  }

  await sleep(offset+500);

  qs('#boot').classList.add('boot-exit');

  await sleep(900);

  qs('#crt').classList.add('crt-on');

  await sleep(2000);

  qs('#hud').classList.add('hud-visible');
  await sleep(150);  
  qs('nav').classList.add('nav-visible');

  await sleep(1500);
  qs('#boot').style.display='none';
})();

(function(){
  function easeOut(t){return 1-Math.pow(1-t,3)}
  function animCount(el,to,dur){
    const start=performance.now();
    (function step(now){
      const t=Math.min((now-start)/dur,1);
      el.textContent=Math.round(easeOut(t)*to);
      if(t<1)requestAnimationFrame(step);else el.textContent=to;
    })(performance.now());
  }
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target,val=parseInt(el.dataset.target);
      if(!isNaN(val))animCount(el,val,val>1000?2200:1400);
      obs.unobserve(el);
    });
  },{threshold:.5});
  qsa('[data-target]').forEach(el=>obs.observe(el));
})();

(function(){
  const seen=new WeakSet();
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting||seen.has(e.target))return;
      const parent=e.target.closest('.project-list,.contact-grid,.skills-strip,section');
      if(parent&&!seen.has(parent)){
        seen.add(parent);
        parent.querySelectorAll('.reveal').forEach((s,i)=>setTimeout(()=>s.classList.add('on'),i*110));
      }else{e.target.classList.add('on')}
      seen.add(e.target);obs.unobserve(e.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -50px 0px'});
  qsa('.reveal').forEach(el=>obs.observe(el));
})();

(function(){
  const items=qsa('.nav-a'),sections=qsa('section[id]');
  function upd(){
    let cur='';
    sections.forEach(s=>{if(window.scrollY>=s.offsetTop-220)cur=s.id});
    items.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
  }
  window.addEventListener('scroll',upd,{passive:true});upd();
})();

(function(){
  const overlay=qs('#interrupt');
  const lines=[qs('#il1'),qs('#il2'),qs('#il3')];
  async function fire(){
    lines.forEach(l=>{l.style.top=rnd(5,90)+'%';l.style.height=rnd(2,10)+'px';l.style.opacity=rnd(.4,1)});
    overlay.style.transition='none';overlay.style.opacity='1';
    await sleep(rnd(60,140));
    overlay.style.transition='opacity .35s ease';overlay.style.opacity='0';
    await sleep(350);
    if(Math.random()>.55){
      lines.forEach(l=>{l.style.top=rnd(5,90)+'%'});
      overlay.style.transition='none';overlay.style.opacity='0.6';
      await sleep(rnd(30,70));
      overlay.style.transition='opacity .2s ease';overlay.style.opacity='0';
      await sleep(200);
    }
    setTimeout(fire,rnd(7000,16000));
  }
  setTimeout(fire,rnd(3500,6000));
})();

qs('#yr').textContent=new Date().getFullYear();
