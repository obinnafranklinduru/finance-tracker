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
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Goal } from './entities/goal.entity';

@ApiTags('Goals')
@Controller('goals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new goal' })
  @ApiResponse({
    status: 201,
    description: 'Goal created successfully',
    type: Goal,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createGoalDto: CreateGoalDto,
    @CurrentUser() user: User,
  ): Promise<Goal> {
    return await this.goalsService.create(createGoalDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all goals for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Goals retrieved successfully',
    type: [Goal],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() user: User): Promise<Goal[]> {
    return await this.goalsService.findAll(user.id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get goals summary for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Goals summary retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getGoalsSummary(@CurrentUser() user: User) {
    return await this.goalsService.getGoalsSummary(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a goal by ID' })
  @ApiResponse({
    status: 200,
    description: 'Goal retrieved successfully',
    type: Goal,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Goal> {
    return await this.goalsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a goal' })
  @ApiResponse({
    status: 200,
    description: 'Goal updated successfully',
    type: Goal,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @CurrentUser() user: User,
  ): Promise<Goal> {
    return await this.goalsService.update(id, updateGoalDto, user.id);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Update goal progress' })
  @ApiResponse({
    status: 200,
    description: 'Goal progress updated successfully',
    type: Goal,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async updateProgress(
    @Param('id') id: string,
    @Body() body: { amount: number },
    @CurrentUser() user: User,
  ): Promise<Goal> {
    return await this.goalsService.updateProgress(id, body.amount, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a goal (soft delete)' })
  @ApiResponse({ status: 200, description: 'Goal deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.goalsService.remove(id, user.id);
    return { message: 'Goal deleted successfully' };
  }
}
