const cfg = window.OFFICE_BOARD_CONFIG;
let events = [];
let selectedDate = new Date();
const ru = new Intl.DateTimeFormat('ru-RU', { day:'numeric', month:'long', weekday:'long' });
const monthFmt = new Intl.DateTimeFormat('ru-RU', { month:'long', year:'numeric' });
function startOfDay(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function sameDay(a,b){return startOfDay(a).getTime()===startOfDay(b).getTime()}
function toDate(v){return new Date(v)}
function detectCategory(title=''){
  const t = title.toLowerCase();
  if(t.includes('тренинг')||t.includes('обуч')) return 'training';
  if(t.includes('тест')) return 'test';
  if(t.includes('ап')||t.includes('адаптац')) return 'ap';
  if(t.includes('встреч')||t.includes('совещ')||t.includes('собран')) return 'meeting';
  if(t.includes('выход')) return 'off';
  if(t.includes('отпуск')) return 'vacation';
  return 'meeting';
}
function detectOwner(ev){
  const text = `${ev.title||''} ${ev.description||''} ${ev.owner||''}`.toLowerCase();
  return cfg.team.find(p=>text.includes(p.name.toLowerCase()))?.name || ev.owner || '';
}
async function loadEvents(){
  try{
    const r = await fetch(`data/events.json?ts=${Date.now()}`, {cache:'no-store'});
    if(!r.ok) throw new Error('events.json not found');
    const json = await r.json();
    events = (json.events || []).map(e=>({...e, category:e.category || detectCategory(e.title), owner:e.owner || detectOwner(e)}));
  }catch(e){
    events = cfg.demoEvents.map(e=>({...e, category:e.category || detectCategory(e.title), owner:e.owner || detectOwner(e)}));
  }
  render();
}
function render(){renderClock();renderPeople();renderToday();renderMetrics();renderLegend();renderCalendar();renderDayPanel();renderImportant();}
function renderClock(){const now=new Date();document.getElementById('clockTime').textContent=now.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});document.getElementById('clockDate').textContent=ru.format(now);}
function renderToday(){document.getElementById('todayDate').textContent=ru.format(new Date());}
function currentEventFor(name){const now=new Date();return events.find(e=>{const s=toDate(e.start), en=toDate(e.end || e.start); return now>=s && now<=en && (detectOwner(e) || '').toLowerCase().includes(name.toLowerCase());});}
function renderPeople(){const el=document.getElementById('people');el.innerHTML='';cfg.team.forEach(p=>{const ev=currentEventFor(p.name);const cat=ev?cfg.categories[ev.category || detectCategory(ev.title)]:null;const status=ev?cat.status:p.manualStatus;const emoji=ev?cat.icon:p.emoji;const card=document.createElement('div');card.className='person';card.innerHTML=`<div class="avatar">${emoji}</div><div><h3>${p.name}</h3><div class="status">${status}</div><div class="status-pill">${ev?ev.title:'событий сейчас нет'}</div></div>`;el.append(card);});}
function renderMetrics(){const today=events.filter(e=>sameDay(toDate(e.start),new Date()));const counts={training:0,test:0,meeting:0,vacation:0};today.forEach(e=>{const c=e.category || detectCategory(e.title); if(counts[c]!=null) counts[c]++;});document.getElementById('metrics').innerHTML=`<div class="metric"><div class="num">${today.length}</div><div class="label">событий сегодня</div></div><div class="metric"><div class="num">${counts.training}</div><div class="label">тренингов</div></div><div class="metric"><div class="num">${counts.test}</div><div class="label">тестов</div></div><div class="metric"><div class="num">${counts.meeting}</div><div class="label">встреч</div></div>`;}
function renderLegend(){document.getElementById('legend').innerHTML=`<div class="legend-title">Легенда</div><div class="legend-grid">${Object.entries(cfg.categories).map(([k,c])=>`<div class="legend-item"><span class="dot" style="background:${c.color}"></span>${c.icon} ${c.label}</div>`).join('')}</div>`;}
function monthDates(offset){const now=new Date();const first=new Date(now.getFullYear(),now.getMonth()+offset,1);return first;}
function eventsForDay(d){return events.filter(e=>{const s=startOfDay(toDate(e.start));const en=startOfDay(toDate(e.end || e.start));const day=startOfDay(d);return day>=s && day<=en;});}
function renderCalendar(){const wrap=document.getElementById('months');wrap.innerHTML='';[-1,0,1].forEach(offset=>{const first=monthDates(offset);const month=document.createElement('div');month.className='month '+(offset===0?'current':'');month.innerHTML=`<div class="month-title"><span>${monthFmt.format(first)}</span></div><div class="weekdays"><span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span></div><div class="days"></div>`;const daysEl=month.querySelector('.days');let start=(first.getDay()+6)%7;for(let i=0;i<start;i++){const emp=document.createElement('div');emp.className='day empty';daysEl.append(emp);}const last=new Date(first.getFullYear(),first.getMonth()+1,0).getDate();for(let day=1;day<=last;day++){const d=new Date(first.getFullYear(),first.getMonth(),day);const evs=eventsForDay(d);const div=document.createElement('div');div.className='day '+(sameDay(d,new Date())?'today ':'')+(sameDay(d,selectedDate)?'selected':'');div.onclick=()=>{selectedDate=d;renderCalendar();renderDayPanel();};div.innerHTML=`<div class="day-num">${day}</div><div class="markers">${evs.slice(0,6).map(e=>`<span class="marker" style="background:${cfg.categories[e.category || detectCategory(e.title)].color}"></span>`).join('')}</div>`;daysEl.append(div);}wrap.append(month);});}
function renderDayPanel(){const evs=eventsForDay(selectedDate).sort((a,b)=>toDate(a.start)-toDate(b.start));document.getElementById('selectedDayTitle').textContent=ru.format(selectedDate);document.getElementById('dayEvents').innerHTML=evs.length?evs.map(e=>{const c=cfg.categories[e.category || detectCategory(e.title)];return `<div class="event" style="border-left-color:${c.color}"><div class="event-time">${toDate(e.start).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}–${toDate(e.end||e.start).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</div><div class="event-title">${c.icon} ${e.title}</div><div class="event-owner">${e.owner||''}</div></div>`}).join(''):'<div class="event">Событий нет. Можно балдеть 😎</div>';}
function renderImportant(){const today=eventsForDay(new Date()).slice(0,4);document.getElementById('todayImportant').innerHTML=today.length?today.map(e=>`<div class="important-item">${cfg.categories[e.category].icon} ${e.title}</div>`).join(''):'<div class="important-item">На сегодня важных событий нет</div>';}
setInterval(()=>{renderClock();renderPeople();},30000);
loadEvents();setInterval(loadEvents,5*60*1000);
