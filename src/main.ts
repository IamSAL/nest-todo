import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const port = process.env.PORT || 4000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('ToDos api')
    .setDescription('The Nest ToDo API')
    .setVersion('1.0')
    .addTag('tasks')
    .addTag('categories')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port).then(() => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
bootstrap();
