export interface Point {
  x: number;
  y: number;
}

/**
 * Places `hubId` at the center and spreads the remaining nodes evenly
 * around it on a circle. Good enough for a demo's hub-and-spoke style
 * diagrams without pulling in a full graph-layout dependency (e.g. dagre).
 */
export function radialLayout(ids: string[], hubId: string, radius = 300): Record<string, Point> {
  const positions: Record<string, Point> = { [hubId]: { x: 0, y: 0 } };
  const others = ids.filter((id) => id !== hubId);
  const step = (2 * Math.PI) / Math.max(others.length, 1);

  others.forEach((id, i) => {
    const angle = i * step - Math.PI / 2;
    positions[id] = {
      x: Math.round(radius * Math.cos(angle)),
      y: Math.round(radius * Math.sin(angle) * 0.75),
    };
  });

  return positions;
}
