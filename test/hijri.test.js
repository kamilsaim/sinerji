import { describe, it, expect } from 'vitest';
import { gregorianToHijri, getTodayInfo } from '../src/lib/hijri.js';

describe('gregorianToHijri', () => {
  it('bilinen bir referans tarihi doğru çevirir (2000-01-01 -> 24 Ramazan 1420)', () => {
    expect(gregorianToHijri(new Date(2000, 0, 1))).toEqual({ year: 1420, month: 9, day: 24 });
  });

  it('2026-08-24 -> 10 Rebîülevvel 1448', () => {
    expect(gregorianToHijri(new Date(2026, 7, 24))).toEqual({ year: 1448, month: 3, day: 10 });
  });
});

describe('getTodayInfo', () => {
  it('sıradan bir günde hicri etiket üretir, özel not içermez', () => {
    const info = getTodayInfo(new Date(2026, 7, 24));
    expect(info.hijriLabel).toBe('10 Rebîülevvel · Pazartesi');
    expect(info.specialNote).toBeNull();
  });

  it('Mevlid Kandili gününü doğru tespit eder (2026-08-26)', () => {
    const info = getTodayInfo(new Date(2026, 7, 26));
    expect(info.hijriLabel).toBe('12 Rebîülevvel · Çarşamba');
    expect(info.specialNote).toBe('Akşam: Mevlid Kandili');
  });

  it('Miraç Kandili gününü doğru tespit eder (2026-01-16)', () => {
    const info = getTodayInfo(new Date(2026, 0, 16));
    expect(info.specialNote).toBe('Akşam: Miraç Kandili');
  });

  it('Berat Kandili gününü doğru tespit eder (2026-02-03)', () => {
    const info = getTodayInfo(new Date(2026, 1, 3));
    expect(info.specialNote).toBe('Akşam: Berat Kandili');
  });

  it("Kadir Gecesi'ni doğru tespit eder (2026-03-16)", () => {
    const info = getTodayInfo(new Date(2026, 2, 16));
    expect(info.specialNote).toBe('Kadir Gecesi');
  });

  it('kandil olmayan bir Cuma gününde hafif bir tavsiye gösterir (2026-08-28)', () => {
    const info = getTodayInfo(new Date(2026, 7, 28));
    expect(info.specialNote).toBe('Bugün Cuma · Salavat günü');
  });
});
