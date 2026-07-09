const $ = (s) => document.querySelector(s);
const pad = (n) => String(n).padStart(2, '0');
const ruMonths = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
const ruMonthsGen = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const ruWeek = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
let selectedDate = new Date(2026, 6, 9); // для прототипа; потом заменить на new Date()

function dateKey(d){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function parseDate(s){ const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
function inEventRange(event, key){
  const start = event.date;
  const end = event.endDate || event.date;
  return key >= start && key <= end;
}
function minutes(t){ if(!t) return 0; const [h,m]=t.split(':').map(Number); return h*60+m; }
function nowMinutes(){ const now = new Date(); return now.getHours()*60+now.getMinutes(); }

function renderClock(){
  const now = new Date();
  $('#clockTime').textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  $('#clockDate').textContent = `${now.getDate()} ${ruMonthsGen[now.getMonth()]}, ${ruWeek[now.getDay()]}`;
}

function renderToday(){
  const d = selectedDate;
  $('#todayDate').textContent = `${d.getDate()} ${ruMonthsGen[d.getMonth()]}, ${ruWeek[d.getDay()]}`;
}

function renderPeople(){
  const currentKey = dateKey(selectedDate);
  const currentMinute = minutes('10:30'); // демо-время; позже заменить на nowMinutes()
  $('#people').innerHTML = CONFIG.team.map(person => {
    const active = EVENTS.find(e => e.person === person.key && inEventRange(e, currentKey) && (!e.start || (currentMinute >= minutes(e.start) && currentMinute < minutes(e.end))));
    const cat = active ? CONFIG.categories[active.type] : null;
    const status = active ? cat.status : person.idle;
    const icon = active ? cat.icon : '🙂';
    return `<div class="person panel" style="--accent:${person.color}">
      <div class="avatar">${icon}</div>
      <div>
        <div class="person-name">${person.name}</div>
        <div class="person-status">${status}</div>
      </div>
    </div>`;
  }).join('');
}

function renderMetrics(){
  const key = dateKey(selectedDate);
  const counts = Object.keys(CONFIG.categories).map(type => {
    const cat = CONFIG.categories[type];
    const events = EVENTS.filter(e => e.type === type && inEventRange(e, key));
    if (!events.length) return '';
    return `<div class="metric panel" style="--accent:${cat.color}"><div class="metric-icon">${cat.icon}</div><div><div class="metric-label">${cat.label}</div><div class="metric-number">${events.length}</div></div></div>`;
  }).join('');
  $('#metrics').innerHTML = counts;
}

function renderLegend(){
  $('#legend').innerHTML = '<div class="legend-title">Условные обозначения</div>' + Object.entries(CONFIG.categories).map(([k,c]) =>
    `<div class="legend-item"><span style="background:${c.color}"></span>${c.label}</div>`
  ).join('');
}

function monthMatrix(year, month){
  const first = new Date(year, month, 1);
  const start = new Date(first);
  const weekday = (first.getDay()+6)%7;
  start.setDate(first.getDate()-weekday);
  return Array.from({length:42}, (_,i)=>{ const d=new Date(start); d.setDate(start.getDate()+i); return d; });
}

function renderMonths(){
  const base = selectedDate;
  const months = [-1,0,1].map(offset => new Date(base.getFullYear(), base.getMonth()+offset, 1));
  $('#months').innerHTML = months.map(m => renderMonth(m)).join('');
}

function renderMonth(m){
  const days = monthMatrix(m.getFullYear(), m.getMonth());
  return `<div class="month">
    <h2>${ruMonths[m.getMonth()].toUpperCase()} ${m.getFullYear()}</h2>
    <div class="weekday">${['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'].map(x=>`<b>${x}</b>`).join('')}</div>
    <div class="grid">${days.map(d => renderDay(d, m.getMonth())).join('')}</div>
  </div>`;
}

function renderDay(d, currentMonth){
  const key = dateKey(d);
  const dayEvents = EVENTS.filter(e => inEventRange(e, key));
  const selected = key === dateKey(selectedDate) ? ' selected' : '';
  const muted = d.getMonth() !== currentMonth ? ' muted' : '';
  return `<button class="day${selected}${muted}" onclick="selectDay('${key}')">
    <span class="num">${d.getDate()}</span>
    <div class="chips">${dayEvents.slice(0,2).map(e => {
      const c = CONFIG.categories[e.type];
      return `<span class="chip" style="background:${c.color}">${c.icon} ${e.title}</span>`
    }).join('')}</div>
  </button>`;
}

window.selectDay = function(key){ selectedDate = parseDate(key); renderAll(); };

function renderDayPanel(){
  const key = dateKey(selectedDate);
  const events = EVENTS.filter(e => inEventRange(e,key)).sort((a,b)=>minutes(a.start)-minutes(b.start));
  $('#selectedDayTitle').textContent = `${selectedDate.getDate()} ${ruMonthsGen[selectedDate.getMonth()]}, ${ruWeek[selectedDate.getDay()]}`;
  $('#dayEvents').innerHTML = events.length ? events.map(e => {
    const c = CONFIG.categories[e.type];
    return `<article class="event-card" style="--accent:${c.color}">
      <div class="event-icon">${c.icon}</div>
      <div><div class="event-time">${e.start || 'весь день'}${e.end ? ' – '+e.end : ''}</div>
      <div class="event-title">${e.title}</div>
      <div class="event-details">${e.details || ''}${e.place ? '<br>'+e.place : ''}</div></div>
    </article>`;
  }).join('') : '<div class="empty">На этот день событий нет</div>';
  $('#todayImportant').innerHTML = events.length ? events.map(e => `<div class="important-line" style="--accent:${CONFIG.categories[e.type].color}">${e.start || 'Весь день'} — ${e.title}</div>`).join('') : '<div class="empty">Свободный день</div>';
}

function initNotes(){
  const notes = $('#notes');
  notes.value = localStorage.getItem('office-board-notes') || '';
  notes.addEventListener('input', () => localStorage.setItem('office-board-notes', notes.value));
}

function renderAll(){ renderToday(); renderPeople(); renderMetrics(); renderLegend(); renderMonths(); renderDayPanel(); renderClock(); }
initNotes(); renderAll(); setInterval(renderClock, 1000);
