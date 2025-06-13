import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../../transactions/transactions.service';
import { AccountsService } from '../../accounts/accounts.service';
import { BudgetsService } from '../../budgets/budgets.service';
import { GoalsService } from '../../goals/goals.service';

export interface FinancialHealthMetrics {
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  savingsRate: number; // Percentage
  debtToIncomeRatio: number; // Percentage
  emergencyFundRatio: number; // Months of expenses covered
  budgetUtilization: number; // Percentage of budgets used
  goalProgress: number; // Average progress across all goals
  financialHealthScore: number; // Overall score 0-100
}

export interface ExpenseAnalysis {
  totalExpenses: number;
  averageDaily: number;
  averageWeekly: number;
  averageMonthly: number;
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
}

export interface IncomeAnalysis {
  totalIncome: number;
  averageMonthly: number;
  sources: Array<{
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
}

export interface BudgetAnalysis {
  totalBudgeted: number;
  totalSpent: number;
  utilizationRate: number;
  overBudgetCategories: Array<{
    categoryId: string;
    categoryName: string;
    budgeted: number;
    spent: number;
    overAmount: number;
  }>;
  underBudgetCategories: Array<{
    categoryId: string;
    categoryName: string;
    budgeted: number;
    spent: number;
    remainingAmount: number;
  }>;
}

@Injectable()
export class FinancialAnalyticsService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly accountsService: AccountsService,
    private readonly budgetsService: BudgetsService,
    private readonly goalsService: GoalsService,
  ) {}

  async getFinancialHealthMetrics(
    userId: string,
  ): Promise<FinancialHealthMetrics> {
    // Get current date and calculate date ranges
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get basic data
    const netWorth = await this.accountsService.getTotalNetWorth(userId);
    const accountSummary = await this.accountsService.getAccountSummary(userId);
    const budgetSummary = await this.budgetsService.getBudgetSummary(userId);
    const goalsSummary = await this.goalsService.getGoalsSummary(userId);

    // Get transaction summary for current month
    const currentMonthTransactions =
      await this.transactionsService.getTransactionSummary(
        userId,
        currentMonth.toISOString().split('T')[0],
        currentMonthEnd.toISOString().split('T')[0],
      );

    // Calculate metrics
    const monthlyIncome = currentMonthTransactions.totalIncome;
    const monthlyExpenses = currentMonthTransactions.totalExpenses;
    const monthlySavings = monthlyIncome - monthlyExpenses;
    const savingsRate =
      monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

    // Calculate debt-to-income ratio (assuming credit cards and loans are debt)
    const debtAccounts =
      accountSummary.byType.credit_card.balance +
      accountSummary.byType.loan.balance;
    const debtToIncomeRatio =
      monthlyIncome > 0 ? (Math.abs(debtAccounts) / monthlyIncome) * 100 : 0;

    // Calculate emergency fund ratio (assuming savings accounts are emergency funds)
    const emergencyFund = accountSummary.byType.savings.balance;
    const emergencyFundRatio =
      monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;

    // Budget utilization
    const budgetUtilization =
      budgetSummary.totalBudgetAmount > 0
        ? (budgetSummary.totalSpent / budgetSummary.totalBudgetAmount) * 100
        : 0;

    // Goal progress
    const goalProgress = goalsSummary.averageProgress;

    // Calculate overall financial health score (0-100)
    const financialHealthScore = this.calculateFinancialHealthScore({
      savingsRate,
      debtToIncomeRatio,
      emergencyFundRatio,
      budgetUtilization,
      goalProgress,
    });

    return {
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      monthlySavings,
      savingsRate,
      debtToIncomeRatio,
      emergencyFundRatio,
      budgetUtilization,
      goalProgress,
      financialHealthScore,
    };
  }

  async getExpenseAnalysis(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ExpenseAnalysis> {
    // Default to last 12 months if no dates provided
    if (!startDate || !endDate) {
      const now = new Date();
      endDate = now.toISOString().split('T')[0];
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        .toISOString()
        .split('T')[0];
    }

    const transactionSummary =
      await this.transactionsService.getTransactionSummary(
        userId,
        startDate,
        endDate,
      );

    // Calculate averages
    const daysDiff = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const weeksDiff = daysDiff / 7;
    const monthsDiff = daysDiff / 30.44; // Average days per month

    const totalExpenses = transactionSummary.totalExpenses;
    const averageDaily = totalExpenses / daysDiff;
    const averageWeekly = totalExpenses / weeksDiff;
    const averageMonthly = totalExpenses / monthsDiff;

    // Get top expense categories
    const topCategories = Object.entries(transactionSummary.byCategory)
      .map(([categoryId, data]: [string, any]) => ({
        categoryId,
        categoryName: data.name,
        amount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Generate monthly trend (simplified - would need more complex query in real implementation)
    const monthlyTrend = await this.generateMonthlyTrend(
      userId,
      startDate,
      endDate,
      'expense',
    );

    return {
      totalExpenses,
      averageDaily,
      averageWeekly,
      averageMonthly,
      topCategories,
      monthlyTrend,
    };
  }

  async getIncomeAnalysis(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<IncomeAnalysis> {
    // Default to last 12 months if no dates provided
    if (!startDate || !endDate) {
      const now = new Date();
      endDate = now.toISOString().split('T')[0];
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        .toISOString()
        .split('T')[0];
    }

    const transactionSummary =
      await this.transactionsService.getTransactionSummary(
        userId,
        startDate,
        endDate,
      );

    // Calculate averages
    const daysDiff = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const monthsDiff = daysDiff / 30.44; // Average days per month

    const totalIncome = transactionSummary.totalIncome;
    const averageMonthly = totalIncome / monthsDiff;

    // Get income sources
    const sources = Object.entries(transactionSummary.byCategory)
      .map(([categoryId, data]: [string, any]) => ({
        categoryId,
        categoryName: data.name,
        amount: data.amount,
        percentage: totalIncome > 0 ? (data.amount / totalIncome) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Generate monthly trend
    const monthlyTrend = await this.generateMonthlyTrend(
      userId,
      startDate,
      endDate,
      'income',
    );

    return {
      totalIncome,
      averageMonthly,
      sources,
      monthlyTrend,
    };
  }

  async getBudgetAnalysis(userId: string): Promise<BudgetAnalysis> {
    const budgets = await this.budgetsService.findAll(userId);

    let totalBudgeted = 0;
    let totalSpent = 0;
    const overBudgetCategories: Array<{
      categoryId: string;
      categoryName: string;
      budgeted: number;
      spent: number;
      overAmount: number;
    }> = [];
    const underBudgetCategories: Array<{
      categoryId: string;
      categoryName: string;
      budgeted: number;
      spent: number;
      remainingAmount: number;
    }> = [];

    budgets.forEach((budget) => {
      const budgeted = parseFloat(budget.amount.toString());
      const spent = parseFloat(budget.spent.toString());

      totalBudgeted += budgeted;
      totalSpent += spent;

      if (spent > budgeted) {
        overBudgetCategories.push({
          categoryId: budget.categoryId,
          categoryName: budget.category?.name || 'Unknown',
          budgeted,
          spent,
          overAmount: spent - budgeted,
        });
      } else {
        underBudgetCategories.push({
          categoryId: budget.categoryId,
          categoryName: budget.category?.name || 'Unknown',
          budgeted,
          spent,
          remainingAmount: budgeted - spent,
        });
      }
    });

    const utilizationRate =
      totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    return {
      totalBudgeted,
      totalSpent,
      utilizationRate,
      overBudgetCategories: overBudgetCategories.sort(
        (a, b) => b.overAmount - a.overAmount,
      ),
      underBudgetCategories: underBudgetCategories.sort(
        (a, b) => b.remainingAmount - a.remainingAmount,
      ),
    };
  }

  private calculateFinancialHealthScore(metrics: {
    savingsRate: number;
    debtToIncomeRatio: number;
    emergencyFundRatio: number;
    budgetUtilization: number;
    goalProgress: number;
  }): number {
    let score = 0;

    // Savings rate (0-25 points)
    if (metrics.savingsRate >= 20) score += 25;
    else if (metrics.savingsRate >= 15) score += 20;
    else if (metrics.savingsRate >= 10) score += 15;
    else if (metrics.savingsRate >= 5) score += 10;
    else if (metrics.savingsRate > 0) score += 5;

    // Debt-to-income ratio (0-25 points)
    if (metrics.debtToIncomeRatio <= 10) score += 25;
    else if (metrics.debtToIncomeRatio <= 20) score += 20;
    else if (metrics.debtToIncomeRatio <= 30) score += 15;
    else if (metrics.debtToIncomeRatio <= 40) score += 10;
    else if (metrics.debtToIncomeRatio <= 50) score += 5;

    // Emergency fund ratio (0-25 points)
    if (metrics.emergencyFundRatio >= 6) score += 25;
    else if (metrics.emergencyFundRatio >= 3) score += 20;
    else if (metrics.emergencyFundRatio >= 1) score += 15;
    else if (metrics.emergencyFundRatio >= 0.5) score += 10;
    else if (metrics.emergencyFundRatio > 0) score += 5;

    // Budget utilization (0-15 points) - closer to 80-90% is ideal
    const budgetDiff = Math.abs(metrics.budgetUtilization - 85);
    if (budgetDiff <= 5) score += 15;
    else if (budgetDiff <= 10) score += 12;
    else if (budgetDiff <= 20) score += 8;
    else if (budgetDiff <= 30) score += 5;

    // Goal progress (0-10 points)
    if (metrics.goalProgress >= 80) score += 10;
    else if (metrics.goalProgress >= 60) score += 8;
    else if (metrics.goalProgress >= 40) score += 6;
    else if (metrics.goalProgress >= 20) score += 4;
    else if (metrics.goalProgress > 0) score += 2;

    return Math.min(100, Math.max(0, score));
  }

  private async generateMonthlyTrend(
    userId: string,
    startDate: string,
    endDate: string,
    type: 'income' | 'expense',
  ) {
    // This is a simplified implementation
    // In a real application, you would query the database for monthly aggregations
    const months: Array<{
      month: string;
      amount: number;
    }> = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];

      const summary = await this.transactionsService.getTransactionSummary(
        userId,
        monthStart,
        monthEnd,
      );

      months.push({
        month: d.toISOString().slice(0, 7), // YYYY-MM format
        amount: type === 'income' ? summary.totalIncome : summary.totalExpenses,
      });
    }

    return months;
  }
}
