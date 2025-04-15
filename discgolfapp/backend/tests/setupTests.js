// Mock environment variables for tests
process.env.SECRET_OR_KEY = 'test-secret';
process.env.MONGO_URI = 'mongodb://localhost:27017/testdb'; // Mock MongoDB URI for tests
process.env.PORT = '3000'; // Mock PORT for tests

// Refine mongoose mock to include schema.index
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(() => console.log('Mock MongoDB connected')),
    connection: {
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn(),
    },
    model: jest.fn((name, schema) => ({
      name,
      schema,
      find: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    })),
    Schema: class MockSchema {
      static Types = {
        ObjectId: jest.fn(),
      };
      constructor(definition) {
        this.definition = definition;
      }
      index() {
        return jest.fn();
      }
    },
  };
});

