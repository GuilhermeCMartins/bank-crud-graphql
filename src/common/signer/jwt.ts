import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { ISigner } from './signer';
import 'dotenv/config';

export class JWTSigner implements ISigner {
  private clientSecret: string;

  constructor() {
    this.clientSecret = process.env.JWT_SECRET as string;
  }

  sign(data: Record<string, unknown>): string {
    const encodedHeaderToken = jwt.sign(data, this.clientSecret, {
      algorithm: 'HS256',
      header: {
        typ: 'JWT',
        alg: 'HS256',
      },
    });

    return encodedHeaderToken;
  }

  decode(
    token: string,
    verifySignature = false
  ): Record<string, unknown> | null {
    try {
      if (verifySignature) {
        return jwt.verify(token, this.clientSecret, {
          algorithms: ['HS256'],
        }) as Record<string, unknown>;
      }

      return jwt.decode(token) as Record<string, unknown>;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  md5(data: string): string {
    return crypto.createHash('md5').update(data).digest('hex');
  }
}
