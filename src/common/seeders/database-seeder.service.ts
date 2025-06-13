import { Injectable } from '@nestjs/common';
import { CategorySeederService } from './category-seeder.service';

@Injectable()
export class DatabaseSeederService {
  constructor(private readonly categorySeederService: CategorySeederService) {}

  async seedAll(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    try {
      // Seed default categories
      await this.categorySeederService.seedDefaultCategories();

      console.log('✅ Database seeding completed successfully!');

      // Print summary
      await this.printSeedingSummary();
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  private async printSeedingSummary(): Promise<void> {
    console.log('\n📊 Seeding Summary:');
    console.log('==================');

    const categoriesCount =
      await this.categorySeederService.getDefaultCategoriesCount();
    console.log(`📂 Default Categories: ${categoriesCount}`);

    console.log('\n🎉 Your Financial Tracker API is ready to use!');
    console.log(
      '💡 Users can now register and start tracking their finances with pre-configured categories.',
    );
  }
}
