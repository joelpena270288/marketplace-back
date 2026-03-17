import { Injectable } from '@nestjs/common';

interface ConfigData {
  mission: string;
  vision: string;
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private config: ConfigData = {
    mission: 'Nuestra misión es proporcionar la mejor experiencia de compra en línea',
    vision: 'Ser la plataforma de e-commerce líder en Latinoamérica',
  };

  getConfig(key: string) {
    return {
      key,
      content: this.config[key] || '',
    };
  }

  updateConfig(key: string, content: string) {
    this.config[key] = content;
    return {
      key,
      content: this.config[key],
      message: `${key} actualizado correctamente`,
    };
  }

  getAllConfig() {
    return this.config;
  }
}
