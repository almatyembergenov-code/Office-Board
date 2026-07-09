const CONFIG = {
  team: [
    { name: 'Алмат', key: 'almat', color: '#24c58b', idle: 'Балдею 😎' },
    { name: 'Захар', key: 'zakhar', color: '#ff7a22', idle: 'Свободен' },
    { name: 'Ильяс', key: 'ilyas', color: '#2b82ff', idle: 'Свободен' }
  ],
  categories: {
    training: { label: 'Тренинги', color: '#ef4f9a', icon: '🎓', status: 'На обучении' },
    test: { label: 'Тесты', color: '#58c34f', icon: '📝', status: 'Тестирование' },
    adaptation: { label: 'АП', color: '#ff8b2d', icon: '👤', status: 'Адаптация' },
    meeting: { label: 'Курсы / встречи', color: '#f4c432', icon: '🤝', status: 'На собрании' },
    dayoff: { label: 'Выходной', color: '#ff4e4e', icon: '🏠', status: 'Выходной' },
    vacation: { label: 'Отпуск', color: '#2579e8', icon: '✈️', status: 'В отпуске' }
  }
};

const EVENTS = [
  { date: '2026-07-02', start: '09:00', end: '18:00', type: 'training', title: 'Эмоциональный интеллект', person: 'almat', place: 'Учебный класс 2' },
  { date: '2026-07-09', start: '09:00', end: '18:00', type: 'training', title: 'Эмоциональный интеллект', person: 'ilyas', place: 'Учебный класс 2' },
  { date: '2026-07-09', start: '14:00', end: '16:00', type: 'test', title: 'Тестирование', details: '18 сотрудников', person: 'almat' },
  { date: '2026-07-09', start: '16:30', end: '17:30', type: 'meeting', title: 'Планирование обучения', person: 'zakhar', place: 'Zoom' },
  { date: '2026-07-15', start: '10:00', end: '11:00', type: 'meeting', title: 'Встреча: планирование', person: 'zakhar' },
  { date: '2026-07-21', start: '09:00', end: '18:00', type: 'training', title: 'ВКС 1 FAB', person: 'almat' },
  { date: '2026-07-30', start: '14:00', end: '16:00', type: 'test', title: 'Тестирование', details: '12 человек', person: 'ilyas' },
  { date: '2026-08-04', start: '09:00', end: '13:00', type: 'test', title: 'Тесты', person: 'zakhar' },
  { date: '2026-08-12', start: '09:00', end: '18:00', type: 'training', title: 'Работа с возражениями', person: 'ilyas' },
  { date: '2026-08-20', start: '10:00', end: '11:00', type: 'meeting', title: 'Zoom встреча', person: 'almat' },
  { date: '2026-08-25', endDate: '2026-08-31', type: 'vacation', title: 'Отпуск: Захар', person: 'zakhar' }
];
