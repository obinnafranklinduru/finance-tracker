import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { FinancialAnalyticsService } from './financial-analytics.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@ApiTags('Financial Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FinancialAnalyticsController {
  constructor(
    private readonly financialAnalyticsService: FinancialAnalyticsService,
  ) {}

  @Get('health-metrics')
  @ApiOperation({ summary: 'Get comprehensive financial health metrics' })
  @ApiResponse({
    status: 200,
    description: 'Financial health metrics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFinancialHealthMetrics(@CurrentUser() user: User) {
    return await this.financialAnalyticsService.getFinancialHealthMetrics(
      user.id,
    );
  }

  @Get('expense-analysis')
  @ApiOperation({ summary: 'Get detailed expense analysis' })
  @ApiQuery({ name: 'startDate', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2024-12-31' })
  @ApiResponse({
    status: 200,
    description: 'Expense analysis retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getExpenseAnalysis(
    @CurrentUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.financialAnalyticsService.getExpenseAnalysis(
      user.id,
      startDate,
      endDate,
    );
  }

  @Get('income-analysis')
  @ApiOperation({ summary: 'Get detailed income analysis' })
  @ApiQuery({ name: 'startDate', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2024-12-31' })
  @ApiResponse({
    status: 200,
    description: 'Income analysis retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getIncomeAnalysis(
    @CurrentUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.financialAnalyticsService.getIncomeAnalysis(
      user.id,
      startDate,
      endDate,
    );
  }

  @Get('budget-analysis')
  @ApiOperation({ summary: 'Get detailed budget analysis' })
  @ApiResponse({
    status: 200,
    description: 'Budget analysis retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBudgetAnalysis(@CurrentUser() user: User) {
    return await this.financialAnalyticsService.getBudgetAnalysis(user.id);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get comprehensive dashboard data' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDashboardData(@CurrentUser() user: User) {
    const [healthMetrics, expenseAnalysis, incomeAnalysis, budgetAnalysis] =
      await Promise.all([
        this.financialAnalyticsService.getFinancialHealthMetrics(user.id),
        this.financialAnalyticsService.getExpenseAnalysis(user.id),
        this.financialAnalyticsService.getIncomeAnalysis(user.id),
        this.financialAnalyticsService.getBudgetAnalysis(user.id),
      ]);

    return {
      healthMetrics,
      expenseAnalysis,
      incomeAnalysis,
      budgetAnalysis,
    };
  }
}
