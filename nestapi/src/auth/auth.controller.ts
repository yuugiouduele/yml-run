import { Controller, Post, Body, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { TwoFactorService } from './twofactor.service';
import { MailService } from './mail.service';
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';

class Enable2FADto {
  email: string;
}

class Verify2FADto {
  email: string;
  token: string;
}

class SendEmailDto {
  email: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly twoFactorService: TwoFactorService,
    private readonly mailService: MailService,
  ) {}


  @Post('2fa/generate')
  @ApiOperation({ summary: '2FAシークレット生成とQRコード取得' })
  async generate2FA(@Body() dto: Enable2FADto) {
    const { secret, otpauthUrl } = this.twoFactorService.generateSecret(dto.email);
    const qrCode = await this.twoFactorService.generateQrCode(otpauthUrl);
    // ここでsecretはDBに保存する想定
    return { secret, qrCode };
  }

  @Post('2fa/verify')
  @ApiOperation({ summary: '2FAトークン検証' })
  @HttpCode(HttpStatus.OK)
  verify2FA(@Body() dto: Verify2FADto) {
    // DBから対応するsecretを取得して検証する想定
    // 例: const secret = this.userService.getSecret(dto.email);
    // 今回は仮に入力dtoにsecretを含めるケースなど
    const isValid = this.twoFactorService.verifyToken(dto.token, 'ユーザーのsecretをここに入れる');
    if (!isValid) {
      return { success: false, message: '無効なトークンです' };
    }
    return { success: true };
  }

  @Post('send-verification-email')
  @ApiOperation({ summary: '認証メール送信' })
  async sendVerificationEmail(@Body() dto: SendEmailDto) {
    // DBで生成したトークンを用意する想定。ここでは仮トークンを送る例
    const token = 'your-random-token';
    await this.mailService.sendVerificationEmail(dto.email, token);
    return { message: '確認メールを送信しました' };
  }

  // TypeORM exampl

  @Get('verify-email')
  @ApiOperation({ summary: 'メール認証のリンク受け取り' })
  async verifyEmail(@Query('token') token: string) {
    // DBに保存されているトークンで検証
    if (token !== 'your-random-token') {
      return { verified: false, message: 'トークンが無効です' };
    }
    // メール認証完了としてDBを更新など
    return { verified: true, message: 'メール認証が完了しました' };
  }
}
