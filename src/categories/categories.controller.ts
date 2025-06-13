import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Category, CategoryType } from './entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: Category,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: User,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto, user.id);
  }

  @Post('initialize-defaults')
  @ApiOperation({ summary: 'Create default categories for the current user' })
  @ApiResponse({
    status: 201,
    description: 'Default categories created successfully',
    type: [Category],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 409,
    description: 'Default categories already exist for this user',
  })
  async createDefaultCategoriesForUser(
    @CurrentUser() user: User,
  ): Promise<Category[]> {
    return await this.categoriesService.createDefaultCategories(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories for the current user' })
  @ApiQuery({ name: 'type', enum: CategoryType, required: false })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [Category],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @CurrentUser() user: User,
    @Query('type') type?: CategoryType,
  ): Promise<Category[]> {
    return await this.categoriesService.findAll(user.id, type);
  }

  @Get('expense')
  @ApiOperation({ summary: 'Get all expense categories for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Expense categories retrieved successfully',
    type: [Category],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getExpenseCategories(@CurrentUser() user: User): Promise<Category[]> {
    return await this.categoriesService.getExpenseCategories(user.id);
  }

  @Get('income')
  @ApiOperation({ summary: 'Get all income categories for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Income categories retrieved successfully',
    type: [Category],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getIncomeCategories(@CurrentUser() user: User): Promise<Category[]> {
    return await this.categoriesService.getIncomeCategories(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: Category,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Category> {
    return await this.categoriesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: Category,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: User,
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category (soft delete)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.categoriesService.remove(id, user.id);
    return { message: 'Category deleted successfully' };
  }
}
