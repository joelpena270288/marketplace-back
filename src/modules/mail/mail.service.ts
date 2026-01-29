import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { VerificationService } from '../verification-code/verification-code.service';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class MailService {
  private transporter: { sendMail: (opts: any) => Promise<any> };
  private mailConfigured = false;

  constructor(
    private verificationCode: VerificationService,
    private configService: ConfigService,
  ) {
    // Read mail config from environment via ConfigService
    const host = this.configService.get('MAIL_HOST') || 'smtp.gmail.com';
    const port = Number(this.configService.get('MAIL_PORT')) || 465;
    const secure = (this.configService.get('MAIL_SECURE') || 'true') === 'true';
    const user = this.configService.get('MAIL_USER') || '';
    const pass = this.configService.get('MAIL_PASS') || '';
    // Create transporter (if MAIL_USER/PASS present). Otherwise we'll use a test account at send time.
    const hasCredentials = !!(user && pass);
    this.mailConfigured = hasCredentials;
    this.transporter = (
      nodemailer as unknown as {
        createTransport: (opts: any) => {
          sendMail: (opts: any) => Promise<any>;
        };
      }
    ).createTransport({
      host,
      port,
      secure,
      auth: hasCredentials ? { user, pass } : undefined,
    });

    // Log mode (do not print credentials)
    if (this.mailConfigured) {
      console.log(
        'MailService: SMTP mail configured; using MAIL_USER from env',
      );
    } else {
      console.log(
        'MailService: No SMTP credentials configured — will use Ethereal test account at first send',
      );
    }
  }

  async sendVerificationCode(email: string): Promise<string> {
    const code = await this.verificationCode.generateCode(email);
    const from =
      this.configService.get('MAIL_FROM') ||
      this.configService.get('MAIL_USER') ||
      'no-reply@example.com';
    const mailOptions = {
      from,
      to: email,
      subject: 'Código de Verificación',
      text: `Tu código de verificación es: ${code}`,
    };

    try {
      if (!this.transporter) {
        throw new Error('Mail transporter not configured');
      }
      // If no real mail credentials are configured, create a test account (Ethereal) for dev/testing
      if (!this.mailConfigured) {
        /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
        const testAccount = await (nodemailer as any).createTestAccount();
        this.transporter = (
          nodemailer as unknown as {
            createTransport: (opts: any) => {
              sendMail: (opts: any) => Promise<any>;
            };
          }
        ).createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        const info = await this.transporter.sendMail(mailOptions);
        const preview = (nodemailer as any).getTestMessageUrl(info);
        console.log('Preview URL (Ethereal):', preview);
        /* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
        return code;
      }

      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      // Provide actionable error message for common SMTP auth failures
      const message = err instanceof Error ? err.message : String(err);
      console.error('Mail send error:', message);
      throw new InternalServerErrorException(
        'Could not send verification email. Check mail configuration.',
      );
    }

    return code;
  }
}
