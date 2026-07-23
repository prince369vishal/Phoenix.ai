import { describe, expect, it } from 'vitest';
import { radialLayout } from '../src/lib/radial-layout.js';

describe('radialLayout', () => {
  it('places the hub at the origin', () => {
    const positions = radialLayout(['a', 'b', 'c'], 'a');
    expect(positions.a).toEqual({ x: 0, y: 0 });
  });

  it('returns a distinct position for every node', () => {
    const ids = ['hub', 'n1', 'n2', 'n3', 'n4'];
    const positions = radialLayout(ids, 'hub');
    const keys = Object.keys(positions);
    expect(keys.sort()).toEqual([...ids].sort());
  });
});
