/**
 * Configuration des tests Jest
 */

// Mock des APIs du navigateur qui ne sont pas disponibles dans Jest
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now())
  }
});

// Mock de console.error pour éviter les logs pendant les tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Mock des variables d'environnement
process.env.NODE_ENV = 'test';