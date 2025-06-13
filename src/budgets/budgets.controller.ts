import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Budget } from './entities/budget.entity';

@ApiTags('Budgets')
@Controller('budgets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiResponse({
    status: 201,
    description: 'Budget created successfully',
    type: Budget,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createBudgetDto: CreateBudgetDto,
    @CurrentUser() user: User,
  ): Promise<Budget> {
    return await this.budgetsService.create(createBudgetDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Budgets retrieved successfully',
    type: [Budget],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() user: User): Promise<Budget[]> {
    return await this.budgetsService.findAll(user.id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get budget summary for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Budget summary retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBudgetSummary(@CurrentUser() user: User) {
    return await this.budgetsService.getBudgetSummary(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a budget by ID' })
  @ApiResponse({
    status: 200,
    description: 'Budget retrieved successfully',
    type: Budget,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Budget> {
    return await this.budgetsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a budget' })
  @ApiResponse({
    status: 200,
    description: 'Budget updated successfully',
    type: Budget,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @CurrentUser() user: User,
  ): Promise<Budget> {
    return await this.budgetsService.update(id, updateBudgetDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a budget (soft delete)' })
  @ApiResponse({ status: 200, description: 'Budget deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.budgetsService.remove(id, user.id);
    return { message: 'Budget deleted successfully' };
  }
}
