import { describe, expect, it } from 'vitest';
import { MODULE_NAME, placeholder } from '../src/index.js';

describe('gap-analysis scaffold', () => {
  it('exposes its module name', () => {
    expect(MODULE_NAME).toBe('gap-analysis');
  });

  it('placeholder returns a string', () => {
    expect(typeof placeholder()).toBe('string');
  });
});
