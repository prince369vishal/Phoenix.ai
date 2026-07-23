import { describe, expect, it } from 'vitest';
import { MODULE_NAME, placeholder } from '../src/index.js';

describe('ingestion-connectors scaffold', () => {
  it('exposes its module name', () => {
    expect(MODULE_NAME).toBe('ingestion-connectors');
  });

  it('placeholder returns a string', () => {
    expect(typeof placeholder()).toBe('string');
  });
});
