// src/lib/hijri.js

const HIJRI_MONTHS = [
  'Muharrem', 'Safer', 'Rebîülevvel', 'Rebîülâhir', 'Cemâziyelevvel', 'Cemâziyelâhir',
  'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce',
];

const WEEKDAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

// Sabit hicri gün/aya denk gelen kandiller ve bayramlar. Regâib Kandili (Recep ayının ilk Cuma
// gecesi) değişken olduğu için bu tabloda YOK — bkz. plan dokümanındaki kapsam notu.
const SPECIAL_DAYS = [
  { month: 3, day: 12, note: 'Akşam: Mevlid Kandili' },
  { month: 7, day: 27, note: 'Akşam: Miraç Kandili' },
  { month: 8, day: 15, note: 'Akşam: Berat Kandili' },
  { month: 9, day: 27, note: 'Kadir Gecesi' },
  { month: 10, day: 1, note: 'Ramazan Bayramı' },
  { month: 12, day: 10, note: 'Kurban Bayramı' },
];

export function gregorianToHijri(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  const jdn =
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045;

  const l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const hMonth = Math.floor((24 * l3) / 709);
  const hDay = l3 - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  return { year: hYear, month: hMonth, day: hDay };
}

export function getTodayInfo(date = new Date()) {
  const hijri = gregorianToHijri(date);
  const weekday = WEEKDAYS[date.getDay()];
  const hijriLabel = `${hijri.day} ${HIJRI_MONTHS[hijri.month - 1]} · ${weekday}`;

  const special = SPECIAL_DAYS.find((s) => s.month === hijri.month && s.day === hijri.day);
  let specialNote = special ? special.note : null;

  if (!specialNote && date.getDay() === 5) {
    specialNote = 'Bugün Cuma · Salavat günü';
  }

  return { hijriLabel, specialNote };
}
