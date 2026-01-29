import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Validate mail configuration in production: require MAIL_USER and MAIL_PASS
  try {
    const configService = app.get(ConfigService);
    const nodeEnv = process.env.NODE_ENV || 'development';
    const mailUser = configService.get('MAIL_USER');
    const mailPass = configService.get('MAIL_PASS');
    if (nodeEnv === 'production' && (!mailUser || !mailPass)) {
      console.error(
        'MAIL_USER and MAIL_PASS must be set in production. Aborting startup.',
      );
      process.exit(1);
    }
    // Log whether mail configured (do not print secrets)
    if (mailUser && mailPass) {
      console.log('Startup: MAIL configured (SMTP)');
    } else {
      console.log(
        'Startup: MAIL not configured — using Ethereal test account for dev',
      );
    }
  } catch (e) {
    // If ConfigService not available, skip checks (fallback)
    console.warn(
      'Startup: could not access ConfigService for mail validation',
      e instanceof Error ? e.message : e,
    );
  }
  // CORS configuration
  // Configure allowed origins via environment variable CORS_ORIGINS (coma-separados)
  // Example: CORS_ORIGINS=http://localhost:3000,http://localhost:4200
  const rawOrigins = process.env.CORS_ORIGINS || '*';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const credentials = (process.env.CORS_CREDENTIALS ?? 'true') === 'true';

  app.enableCors({
    origin: (origin, callback) => {
      // If no origin (server-to-server or same-origin), allow
      if (!origin) return callback(null, true);

      // If wildcard is configured, allow all origins
      if (allowedOrigins.includes('*')) return callback(null, true);

      // Allow if the origin is explicitly in the list
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Otherwise reject
      return callback(new Error('No permitido por CORS'));
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept, X-Requested-With',
    credentials,
  });
  const config = new DocumentBuilder()
    .setTitle('API Title')
    .setDescription('API Description for testing purpose.')
    .setVersion('1.0')
    .addTag('example')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // parse cookies so we can read HttpOnly refresh tokens
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use((cookieParser as any)());
  await app.listen(process.env.PORT ?? 3000);
}
// start app bootstrap; intentionally not awaited at top-level
void bootstrap();
