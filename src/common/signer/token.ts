import type { JWTSigner } from './jwt';

export interface AuthTokenPayload {
  userId: string;
  tenantId: string;
  email: string;
}

export class AuthTokenService {
  private jwtSigner: JWTSigner;
  private tokenExpiry: string;

  constructor(jwtSigner: JWTSigner, tokenExpiry = '1h') {
    this.jwtSigner = jwtSigner;
    this.tokenExpiry = tokenExpiry;
  }

  generateToken(payload: AuthTokenPayload): string {
    const data = {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + this.getExpiryInSeconds(),
    };

    return this.jwtSigner.sign(data);
  }

  parseToken(token: string): AuthTokenPayload | null {
    const decoded = this.jwtSigner.decode(
      token,
      true
    ) as AuthTokenPayload | null;
    if (!decoded) {
      console.error('Failed to parse token or token is invalid');
    }
    return decoded;
  }

  private getExpiryInSeconds(): number {
    const unit = this.tokenExpiry.slice(-1);
    const value = Number.parseInt(this.tokenExpiry.slice(0, -1));

    switch (unit) {
      case 'h':
        return value * 3600;
      case 'm':
        return value * 60;
      default:
        return value;
    }
  }
}
