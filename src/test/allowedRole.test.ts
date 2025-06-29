import { Request, Response, NextFunction } from 'express';
import { authorizeRole } from '../middlewares/middleware_auth';
import { UserRole } from '../enum/userRole';
import { ErrEnum } from '../factory/error/error_enum';

// Mock centralizzato dell'oggetto di errore ritornato da ErrorFactory
const mockAppError = {
  getErrorResponse: () => ({
    status: 401,
    msg: 'Unauthorized',
  }),
};

// Mock della funzione getError della classe ErrorFactory
const mockGetError = jest.fn(() => mockAppError);

// Mock dell'intero modulo ErrorFactory, inclusi la classe e l'enum
jest.mock('../factory/error/error_factory', () => ({
  ErrorFactory: jest.fn().mockImplementation(() => ({
    getError: mockGetError,
  })),
  ErrEnum: {
    Unauthorized: 'Unauthorized',
  },
}));

describe('Middleware: authorizeRole', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockNext = jest.fn();            // Reset del mock della funzione next()
    mockReq = {};                    // Reset della request mock
    mockRes = {};                    // Reset della response mock
    mockGetError.mockClear();        // Pulisce lo stato del mock getError
  });

  it('should call next() when user has a valid role (single allowed role)', () => {
    mockReq.user = { id: '1', role: UserRole.ADMIN };

    const middleware = authorizeRole(UserRole.ADMIN);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockGetError).not.toHaveBeenCalled();
  });

  it('should call next() when user has one of multiple allowed roles', () => {
    mockReq.user = { id: '2', role: UserRole.USER };

    const middleware = authorizeRole(UserRole.ADMIN, UserRole.USER);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockGetError).not.toHaveBeenCalled();
  });

  it('should call next(error) when user role is not included in allowed roles', () => {
    mockReq.user = { id: '3', role: 'UNKNOWN_ROLE' as UserRole };

    const middleware = authorizeRole(UserRole.ADMIN, UserRole.USER);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockAppError);
    expect(mockGetError).toHaveBeenCalledWith(ErrEnum.Unauthorized);
  });

  it('should call next(error) when user is not present on request object', () => {
    mockReq.user = undefined;

    const middleware = authorizeRole(UserRole.ADMIN);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockAppError);
    expect(mockGetError).toHaveBeenCalledWith(ErrEnum.Unauthorized);
  });

  it('should not invoke getError when access is authorized', () => {
    mockReq.user = { id: '4', role: UserRole.ADMIN };

    const middleware = authorizeRole(UserRole.ADMIN);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockGetError).not.toHaveBeenCalled();
  });
});
