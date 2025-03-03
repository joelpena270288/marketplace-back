import { Module } from '@nestjs/common';
import { Configuration } from './config/config.keys';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VisionModule } from './modules/vision/vision.module';
import { MisionModule } from './modules/mision/mision.module';
import { PromosionModule } from './modules/promosion/promosion.module';
import { NoticiaModule } from './modules/noticia/noticia.module';
import { MailModule } from './modules/mail/mail.module';
import { VerificationCodeModule } from './modules/verification-code/verification-code.module';
import { TiendaVirtualModule } from './modules/tienda-virtual/tienda-virtual.module';
import { EmpresaServicioModule } from './modules/empresa-servicio/empresa-servicio.module';
import { ProductosModule } from './modules/productos/productos.module';
import { ServiciosModule } from './modules/servicios/servicios.module';
import { PlanModule } from './modules/plan/plan.module';
@Module({
  imports: [ConfigModule, RoleModule, AuthModule, UsersModule, VisionModule, MisionModule, PromosionModule, NoticiaModule, MailModule, VerificationCodeModule, TiendaVirtualModule, EmpresaServicioModule, ProductosModule, ServiciosModule, PlanModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number | string;
  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(Configuration.PORT);
  }
}
