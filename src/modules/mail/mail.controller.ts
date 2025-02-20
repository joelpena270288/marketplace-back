import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';


@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-code')
  async sendCode(@Body('email') email: string) {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString(); // Código de 6 dígitos
    await this.mailService.sendVerificationCode(email, verificationCode);
    return { message: 'Código enviado', code: verificationCode };
  }

 
}
