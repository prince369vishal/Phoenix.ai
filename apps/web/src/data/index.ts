import type { OkfDataProvider } from './types.js';
import { mockProvider } from './mock/mockProvider.js';
import { apiProvider } from './api/apiProvider.js';

// Single switch between the two implementations. Everything in src/pages
// and src/components consumes `dataProvider` and never imports mock/api
// modules directly, so flipping this env var is the only change needed to
// go from a standalone demo to the full-stack app.
const source = import.meta.env.VITE_DATA_SOURCE ?? 'mock';

export const dataProvider: OkfDataProvider = source === 'api' ? apiProvider : mockProvider;

export * from './types.js';
