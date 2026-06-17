(function(){
  var prog=document.getElementById('prog');
  function onScroll(){
    var h=document.documentElement;
    var max=h.scrollHeight-h.clientHeight;
    prog.style.width=(max>0?(h.scrollTop/max*100):0)+'%';
  }
  document.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
})();

/* ===================== rail + minibar active section ===================== */
(function(){
  var secs=[
    {id:'intro',n:'00',name:'Introduction'},
    {id:'background',n:'01',name:'Background'},
    {id:'existing',n:'02',name:'Existing solutions'},
    {id:'amber-walkthrough',n:'03',name:'Amber Walkthrough'},
    {id:'built',n:'04',name:'How we built Amber'},
    {id:'tradeoffs',n:'05',name:'Engineering Tradeoffs and Challenges'},
    {id:'future',n:'06',name:'Future Work'},
    {id:'references',n:'07',name:'References'}
  ];
  var now=document.querySelector('.minibar .now');
  var items=[].slice.call(document.querySelectorAll('.idx > li'));
  var cur=-1;
  function setActive(i){
    if(i===cur) return; cur=i;
    for(var k=0;k<items.length;k++) items[k].classList.toggle('on', k===i);
    if(now) now.innerHTML='\u00a7'+secs[i].n+' \u00b7 <b>'+secs[i].name+'</b>';
  }
  items.forEach(function(item,i){
    var link=item.querySelector(':scope > a.ix');
    if(link) link.addEventListener('click',function(){ setActive(i); });
  });
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        for(var j=0;j<secs.length;j++){ if(secs[j].id===e.target.id){ setActive(j); break; } }
      }
    });
  },{rootMargin:'-44% 0px -52% 0px'});
  secs.forEach(function(s){ var el=document.getElementById(s.id); if(el) io.observe(el); });

  var litIo=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('lit'); });
  },{rootMargin:'0px 0px -22% 0px',threshold:0.02});
  [].slice.call(document.querySelectorAll('.sec')).forEach(function(s){ litIo.observe(s); });
})();

/* ===================== reusable screenshot carousels ===================== */
(function(){
  var carousels=[].slice.call(document.querySelectorAll('[data-carousel]'));
  carousels.forEach(function(carousel){
    var slides=[].slice.call(carousel.querySelectorAll('[data-carousel-slide]'));
    var dots=[].slice.call(carousel.querySelectorAll('[data-carousel-dot]'));
    var prev=carousel.querySelector('[data-carousel-prev]');
    var next=carousel.querySelector('[data-carousel-next]');
    var cur=0;

    if(!slides.length) return;

    function show(i){
      cur=(i+slides.length)%slides.length;
      slides.forEach(function(slide,idx){
        var active=idx===cur;
        slide.classList.toggle('is-active',active);
        slide.setAttribute('aria-hidden',active?'false':'true');
      });
      dots.forEach(function(dot,idx){
        var active=idx===cur;
        dot.classList.toggle('is-active',active);
        dot.setAttribute('aria-current',active?'true':'false');
      });
    }

    if(prev) prev.addEventListener('click',function(){ show(cur-1); });
    if(next) next.addEventListener('click',function(){ show(cur+1); });
    dots.forEach(function(dot,idx){
      dot.addEventListener('click',function(){ show(idx); });
    });

    show(0);
  });
})();

/* ===================== image lightbox ===================== */
(function(){
  var imgs=[].slice.call(document.querySelectorAll('.case-carousel__frame img, [data-lightbox-image]'));
  if(!imgs.length) return;

  var lightbox=document.createElement('div');
  lightbox.className='image-lightbox';
  lightbox.setAttribute('role','dialog');
  lightbox.setAttribute('aria-modal','true');
  lightbox.setAttribute('aria-label','Fullscreen image');
  lightbox.innerHTML='<button class="image-lightbox__close" type="button" aria-label="Close fullscreen image">&times;</button><img class="image-lightbox__img" alt="">';
  document.body.appendChild(lightbox);

  var close=lightbox.querySelector('.image-lightbox__close');
  var full=lightbox.querySelector('.image-lightbox__img');

  function open(img){
    full.src=img.currentSrc||img.src;
    full.alt=img.alt||'';
    lightbox.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    close.focus();
  }

  function hide(){
    lightbox.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    full.removeAttribute('src');
  }

  imgs.forEach(function(img){
    img.addEventListener('click',function(){ open(img); });
    img.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        open(img);
      }
    });
  });
  close.addEventListener('click',hide);
  lightbox.addEventListener('click',function(e){
    if(e.target===lightbox) hide();
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&lightbox.classList.contains('is-open')) hide();
  });
})();

/* ===== Normal vs durable execution animation ===== */
(function(){
  const track=document.getElementById('abtrack');
  if(!track) return;
  const steps=[...track.querySelectorAll('.tstep')];
  const read=document.getElementById('abread');
  const run=document.getElementById('abrun');
  const toggle=document.getElementById('abtoggle');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep=ms=>new Promise(r=>setTimeout(r,reduce?0:ms));
  let mode='plain';

  function reset(){ steps.forEach(s=>s.className='tstep'); read.innerHTML='Pick a mode, then simulate a crash mid-operation.'; }

  toggle.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    [...toggle.children].forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); mode=b.dataset.mode; reset();
  });

  async function play(){
    run.disabled=true; reset();
    for(let k=0;k<2;k++){ steps[k].classList.add('running'); await sleep(360); steps[k].classList.remove('running'); steps[k].classList.add('done'); }
    steps[2].classList.add('running'); await sleep(420);
    steps[2].classList.remove('running'); steps[2].classList.add('crashpt');
    read.innerHTML='<span class="bad">✕ crash mid-operation at step 3.</span>'; await sleep(680);

    if(mode==='plain'){
      steps.forEach(s=>s.className='tstep');
      for(let k=0;k<2;k++){ steps[k].classList.add('wasted'); await sleep(240); }
      read.innerHTML='<span class="bad">In normal execution, completed work is discarded, retries starts over from scratch</span>';
    } else {
      for(let k=0;k<2;k++){ steps[k].className='tstep preserved'; await sleep(200); }
      steps[2].className='tstep'; steps[3].className='tstep'; steps[4].className='tstep';
      read.innerHTML='In durable execution, work is preserved each step, retries can resume from the last successfully recorded step.';
      await sleep(520);
      for(let k=2;k<5;k++){ steps[k].classList.add('running'); await sleep(360); steps[k].classList.remove('running'); steps[k].classList.add('done'); }
    }
    run.disabled=false;
  }
  run.addEventListener('click',play);
})();
