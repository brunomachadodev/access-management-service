import { NestFactory } from '@nestjs/core';
import { OpenAPIObject } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as swaggerUi from 'swagger-ui-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    const swaggerYaml: string = fs.readFileSync('./swagger.yaml', 'utf8');
    const swaggerDocument = yaml.load(swaggerYaml) as OpenAPIObject;

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (e) {
    console.warn('Could not load swagger.yaml', e);
  }

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
