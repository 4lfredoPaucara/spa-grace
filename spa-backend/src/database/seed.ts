import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { runAllSeeders } from '../database/seeders';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get<DataSource>(getDataSourceToken());

  try {
    await runAllSeeders(dataSource);
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
