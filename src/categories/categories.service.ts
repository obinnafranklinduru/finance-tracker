import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, CategoryType } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      userId,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(userId: string, type?: CategoryType): Promise<Category[]> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .where('(category.userId = :userId OR category.isDefault = true)', {
        userId,
      })
      .andWhere('category.isActive = true');

    if (type) {
      queryBuilder.andWhere('category.type = :type', { type });
    }

    return await queryBuilder
      .orderBy('category.isDefault', 'ASC')
      .addOrderBy('category.name', 'ASC')
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if user owns the category or it's a default category
    if (category.userId && category.userId !== userId) {
      throw new ForbiddenException('Access denied to this category');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const category = await this.findOne(id, userId);

    // Don't allow updating default categories
    if (category.isDefault) {
      throw new ForbiddenException('Cannot update default categories');
    }

    // Ensure user owns the category
    if (category.userId !== userId) {
      throw new ForbiddenException('Access denied to this category');
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.findOne(id, userId);

    // Don't allow deleting default categories
    if (category.isDefault) {
      throw new ForbiddenException('Cannot delete default categories');
    }

    // Ensure user owns the category
    if (category.userId !== userId) {
      throw new ForbiddenException('Access denied to this category');
    }

    // Soft delete by setting isActive to false
    category.isActive = false;
    await this.categoryRepository.save(category);
  }

  async getExpenseCategories(userId: string): Promise<Category[]> {
    return this.findAll(userId, CategoryType.EXPENSE);
  }

  async getIncomeCategories(userId: string): Promise<Category[]> {
    return this.findAll(userId, CategoryType.INCOME);
  }

  // Method to create default categories for new users
  async createDefaultCategories(userId: string): Promise<Category[]> {
    // Check if default categories already exist for this user
    const defaultsExist = await this.hasDefaultCategories(userId);
    if (defaultsExist) {
      throw new ConflictException(
        'Default categories already exist for this user.',
      );
    }

    const defaultCategories = [
      // Expense categories
      {
        name: 'Food & Dining',
        type: CategoryType.EXPENSE,
        icon: '🍽️',
        color: '#FF6B6B',
      },
      {
        name: 'Transportation',
        type: CategoryType.EXPENSE,
        icon: '🚗',
        color: '#4ECDC4',
      },
      {
        name: 'Shopping',
        type: CategoryType.EXPENSE,
        icon: '🛍️',
        color: '#45B7D1',
      },
      {
        name: 'Entertainment',
        type: CategoryType.EXPENSE,
        icon: '🎬',
        color: '#96CEB4',
      },
      {
        name: 'Bills & Utilities',
        type: CategoryType.EXPENSE,
        icon: '💡',
        color: '#FFEAA7',
      },
      {
        name: 'Healthcare',
        type: CategoryType.EXPENSE,
        icon: '🏥',
        color: '#DDA0DD',
      },
      {
        name: 'Education',
        type: CategoryType.EXPENSE,
        icon: '📚',
        color: '#98D8C8',
      },
      {
        name: 'Travel',
        type: CategoryType.EXPENSE,
        icon: '✈️',
        color: '#F7DC6F',
      },
      {
        name: 'Home & Garden',
        type: CategoryType.EXPENSE,
        icon: '🏠',
        color: '#BB8FCE',
      },
      {
        name: 'Personal Care',
        type: CategoryType.EXPENSE,
        icon: '💄',
        color: '#F8C471',
      },

      // Income categories
      {
        name: 'Salary',
        type: CategoryType.INCOME,
        icon: '💰',
        color: '#58D68D',
      },
      {
        name: 'Freelance',
        type: CategoryType.INCOME,
        icon: '💻',
        color: '#5DADE2',
      },
      {
        name: 'Investment',
        type: CategoryType.INCOME,
        icon: '📈',
        color: '#F4D03F',
      },
      {
        name: 'Business',
        type: CategoryType.INCOME,
        icon: '🏢',
        color: '#AF7AC5',
      },
      {
        name: 'Other Income',
        type: CategoryType.INCOME,
        icon: '💵',
        color: '#85C1E9',
      },
    ];

    const categories = defaultCategories.map((cat) =>
      this.categoryRepository.create({
        ...cat,
        userId: userId,
        isDefault: true,
        isActive: true,
      }),
    );

    return await this.categoryRepository.save(categories);
  }

  async hasDefaultCategories(userId: string): Promise<boolean> {
    const count = await this.categoryRepository.count({
      where: {
        userId: userId,
        isDefault: true,
      },
    });
    return count > 0;
  }
}
