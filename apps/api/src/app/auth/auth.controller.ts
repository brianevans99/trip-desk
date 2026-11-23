import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('github')
  async github(
    @Body() body: { code: string; codeVerifier: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.signInWithGitHub(body.code, body.codeVerifier);
    res.cookie('session', user.id, {
      httpOnly: true,   // JavaScript can't read it, so XSS can't steal it
      signed: true,     // tamper-proof, signed with SESSION_SECRET
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { id: user.id, login: user.login, avatarUrl: user.avatarUrl };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('session');
    return { ok: true };
  }
}
