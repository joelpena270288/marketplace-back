import * as fs from 'fs';
import { parse } from 'dotenv';
export class ConfigService {
  private readonly envConfig: { [key: string]: string };
  constructor() {
    const isDevelomentEnv = process.env.NODE_ENV !== 'production';
    if (isDevelomentEnv) {
      const envFilePath = __dirname + '/../../.env';
      const existsPath = fs.existsSync(envFilePath);
      if (!existsPath) {
        console.log('.env file does not exist');
        process.exit(0);
      }
      this.envConfig = parse(fs.readFileSync(envFilePath));
    } else {
      this.envConfig = {
        PORT: process.env.PORT ?? '80',
      };
    }
  }
  get(key: string): string {
    return this.envConfig[key];
  }
}
