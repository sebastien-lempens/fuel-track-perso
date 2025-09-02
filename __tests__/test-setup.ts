// This file is used to set up the test environment.
// It mocks the global localStorage object so that tests don't interact
// with the actual browser storage, making them independent and reliable.
// This file should be imported in tests that interact with localStorage,
// or configured in jest.config.js via setupFilesAfterEnv.

// Import jest-dom matchers like .toBeInTheDocument()
import '@testing-library/jest-dom';

export const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key(index: number) {
        const keys = Object.keys(store);
        return keys[index] || null;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
