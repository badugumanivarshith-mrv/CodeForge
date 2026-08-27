import { AccessTokenPayload as TokenPayload } from '../core/utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      requestId?: string;
    }
  }
}

export {};
