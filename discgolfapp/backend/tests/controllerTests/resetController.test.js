import { resetTestData } from '../../src/controllers/resetController.js';
import * as resetService from '../../src/services/resetService.js';

jest.mock('../../src/services/resetService.js');

// Mock console.error to suppress error logs during tests
jest.spyOn(console, 'error').mockImplementation(() => {});

/**
 * @author Lars Andreas Strand
 * @description This test file contains unit tests for the resetController module.
 * Copilot was used to generate the initial test cases and the initial structure of the tests.
 * The author has modified some mocks and added comments to the code.
 */

describe('resetController', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: '123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reset test data and return 200 if user is authenticated', async () => {
    resetService.resetTestData.mockResolvedValueOnce();

    await resetTestData(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Test data reset successfully' });
    expect(resetService.resetTestData).toHaveBeenCalledWith(req.user.id);
  });

  it('should return 500 if an error occurs', async () => {
    resetService.resetTestData.mockRejectedValueOnce(new Error('Test error'));

    await resetTestData(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    expect(resetService.resetTestData).toHaveBeenCalledWith(req.user.id);
  });

  it('should return 403 if user is not authenticated', async () => {
    req.user = null;

    await resetTestData(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    expect(resetService.resetTestData).not.toHaveBeenCalled();
  });
});
