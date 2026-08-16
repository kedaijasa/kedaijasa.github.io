(() => {
'use strict';
const menu=document.getElementById('siteMenu');
const button=document.getElementById('menuButton');
const close=document.getElementById('menuClose');
const back=document.getElementById('kjBackTop');
const audio=document.getElementById('bgAudio');
const music=document.getElementById('musicToggle');
const year=document.getElementById('year');
if(year) year.textContent=new Date().getFullYear();

function openMenu(){
 if(!menu||!button)return;
 menu.classList.add('is-open');
 menu.setAttribute('aria-hidden','false');
 button.classList.add('is-open');
 button.setAttribute('aria-expanded','true');
 button.setAttribute('aria-label','Tutup menu');
 document.body.classList.add('kj-menu-lock');
}
function closeMenu(){
 if(!menu||!button)return;
 menu.classList.remove('is-open');
 menu.setAttribute('aria-hidden','true');
 button.classList.remove('is-open');
 button.setAttribute('aria-expanded','false');
 button.setAttribute('aria-label','Buka menu');
 document.body.classList.remove('kj-menu-lock');
}
button?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();menu?.classList.contains('is-open')?closeMenu():openMenu()});
close?.addEventListener('click',e=>{e.preventDefault();closeMenu()});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
menu?.addEventListener('click',e=>{if(e.target===menu)closeMenu()});

window.addEventListener('scroll',()=>{
 if(back) back.classList.toggle('is-visible',window.scrollY>450);
},{passive:true});
back?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

const targets=document.querySelectorAll('.section,.service-card,.process-grid article,.tech-grid div');
if('IntersectionObserver' in window){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.05});
 targets.forEach(x=>io.observe(x));
}else targets.forEach(x=>x.classList.add('is-visible'));

function musicLabel(on){
 if(!music)return;
 music.innerHTML='<span class="bars"><i></i><i></i><i></i><i></i></span> MUSIK '+(on?'ON':'OFF');
 music.classList.toggle('playing',!!on);
}

async function startMusic(){
 if(!audio)return false;
 try{
   audio.volume=0.45;
   await audio.play();
   musicLabel(true);
   return true;
 }catch(e){
   return false;
 }
}

music?.addEventListener('click',async()=>{
 if(!audio)return;
 try{
   if(audio.paused){ await audio.play(); musicLabel(true); }
   else { audio.pause(); musicLabel(false); }
 }catch(e){}
});

// Autoplay langsung jika browser mengizinkan. Jika diblokir, lanjut otomatis
// pada interaksi pertama pengguna, tanpa perlu menekan tombol musik.
startMusic();
['pointerdown','keydown','touchstart','scroll'].forEach(evt=>{
 window.addEventListener(evt,()=>{ if(audio?.paused) startMusic(); },{once:true,passive:true});
});
audio?.addEventListener('play',()=>musicLabel(true));
audio?.addEventListener('pause',()=>musicLabel(false));
musicLabel(audio && !audio.paused);
})();

// Visitor information and page transfer size
(function(){
 const loadEl=document.getElementById('loadSize');
 const infoEl=document.getElementById('visitorInfo');
 function fmtBytes(n){
   if(!Number.isFinite(n)||n<=0)return '-- KB';
   if(n<1024*1024)return (n/1024).toFixed(1)+' KB';
   return (n/1024/1024).toFixed(2)+' MB';
 }
 function updateLoad(){
   let total=0;
   try{
     performance.getEntriesByType('resource').forEach(e=>{ total += Number(e.transferSize||e.encodedBodySize||0); });
     total += Number(performance.getEntriesByType('navigation')[0]?.transferSize||0);
   }catch(e){}
   loadEl && (loadEl.textContent='LOAD '+fmtBytes(total));
 }
 function updateVisitor(){
   if(!infoEl)return;
   const now=new Date();
   const date=new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'}).format(now);
   const time=new Intl.DateTimeFormat('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now);
   const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'WAKTU LOKAL';
   let location='INDONESIA';
   if(tz.includes('/')) location=tz.split('/').pop().replace(/_/g,' ');
   infoEl.textContent='LOKASI '+location+' · '+date+' · '+time;
 }
 updateLoad(); updateVisitor();
 setInterval(()=>{updateLoad();updateVisitor()},1000);
 window.addEventListener('load',()=>setTimeout(updateLoad,500));
})();
