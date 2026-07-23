import { describe, expect, it } from 'vitest';
import { MODULE_NAME, placeholder } from '../src/index.js';

describe('review-loop scaffold', () => {
  it('exposes its module name', () => {
    expect(MODULE_NAME).toBe('review-loop');
  });

  it('placeholder returns a string', () => {
    expect(typeof placeholder()).toBe('string');
  });
});
