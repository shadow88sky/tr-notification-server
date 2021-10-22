import path from 'path';
import heapdump from 'heapdump';

function showMemory() {
  heapdump.writeSnapshot(
    path.join(__dirname, '../heapdump/') + Date.now() + '.heapsnapshot',
  );
}

import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ValidationPipe } from './pipes/validation.pipe';
import { TrimStringsPipe } from './modules/common/transformer/trim-strings.pipe';
import { AppModule } from './modules/main/app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new TrimStringsPipe(), new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3000);

  // debug
  showMemory();
  setInterval(showMemory, 1000 * 60 * 60); //每小时输出一次
}
bootstrap();
