import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface GitHubTokenResponse {
  access_token?: string;
  error?: string;
}

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signInWithGitHub(code: string, codeVerifier: string) {
    // 1. Trade code + verifier (+ secret) for a GitHub access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        code_verifier: codeVerifier,
        redirect_uri: `${process.env.WEB_ORIGIN}/auth/callback`,
      }),
    });
    const token = (await tokenRes.json()) as GitHubTokenResponse;
    if (!token.access_token) throw new UnauthorizedException(token.error ?? 'GitHub sign-in failed');

    // 2. Ask GitHub who this is
    const ghRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token.access_token}`, Accept: 'application/vnd.github+json' },
    });
    if (!ghRes.ok) throw new UnauthorizedException('Could not read GitHub profile');
    const gh = (await ghRes.json()) as GitHubUser;

    // 3. Create or update our User row
    return this.prisma.user.upsert({
      where: { githubId: gh.id },
      create: { githubId: gh.id, login: gh.login, name: gh.name, avatarUrl: gh.avatar_url },
      update: { login: gh.login, name: gh.name, avatarUrl: gh.avatar_url },
    });
  }
}
