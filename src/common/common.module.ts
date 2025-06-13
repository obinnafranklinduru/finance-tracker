import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialAnalyticsService } from './financial-analytics/financial-analytics.service';
import { FinancialAnalyticsController } from './financial-analytics/financial-analytics.controller';
import { CategorySeederService } from './seeders/category-seeder.service';
import { DatabaseSeederService } from './seeders/database-seeder.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { AccountsModule } from '../accounts/accounts.module';
import { BudgetsModule } from '../budgets/budgets.module';
import { GoalsModule } from '../goals/goals.module';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    TransactionsModule,
    AccountsModule,
    BudgetsModule,
    GoalsModule,
  ],
  controllers: [FinancialAnalyticsController],
  providers: [
    FinancialAnalyticsService,
    CategorySeederService,
    DatabaseSeederService,
  ],
  exports: [FinancialAnalyticsService, DatabaseSeederService],
})
export class CommonModule {}
