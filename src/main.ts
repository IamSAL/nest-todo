import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';
const port = process.env.PORT || 4000;
async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ToDos api')
    .setDescription('The Nest ToDo API')
    .setVersion('1.0')
    .addTag('tasks')
    .addTag('categories')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: '*', // Allow requests from any origin
  });
  await app.listen(port).then(() => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
bootstrap();
