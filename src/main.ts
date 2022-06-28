import { ExceptionEnterceptor } from '@core/interceptors/exception.interceptor';
import { FilterQueryPipe } from '@core/pipe/filter-query.pipe';
import { SortQueryPipe } from '@core/pipe/sort-query.pipe';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APIPrefix } from './constants/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(APIPrefix.Version);
  app.enableCors();
  app.useGlobalPipes(new SortQueryPipe());
  app.useGlobalPipes(new FilterQueryPipe());
  app.useGlobalInterceptors(new ExceptionEnterceptor());
  await app.listen(8080);
}
bootstrap();
