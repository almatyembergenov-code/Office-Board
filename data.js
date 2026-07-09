window.OFFICE_BOARD_CONFIG = {
  team: [
    { id: 'almat', name: 'Алмат', emoji: '😎', manualStatus: 'Балдею' },
    { id: 'zakhar', name: 'Захар', emoji: '💻', manualStatus: 'Свободен' },
    { id: 'ilyas', name: 'Ильяс', emoji: '🎓', manualStatus: 'Свободен' }
  ],
  categories: {
    training: { label: 'Тренинг', color: '#ff6fb5', icon: '🎓', status: 'На обучении' },
    test: { label: 'Тест', color: '#61e294', icon: '📝', status: 'Тестирование' },
    ap: { label: 'АП', color: '#ffb86b', icon: '👥', status: 'Адаптация' },
    meeting: { label: 'Встреча', color: '#f6e56d', icon: '💻', status: 'На собрании' },
    off: { label: 'Выходной', color: '#ff5f68', icon: '🏠', status: 'Выходной' },
    vacation: { label: 'Отпуск', color: '#64a8ff', icon: '🏖', status: 'В отпуске' }
  },
  demoEvents: [
    { title: 'Тренинг | Эмоциональный интеллект', start: new Date().toISOString(), end: new Date(Date.now()+2*60*60*1000).toISOString(), category: 'training', owner: 'Ильяс' },
    { title: 'Встреча | Планирование', start: new Date(Date.now()+3*60*60*1000).toISOString(), end: new Date(Date.now()+4*60*60*1000).toISOString(), category: 'meeting', owner: 'Захар' },
    { title: 'Тестирование | ВКС 1', start: new Date(Date.now()+24*60*60*1000).toISOString(), end: new Date(Date.now()+26*60*60*1000).toISOString(), category: 'test', owner: 'Алмат' }
  ]
};
