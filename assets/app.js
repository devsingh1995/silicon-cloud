(()=>{
 const toggle=document.querySelector('[data-nav-toggle]'); const nav=document.querySelector('[data-nav]');
 if(toggle&&nav){toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}})}
 const observer=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.05}):null;document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('visible'));
 const datasets={today:[30,45,52,77,64,85,71,96],week:[40,57,70,59,88,77,97,82],month:[30,48,76,63,87,91,73,99]};
 document.querySelectorAll('[data-graph-tab]').forEach(tab=>tab.addEventListener('click',()=>{const group=tab.closest('[data-graph]');if(!group)return;group.querySelectorAll('[data-graph-tab]').forEach(t=>{t.classList.remove('active');t.setAttribute('aria-selected','false')});tab.classList.add('active');tab.setAttribute('aria-selected','true');const key=tab.dataset.graphTab;group.querySelectorAll('.bars span').forEach((bar,i)=>bar.style.setProperty('--h',(datasets[key]?.[i]||30)+'%'));const label=group.querySelector('[data-period-label]');if(label)label.textContent={today:'Today / illustrative',week:'Last 7 days / illustrative',month:'Last 30 days / illustrative'}[key]||'Illustrative'}));
 const form=document.querySelector('[data-contact-form]');if(form){const status=form.querySelector('[data-form-status]');const btn=form.querySelector('[type=submit]');form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form).entries());if(data.website){return}btn.disabled=true;btn.textContent='Sending enquiry…';status.className='form-status';status.textContent='';try{const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)});let result={};try{result=await response.json()}catch{}if(!response.ok)throw new Error(result.error||'The enquiry could not be sent.');status.className='form-status success show';status.textContent='Your enquiry was sent successfully. We will respond using the details provided.';form.reset()}catch(err){status.className='form-status error show';status.innerHTML='Unable to submit your enquiry. Please email <a href="mailto:contact@siliconcloud.space">contact@siliconcloud.space</a> directly.';console.warn('Form request failed:',err.message)}finally{btn.disabled=false;btn.textContent='Send my enquiry';status.scrollIntoView({block:'nearest',behavior:'smooth'})}})}
 // Active only when the motion sections are on screen. Existing reveal animations stay untouched.
 const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const animatedSections=[...document.querySelectorAll('[data-sim-dashboard],.section-visual,.case')];
 if('IntersectionObserver'in window){
   const motionObserver=new IntersectionObserver(entries=>{
     entries.forEach(entry=>entry.target.classList.toggle('motion-active',entry.isIntersecting&&!reduceMotion.matches));
   },{threshold:0.03,rootMargin:'70px 0px'});
   animatedSections.forEach(section=>motionObserver.observe(section));
   reduceMotion.addEventListener?.('change',()=>{if(reduceMotion.matches)animatedSections.forEach(section=>section.classList.remove('motion-active'))});
 }else if(!reduceMotion.matches){animatedSections.forEach(section=>section.classList.add('motion-active'))}
 // An intentionally small, clearly identified simulation. No camera feed or live data is implied.
 const simulatedEvents=['Queue threshold flagged','Entry count updated','Zone activity reviewed','Camera stream checked','Entrance crossing logged','Alert rule evaluated'];
 let simulatedTick=1;
 if(document.querySelector('[data-sim-dashboard]')){
   window.setInterval(()=>{
     if(document.hidden||reduceMotion.matches)return;
     document.querySelectorAll('[data-sim-dashboard].motion-active').forEach((dash,index)=>{
       const count=dash.querySelector('[data-sim-visitors]');
       if(count){count.textContent=(1284+(simulatedTick%12)).toLocaleString('en-IN');count.classList.remove('value-tick');void count.offsetWidth;count.classList.add('value-tick')}
       const eventNodes=dash.querySelectorAll('[data-sim-event]');
       if(eventNodes.length){const item=eventNodes[simulatedTick%eventNodes.length];item.textContent=simulatedEvents[(simulatedTick+index)%simulatedEvents.length];const row=item.closest('.dash-event');row.classList.remove('sim-update');void row.offsetWidth;row.classList.add('sim-update')}
     });
     simulatedTick++;
   },4500);
 }
})();
