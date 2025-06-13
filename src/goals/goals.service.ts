import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal, GoalStatus } from './entities/goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    private readonly accountsService: AccountsService,
  ) {}

  async create(createGoalDto: CreateGoalDto, userId: string): Promise<Goal> {
    // Validate linked account ownership if provided
    if (createGoalDto.linkedAccountId) {
      await this.accountsService.findOne(createGoalDto.linkedAccountId, userId);
    }

    const goal = this.goalRepository.create({
      ...createGoalDto,
      userId,
      startDate: new Date(createGoalDto.startDate),
      targetDate: new Date(createGoalDto.targetDate),
      progressPercentage: 0, // Initially 0%
    });

    return await this.goalRepository.save(goal);
  }

  async findAll(userId: string): Promise<Goal[]> {
    return await this.goalRepository.find({
      where: { userId, isActive: true },
      relations: ['linkedAccount'],
      order: { targetDate: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id, userId },
      relations: ['linkedAccount'],
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    return goal;
  }

  async update(
    id: string,
    updateGoalDto: UpdateGoalDto,
    userId: string,
  ): Promise<Goal> {
    const goal = await this.findOne(id, userId);

    // Validate new linked account ownership if changed
    if (
      updateGoalDto.linkedAccountId &&
      updateGoalDto.linkedAccountId !== goal.linkedAccountId
    ) {
      await this.accountsService.findOne(updateGoalDto.linkedAccountId, userId);
    }

    Object.assign(goal, updateGoalDto);

    if (updateGoalDto.startDate) {
      goal.startDate = new Date(updateGoalDto.startDate);
    }

    if (updateGoalDto.targetDate) {
      goal.targetDate = new Date(updateGoalDto.targetDate);
    }

    // Recalculate progress percentage if target amount changed
    if (updateGoalDto.targetAmount !== undefined) {
      goal.progressPercentage =
        (goal.currentAmount / updateGoalDto.targetAmount) * 100;
    }

    return await this.goalRepository.save(goal);
  }

  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.findOne(id, userId);
    goal.isActive = false;
    await this.goalRepository.save(goal);
  }

  async updateProgress(
    id: string,
    amount: number,
    userId: string,
  ): Promise<Goal> {
    const goal = await this.findOne(id, userId);

    goal.currentAmount = amount;
    goal.progressPercentage =
      (amount / parseFloat(goal.targetAmount.toString())) * 100;

    // Mark as completed if target reached
    if (goal.progressPercentage >= 100) {
      goal.status = GoalStatus.COMPLETED;
    }

    return await this.goalRepository.save(goal);
  }

  async getGoalsSummary(userId: string) {
    const goals = await this.findAll(userId);

    const summary = {
      totalGoals: goals.length,
      activeGoals: goals.filter((g) => g.status === GoalStatus.ACTIVE).length,
      completedGoals: goals.filter((g) => g.status === GoalStatus.COMPLETED)
        .length,
      totalTargetAmount: 0,
      totalCurrentAmount: 0,
      averageProgress: 0,
    };

    goals.forEach((goal) => {
      summary.totalTargetAmount += parseFloat(goal.targetAmount.toString());
      summary.totalCurrentAmount += parseFloat(goal.currentAmount.toString());
    });

    if (goals.length > 0) {
      summary.averageProgress =
        goals.reduce(
          (sum, goal) => sum + parseFloat(goal.progressPercentage.toString()),
          0,
        ) / goals.length;
    }

    return summary;
  }
}
