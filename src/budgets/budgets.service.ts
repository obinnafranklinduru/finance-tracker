import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(
    createBudgetDto: CreateBudgetDto,
    userId: string,
  ): Promise<Budget> {
    // Validate category ownership
    await this.categoriesService.findOne(createBudgetDto.categoryId, userId);

    const budget = this.budgetRepository.create({
      ...createBudgetDto,
      userId,
      startDate: new Date(createBudgetDto.startDate),
      endDate: new Date(createBudgetDto.endDate),
      remaining: createBudgetDto.amount, // Initially, remaining equals the budget amount
    });

    return await this.budgetRepository.save(budget);
  }

  async findAll(userId: string): Promise<Budget[]> {
    return await this.budgetRepository.find({
      where: { userId, isActive: true },
      relations: ['category'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return budget;
  }

  async update(
    id: string,
    updateBudgetDto: UpdateBudgetDto,
    userId: string,
  ): Promise<Budget> {
    const budget = await this.findOne(id, userId);

    // Validate new category ownership if changed
    if (
      updateBudgetDto.categoryId &&
      updateBudgetDto.categoryId !== budget.categoryId
    ) {
      await this.categoriesService.findOne(updateBudgetDto.categoryId, userId);
    }

    Object.assign(budget, updateBudgetDto);

    if (updateBudgetDto.startDate) {
      budget.startDate = new Date(updateBudgetDto.startDate);
    }

    if (updateBudgetDto.endDate) {
      budget.endDate = new Date(updateBudgetDto.endDate);
    }

    // Recalculate remaining if amount changed
    if (updateBudgetDto.amount !== undefined) {
      budget.remaining = updateBudgetDto.amount - budget.spent;
    }

    return await this.budgetRepository.save(budget);
  }

  async remove(id: string, userId: string): Promise<void> {
    const budget = await this.findOne(id, userId);
    budget.isActive = false;
    await this.budgetRepository.save(budget);
  }

  async getBudgetSummary(userId: string) {
    const budgets = await this.findAll(userId);

    const summary = {
      totalBudgets: budgets.length,
      totalBudgetAmount: 0,
      totalSpent: 0,
      totalRemaining: 0,
      overBudgetCount: 0,
    };

    budgets.forEach((budget) => {
      const amount = parseFloat(budget.amount.toString());
      const spent = parseFloat(budget.spent.toString());
      const remaining = parseFloat(budget.remaining.toString());

      summary.totalBudgetAmount += amount;
      summary.totalSpent += spent;
      summary.totalRemaining += remaining;

      if (spent > amount) {
        summary.overBudgetCount++;
      }
    });

    return summary;
  }
}
