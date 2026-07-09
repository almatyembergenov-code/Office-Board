const fs = require('fs');
const path = require('path');
const ICS_URL = process.env.CALENDAR_ICS_URL;
if (!ICS_URL) throw new Error('CALENDAR_ICS_URL secret is missing');
const outFile = path.join(process.cwd(), 'data', 'events.json');
function unfold(s){return s.replace(/\r?\n[ \t]/g,'');}
function parseDate(v){
  if(!v) return null;
  v=v.trim();
  if(/^\d{8}$/.test(v)) return `${v.slice(0,4)}-${v.slice(4,6)}-${v.slice(6,8)}T00:00:00+05:00`;
  const m=v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if(m){const iso=`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}${v.endsWith('Z')?'Z':'+05:00'}`;return new Date(iso).toISOString();}
  return v;
}
function clean(v=''){return v.replace(/\\n/g,' ').replace(/\\,/g,',').replace(/\\;/g,';').trim();}
function field(block, name){const re=new RegExp(`^${name}(?:;[^:]*)?:(.*)$`,'mi');return block.match(re)?.[1];}
function detectCategory(title=''){
  const t=title.toLowerCase();
  if(t.includes('тренинг')||t.includes('обуч')) return 'training';
  if(t.includes('тест')) return 'test';
  if(t.includes('ап')||t.includes('адаптац')) return 'ap';
  if(t.includes('встреч')||t.includes('совещ')||t.includes('собран')) return 'meeting';
  if(t.includes('выход')) return 'off';
  if(t.includes('отпуск')) return 'vacation';
  return 'meeting';
}
function detectOwner(text=''){
  const t=text.toLowerCase();
  for (const name of ['Алмат','Захар','Ильяс']) if(t.includes(name.toLowerCase())) return name;
  return '';
}
(async()=>{
  const res = await fetch(ICS_URL);
  if(!res.ok) throw new Error(`Failed to fetch ICS: ${res.status}`);
  const ics = unfold(await res.text());
  const blocks = [...ics.matchAll(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g)].map(m=>m[1]);
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth()-1, 1);
  const to = new Date(now.getFullYear(), now.getMonth()+2, 31, 23, 59, 59);
  const events = blocks.map(b=>{
    const title=clean(field(b,'SUMMARY')||'Без названия');
    const description=clean(field(b,'DESCRIPTION')||'');
    const location=clean(field(b,'LOCATION')||'');
    const start=parseDate(field(b,'DTSTART'));
    const end=parseDate(field(b,'DTEND') || field(b,'DTSTART'));
    const text=`${title} ${description} ${location}`;
    return {title, description, location, start, end, category:detectCategory(title), owner:detectOwner(text)};
  }).filter(e=>e.start && new Date(e.end)>=from && new Date(e.start)<=to)
    .sort((a,b)=>new Date(a.start)-new Date(b.start));
  fs.mkdirSync(path.dirname(outFile), {recursive:true});
  fs.writeFileSync(outFile, JSON.stringify({updatedAt:new Date().toISOString(), events}, null, 2));
  console.log(`Saved ${events.length} events to ${outFile}`);
})();
