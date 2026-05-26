import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// jsdom stubs for APIs not implemented in the test environment

const intersectionObserverMock = () => ({
  observe: () => undefined,
  unobserve: () => undefined,
  disconnect: () => undefined,
});
window.IntersectionObserver = vi.fn().mockImplementation(intersectionObserverMock);

// framer-motion uses matchMedia for prefers-reduced-motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
