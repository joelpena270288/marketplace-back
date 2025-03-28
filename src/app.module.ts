import { Module } from '@nestjs/common';
import { Configuration } from './config/config.keys';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MailModule } from './modules/mail/mail.module';
import { VerificationCodeModule } from './modules/verification-code/verification-code.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/message/message.module';
import { CommentModule } from './modules/comment/comment.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { ComunityPostModule } from './modules/comunity-post/comunity-post.module';
import { LogModule } from './modules/log/log.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    RoleModule,
    AuthModule,
    UsersModule,

    MailModule,
    VerificationCodeModule,
    ChatModule,
    MessageModule,
   
    CommentModule,
    ProductModule,
    OrderModule,
    ComunityPostModule,
    LogModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number | string;
  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(Configuration.PORT);
  }
}
