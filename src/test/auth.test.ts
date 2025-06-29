import { Request, Response, NextFunction } from 'express';
import {
  checkAuthHeader,
  checkToken,
  verifyAndAuthenticate,
} from '../middlewares/middleware_auth';
import { verifyJwt } from '../utils/jwt';
import { ErrEnum } from '../factory/error/error_enum';

// Mock oggetto errore restituito da ErrorFactory
const mockAppError = {
  getErrorResponse: () => ({
    status: 401,
    msg: 'Errore di autenticazione',
  }),
};

// Mock della funzione getError della classe ErrorFactory
const mockGetError = jest.fn(() => mockAppError);

// Mock di ErrorFactory e ErrEnum
jest.mock('../factory/error/error_factory', () => ({
  ErrorFactory: jest.fn().mockImplementation(() => ({
    getError: mockGetError,
  })),
}));

// Mock della funzione verifyJwt
jest.mock('../utils/jwt', () => ({
  verifyJwt: jest.fn(),
}));

describe('Auth Middlewares', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    mockNext = jest.fn();
    mockGetError.mockClear();
    (verifyJwt as jest.Mock).mockClear();
  });

  // ───────────────────────────────────────
  // ✅ checkAuthHeader
  // ───────────────────────────────────────
  describe('checkAuthHeader', () => {
    it('should call next() if Authorization header exists', () => {
      mockReq.headers = { authorization: 'Bearer token123' };

      checkAuthHeader(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockGetError).not.toHaveBeenCalled();
    });

    it('should call next(error) if Authorization header is missing', () => {
      mockReq.headers = {};

      checkAuthHeader(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockAppError);
      expect(mockGetError).toHaveBeenCalledWith(ErrEnum.MissingAuthHeader);
    });
  });

  // ───────────────────────────────────────
  // ✅ checkToken
  // ───────────────────────────────────────
  describe('checkToken', () => {
    it('should extract token and call next()', () => {
      mockReq.headers = { authorization: 'Bearer valid.token' };

      checkToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.token).toBe('valid.token');
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockGetError).not.toHaveBeenCalled();
    });

    it('should call next(error) if Authorization header is missing', () => {
      mockReq.headers = {};

      checkToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockAppError);
      expect(mockGetError).toHaveBeenCalledWith(ErrEnum.MissingToken);
    });
  });

  // ───────────────────────────────────────
  // ✅ verifyAndAuthenticate
  // ───────────────────────────────────────
  describe('verifyAndAuthenticate', () => {
    it('should decode token and attach user to req', () => {
      mockReq.token = 'valid.token';
      const mockPayload = { id: 'user123', role: 'ADMIN' };

      (verifyJwt as jest.Mock).mockReturnValue(mockPayload);

      verifyAndAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockGetError).not.toHaveBeenCalled();
    });

    it('should call next(error) if verifyJwt throws exception', () => {
      mockReq.token = 'bad.token';
      (verifyJwt as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid');
      });

      verifyAndAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockAppError);
      expect(mockGetError).toHaveBeenCalledWith(ErrEnum.InvalidToken);
    });

    it('should call next(error) if verifyJwt returns null', () => {
      mockReq.token = 'expired.token';
      (verifyJwt as jest.Mock).mockReturnValue(null);

      verifyAndAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockAppError);
      expect(mockGetError).toHaveBeenCalledWith(ErrEnum.InvalidToken);
    });
  });
});
