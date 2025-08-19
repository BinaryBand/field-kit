// src/setupTests.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import 'whatwg-fetch';

// Mock `window.location` for this specific suite
const mockLocationAssign = vi.fn();
const mockLocationReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    assign: mockLocationAssign,
    reload: mockLocationReload,
  },
  writable: true,
});

// Create a mock class for MutationObserver
const mockMutationObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(),
}));

vi.spyOn(window, 'MutationObserver').mockImplementation(mockMutationObserver);

const mockFetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
    ok: true,
    type: 'basic',
    url: 'http://localhost/success',
  } as Response)
);

vi.spyOn(global, 'fetch').mockImplementation(mockFetch);
