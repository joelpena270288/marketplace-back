import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { VerificationService } from '../verification-code/verification-code.service';

@Injectable()
export class MailService {
  constructor(private verificationCode: VerificationService){}
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true para 465, false para otros puertos
    // service: 'gmail', // Usa Gmail, SMTP u otro servicio
    auth: {
      user: 'joelpenagonzalez122@gmail.com', // Configura tu correo
      pass: 'slvx pjqj swwv ubcf*', // Usa una contraseña segura o App Password
      //pass: 'Yoslaidy2506*'
    },
  });

  async sendVerificationCode(email: string): Promise<string> {
    const code = await this.verificationCode.generateCode(email);
    const mailOptions = {
      from: 'joelpenagonzalez122@gmail.com>',
      to: email,
      subject: 'Código de Verificación',
      text: `Tu código de verificación es: ${code}`,
    };

    // await this.transporter.sendMail(mailOptions);
    return code;
  }
}
