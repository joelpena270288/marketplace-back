import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VerificationCode } from './entities/verification-code.entity';

@Injectable()
export class VerificationService {
  constructor(
    @Inject('VERIFICATIONCODE_REPOSITORY')
    private verificationRepo: Repository<VerificationCode>,
  ) {}

  async generateCode(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.verificationRepo.save({ email, code });
    return code;
  }

  async validateCode(email: string, code: string): Promise<boolean> {
    const record = await this.verificationRepo.findOne({
      where: { email, code },
    });
    return !!record;
  }

  async removeCode(email: string) {
    await this.verificationRepo.delete({ email });
  }
}