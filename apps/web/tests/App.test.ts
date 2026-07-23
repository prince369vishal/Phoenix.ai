import { describe, expect, it } from 'vitest';
import { App } from '../src/App.js';

describe('App', () => {
  it('is a function component', () => {
    expect(typeof App).toBe('function');
  });
});
