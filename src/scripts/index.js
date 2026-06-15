(function(){
  var cmp=document.getElementById('cmp');
  var handle=document.getElementById('cmpHandle');
  var grab=document.getElementById('cmpGrab');
  if(!cmp)return;
  var MIN=8,MAX=92,dragging=false;
  function setPos(pct){
    pct=Math.max(MIN,Math.min(MAX,pct));
    cmp.style.setProperty('--pos',pct+'%');
    grab.setAttribute('aria-valuenow',Math.round(pct));
  }
  function fromEvent(clientX){
    var r=cmp.getBoundingClientRect();
    setPos(((clientX-r.left)/r.width)*100);
    cmp.classList.add('touched');
  }
  function down(e){dragging=true;cmp.classList.add('touched');
    fromEvent(e.touches?e.touches[0].clientX:e.clientX);e.preventDefault();}
  function move(e){if(!dragging)return;
    fromEvent(e.touches?e.touches[0].clientX:e.clientX);}
  function up(){dragging=false;}
  handle.addEventListener('pointerdown',down);
  cmp.addEventListener('pointerdown',function(e){if(e.target.closest('.cmp-grab,.cmp-handle'))return;down(e);});
  window.addEventListener('pointermove',move);
  window.addEventListener('pointerup',up);
  grab.addEventListener('keydown',function(e){
    var cur=parseFloat(cmp.style.getPropertyValue('--pos'))||72;
    if(e.key==='ArrowLeft'){setPos(cur-4);cmp.classList.add('touched');e.preventDefault();}
    if(e.key==='ArrowRight'){setPos(cur+4);cmp.classList.add('touched');e.preventDefault();}
  });
})();