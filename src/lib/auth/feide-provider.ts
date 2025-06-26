import { OAuth2Client } from "arctic";

const authorizeEndpoint = "https://auth.dataporten.no/oauth/authorization";
const tokenEndpoint = "https://auth.dataporten.no/oauth/token";

export interface FeideTokens {
  accessToken: string;
  tokenType: string;
  expiresAt: Date;
  scope: string;
}

export class Feide {
  private client: OAuth2Client;

  constructor(
    clientId: string,
    clientSecret: string,
    options?: {
      redirectURI?: string;
    },
  ) {
    this.client = new OAuth2Client(clientId, clientSecret, options?.redirectURI ?? null);
  }

  public async createAuthorizationURL(
    state: string,
    options?: {
      scopes?: string[];
    },
  ): Promise<URL> {
    return this.client.createAuthorizationURL(authorizeEndpoint, state, options?.scopes ?? []);
  }

  public async validateAuthorizationCode(code: string): Promise<FeideTokens> {
    const result = await this.client.validateAuthorizationCode(tokenEndpoint, code, null);

    const tokens: FeideTokens = {
      accessToken: result.accessToken(),
      tokenType: result.tokenType(),
      expiresAt: result.accessTokenExpiresAt(),
      scope: result.scopes().join(" "),
    };

    return tokens;
  }
}
