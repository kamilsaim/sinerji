// src/lib/mock-data.js

export const RING_TYPE_LABELS = {
  süresiz: 'Süresiz',
  hedefli: 'Hedefli',
  süreli: 'Süreli',
  dua: 'Dua isteği',
};

export const MOCK_RINGS = [
  { id: '1', title: 'Fatiha okuyalım', type: 'süresiz', total: 12480, participants: 342 },
  {
    id: '2',
    title: '1.000.000 Salavat',
    type: 'hedefli',
    total: 241800,
    goal: 1000000,
    participants: 2418,
  },
  { id: '3', title: "Mehmet'in sınavı · Cumaya kadar", type: 'dua', participants: 84 },
];
