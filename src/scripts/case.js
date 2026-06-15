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
    {id:'agents',n:'02',name:'Agents'},
    {id:'existing',n:'03',name:'Existing solutions'},
    {id:'fits',n:'04',name:'Where Amber fits'},
    {id:'built',n:'05',name:'How we built it'},
    {id:'walkthrough',n:'06',name:'Walkthrough'},
    {id:'tradeoffs',n:'07',name:'Tradeoffs'},
    {id:'future',n:'08',name:'Future work'}
  ];
  var now=document.querySelector('.minibar .now');
  var items=[].slice.call(document.querySelectorAll('.idx > li'));
  var cur=-1;
  function setActive(i){
    if(i===cur) return; cur=i;
    for(var k=0;k<items.length;k++) items[k].classList.toggle('on', k===i);
    if(now) now.innerHTML='\u00a7'+secs[i].n+' \u00b7 <b>'+secs[i].name+'</b>';
  }
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
