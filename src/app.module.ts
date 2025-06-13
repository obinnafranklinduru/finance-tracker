import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BudgetsModule } from './budgets/budgets.module';
import { GoalsModule } from './goals/goals.module';
import { CommonModule } from './common/common.module';
import DBConfig from './common/ormconfig';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database configuration
    TypeOrmModule.forRoot(DBConfig),

    // Feature modules
    AuthModule,
    UsersModule,
    CategoriesModule,
    AccountsModule,
    TransactionsModule,
    BudgetsModule,
    GoalsModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
