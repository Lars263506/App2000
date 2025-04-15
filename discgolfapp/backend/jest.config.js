export default {
    transform: {
      '^.+\\.js$': 'babel-jest', // Bruk Babel for å transformere moderne JavaScript
    },
    testEnvironment: 'node', // Angi testmiljøet som Node.js
  };
