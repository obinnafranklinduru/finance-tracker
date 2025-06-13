import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseSeederService } from './common/seeders/database-seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seederService = app.get(DatabaseSeederService);

  try {
    await seederService.seedAll();
    console.log('\n🎯 Seeding completed successfully!');
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
