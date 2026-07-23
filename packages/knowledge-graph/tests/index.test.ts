import { describe, expect, it } from 'vitest';
import { MODULE_NAME, placeholder } from '../src/index.js';

describe('knowledge-graph scaffold', () => {
  it('exposes its module name', () => {
    expect(MODULE_NAME).toBe('knowledge-graph');
  });

  it('placeholder returns a string', () => {
    expect(typeof placeholder()).toBe('string');
  });
});
