import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';


@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-code')
  async sendCode(@Body('email') email: string) {
    const code = await this.mailService.sendVerificationCode(email);
    return { message: 'Código enviado', code: code };
  }

 
}
