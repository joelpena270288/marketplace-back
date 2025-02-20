import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:9000',
        'http://another-allowed-origin.com',
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Permite el origen
      } else {
        callback(new Error('No permitido por CORS')); // Rechaza el origen
      }
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('API Title')
    .setDescription('API Description for testing purpose.')
    .setVersion('1.0')
    .addTag('example')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
