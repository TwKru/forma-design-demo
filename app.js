(() => {
  document.documentElement.classList.add('js');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); } });
  }, {threshold: .08}) : null;
  document.querySelectorAll('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('in-view'));

  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  function closeMenu() { menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Открыть меню'); mobileMenu.hidden = true; }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open ? 'Закрыть меню' : 'Открыть меню'); mobileMenu.style.top = Math.round(document.querySelector('.site-header').getBoundingClientRect().bottom) + 'px'; mobileMenu.hidden = !open;
  });
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e => { if (e.key === 'Escape') closeMenu(); });
  matchMedia('(min-width: 851px)').addEventListener('change',e => { if (e.matches) closeMenu(); });
  document.addEventListener('scroll',() => { if (!mobileMenu.hidden) mobileMenu.style.top = Math.round(document.querySelector('.site-header').getBoundingClientRect().bottom) + 'px'; },{passive:true});

  const registration = document.querySelector('#registration');
  const form = document.querySelector('#registration-form');
  const formView = document.querySelector('#form-view');
  const resultView = document.querySelector('#result-view');
  function openDialog(dialog) { closeMenu(); dialog.showModal(); document.body.classList.add('modal-open'); }
  document.querySelectorAll('[data-register]').forEach(button => button.addEventListener('click',() => openDialog(registration)));
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click',() => openDialog(document.getElementById(button.dataset.open))));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click',() => dialog.close());
    dialog.addEventListener('close',() => { document.body.classList.remove('modal-open'); });
    dialog.addEventListener('click',e => { if (e.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); });
  });
  form.elements.name.addEventListener('input',() => form.elements.name.setCustomValidity(''));
  form.addEventListener('submit',e => {
    e.preventDefault();
    form.elements.name.setCustomValidity(form.elements.name.value.trim() ? '' : 'Введите имя или тестовый псевдоним.');
    if (!form.reportValidity()) return;
    const name = form.elements.name.value.trim();
    document.querySelector('#guest-name').textContent = name;
    document.querySelector('#ticket-name').textContent = name;
    document.querySelector('#ticket-role').textContent = form.elements.role.value;
    formView.hidden = true; resultView.hidden = false; registration.scrollTop = 0;
    document.querySelector('#edit-form').focus({preventScroll:true});
  });
  document.querySelector('#edit-form').addEventListener('click',() => {
    resultView.hidden = true; formView.hidden = false; registration.scrollTop = 0; form.elements.name.focus({preventScroll:true});
  });
  // Personal fields remain in memory only, and are cleared after closing the dialog.
  registration.addEventListener('close',() => {
    form.reset(); form.elements.name.setCustomValidity(''); resultView.hidden = true; formView.hidden = false;
    ['guest-name','ticket-name','ticket-role'].forEach(id => { document.getElementById(id).textContent = ''; });
  });

  const sessions = [...document.querySelectorAll('.session')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const savedButton = document.querySelector('.saved-toggle');
  const storageKey = 'novus-demo-session-selection-v1';
  const knownIds = sessions.map(s => s.dataset.id);
  let selected = new Set();
  try { const raw = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(raw)) selected = new Set(raw.filter(id => knownIds.includes(id))); } catch {}
  let category = 'all', onlySaved = false;
  function updateProgram() {
    let visible = 0;
    sessions.forEach(session => {
      const saved = selected.has(session.dataset.id);
      const save = session.querySelector('.save-session');
      save.setAttribute('aria-pressed',String(saved));
      save.setAttribute('aria-label',(saved ? 'Убрать «' : 'Добавить «') + session.querySelector('h3').textContent + (saved ? '» из моего маршрута' : '» в мой маршрут'));
      session.hidden = !((category === 'all' || session.dataset.type === category) && (!onlySaved || saved));
      if (!session.hidden) visible++;
    });
    filterButtons.forEach(b => b.setAttribute('aria-pressed',String(b.dataset.filter === category)));
    savedButton.setAttribute('aria-pressed',String(onlySaved));
    document.querySelector('#saved-count').textContent = String(selected.size);
    document.querySelector('.empty-state').hidden = visible > 0;
    document.querySelector('#program-status').textContent = 'Показано сессий: ' + visible + '. В вашем маршруте: ' + selected.size + '.';
  }
  filterButtons.forEach(button => button.addEventListener('click',() => { category = button.dataset.filter; updateProgram(); }));
  savedButton.addEventListener('click',() => { onlySaved = !onlySaved; updateProgram(); });
  sessions.forEach(session => {
    session.querySelector('.session-toggle').addEventListener('click',e => {
      const button = e.currentTarget; const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded',String(open)); document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
    });
    session.querySelector('.save-session').addEventListener('click',() => {
      const id = session.dataset.id; selected.has(id) ? selected.delete(id) : selected.add(id);
      try { localStorage.setItem(storageKey,JSON.stringify([...selected])); } catch {}
      updateProgram();
    });
  });
  document.querySelector('#show-all').addEventListener('click',() => { category = 'all'; onlySaved = false; updateProgram(); });
  document.querySelector('#reset-program').addEventListener('click',() => { selected.clear(); category = 'all'; onlySaved = false; try { localStorage.removeItem(storageKey); } catch {} updateProgram(); });
  updateProgram();

  let artPaused = reducedMotion.matches;
  const artControl = document.querySelector('.art-control');
  function applyArtState() {
    document.querySelector('.hero-art').classList.toggle('paused',artPaused);
    artControl.setAttribute('aria-pressed',String(artPaused));
    artControl.setAttribute('aria-label',artPaused ? 'Продолжить движение графики' : 'Приостановить движение графики');
    artControl.querySelector('span').textContent = artPaused ? '▶' : 'Ⅱ';
  }
  artControl.addEventListener('click',() => { artPaused = !artPaused; applyArtState(); });
  applyArtState();

  // Lightweight native canvas artwork: no libraries, network calls, or personal data.
  const canvas = document.querySelector('#connection-canvas');
  const ctx = canvas.getContext('2d');
  const canvasCard = canvas.closest('.art-card');
  let cw = 0, ch = 0, frame = 0, inViewport = false, angle = 0;
  const pointer = {x:0,y:0,active:false};
  function sizeCanvas() {
    const rect = canvas.getBoundingClientRect(); cw = rect.width; ch = rect.height;
    const ratio = Math.min(devicePixelRatio || 1,2); canvas.width = Math.round(cw * ratio); canvas.height = Math.round(ch * ratio); ctx.setTransform(ratio,0,0,ratio,0,0); drawCanvas();
  }
  const points = Array.from({length:95},(_,i) => {
    const y = 1 - (i / 94) * 2, radius = Math.sqrt(1 - y*y), phi = Math.PI * (3-Math.sqrt(5)) * i;
    return {x:Math.cos(phi)*radius,y,z:Math.sin(phi)*radius};
  });
  function drawCanvas() {
    if (!cw || !ch) return;
    ctx.clearRect(0,0,cw,ch);
    const radius = Math.min(cw*.34,ch*.26), cy = ch*.43;
    const rotation = angle + pointer.x*.45, tilt = -.2 + pointer.y*.3;
    const nodes = points.map(p => {
      const x = p.x*Math.cos(rotation) - p.z*Math.sin(rotation), z = p.x*Math.sin(rotation)+p.z*Math.cos(rotation);
      const y = p.y*Math.cos(tilt)-z*Math.sin(tilt), depth = p.y*Math.sin(tilt)+z*Math.cos(tilt);
      return {x:cw*.5+x*radius,y:cy+y*radius,z:depth};
    });
    nodes.forEach((a,i) => {
      for (let j=i+1;j<nodes.length;j++) {
        const b=nodes[j], dx=points[i].x-points[j].x, dy=points[i].y-points[j].y, dz=points[i].z-points[j].z;
        if(dx*dx+dy*dy+dz*dz>.19)continue;
        const alpha=.1+((a.z+b.z+2)/4)*.22;
        ctx.strokeStyle='rgba(38,43,37,'+alpha+')';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
      ctx.fillStyle=i%11===0?'#ff5631':'rgba(25,30,24,'+(.3+(a.z+1)*.3)+')';ctx.beginPath();ctx.arc(a.x,a.y,i%11===0?3.2:1.6,0,Math.PI*2);ctx.fill();
    });
  }
  function tick() {
    if (!inViewport || document.hidden || reducedMotion.matches) { frame=0; return; }
    angle+=.0025;drawCanvas();frame=requestAnimationFrame(tick);
  }
  function startCanvas() { if (!frame && inViewport && !document.hidden && !reducedMotion.matches) frame=requestAnimationFrame(tick); else drawCanvas(); }
  canvasCard.addEventListener('pointermove',e => {const r=canvas.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;pointer.active=true;if(reducedMotion.matches)drawCanvas();});
  canvasCard.addEventListener('pointerleave',() => {pointer.x=0;pointer.y=0;pointer.active=false;if(reducedMotion.matches)drawCanvas();});
  if ('ResizeObserver' in window) new ResizeObserver(sizeCanvas).observe(canvas); else window.addEventListener('resize',sizeCanvas);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {inViewport=entries[0].isIntersecting;startCanvas();}).observe(canvas); else inViewport=true;
  document.addEventListener('visibilitychange',startCanvas);
  reducedMotion.addEventListener('change',() => {artPaused=reducedMotion.matches;applyArtState();startCanvas();});
  sizeCanvas();startCanvas();
})();
