import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VerificationService } from './verification-code.service';

@Controller('verification-code')
export class VerificationCodeController {
  constructor(private readonly verificationCodeService: VerificationService) {}

  @Post('validate-code')
  async validateCode(@Body() { email, code }: { email: string; code: string }) {
    const isValid = await this.verificationCodeService.validateCode(
      email,
      code,
    );
    if (!isValid) {
      return { success: false, message: 'Código incorrecto' };
    }
    await this.verificationCodeService.removeCode(email);
    return { success: true, message: 'Código válido' };
  }
}
