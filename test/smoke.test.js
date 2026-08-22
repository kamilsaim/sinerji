// test/smoke.test.js
import { describe, it, expect } from 'vitest';
import { APP_NAME } from '../src/lib/constants.js';

describe('proje iskeleti', () => {
  it('APP_NAME sabitini dışa aktarır', () => {
    expect(APP_NAME).toBe('Sinerji');
  });
});
