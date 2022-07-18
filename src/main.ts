import { ExceptionEnterceptor } from '@core/interceptors/exception.interceptor';
import { FilterQueryPipe } from '@core/pipe/filter-query.pipe';
import { SortQueryPipe } from '@core/pipe/sort-query.pipe';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { APIPrefix } from './constants/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix(APIPrefix.Version);
  app.enableCors();
  app.useGlobalPipes(new SortQueryPipe());
  app.useGlobalPipes(new FilterQueryPipe());
  app.useGlobalInterceptors(new ExceptionEnterceptor());
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'));

  await app.listen(8080);
}
bootstrap();
