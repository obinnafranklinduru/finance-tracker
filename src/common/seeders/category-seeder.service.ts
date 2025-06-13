import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Category,
  CategoryType,
} from '../../categories/entities/category.entity';

@Injectable()
export class CategorySeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async seedDefaultCategories(): Promise<void> {
    // Check if default categories already exist
    const existingCategories = await this.categoryRepository.find({
      where: { isDefault: true },
    });

    if (existingCategories.length > 0) {
      console.log('Default categories already exist, skipping seeding...');
      return;
    }

    const defaultCategories = [
      // Expense categories
      {
        name: 'Food & Dining',
        type: CategoryType.EXPENSE,
        icon: '🍽️',
        color: '#FF6B6B',
        description: 'Restaurants, groceries, and food delivery',
      },
      {
        name: 'Transportation',
        type: CategoryType.EXPENSE,
        icon: '🚗',
        color: '#4ECDC4',
        description: 'Gas, public transport, car maintenance',
      },
      {
        name: 'Shopping',
        type: CategoryType.EXPENSE,
        icon: '🛍️',
        color: '#45B7D1',
        description: 'Clothing, electronics, and general shopping',
      },
      {
        name: 'Entertainment',
        type: CategoryType.EXPENSE,
        icon: '🎬',
        color: '#96CEB4',
        description: 'Movies, games, subscriptions, and fun activities',
      },
      {
        name: 'Bills & Utilities',
        type: CategoryType.EXPENSE,
        icon: '💡',
        color: '#FFEAA7',
        description: 'Electricity, water, internet, phone bills',
      },
      {
        name: 'Healthcare',
        type: CategoryType.EXPENSE,
        icon: '🏥',
        color: '#DDA0DD',
        description: 'Medical expenses, insurance, pharmacy',
      },
      {
        name: 'Education',
        type: CategoryType.EXPENSE,
        icon: '📚',
        color: '#98D8C8',
        description: 'Tuition, books, courses, and learning materials',
      },
      {
        name: 'Travel',
        type: CategoryType.EXPENSE,
        icon: '✈️',
        color: '#F7DC6F',
        description: 'Flights, hotels, vacation expenses',
      },
      {
        name: 'Home & Garden',
        type: CategoryType.EXPENSE,
        icon: '🏠',
        color: '#BB8FCE',
        description: 'Rent, mortgage, home improvement, gardening',
      },
      {
        name: 'Personal Care',
        type: CategoryType.EXPENSE,
        icon: '💄',
        color: '#F8C471',
        description: 'Haircuts, cosmetics, spa, personal hygiene',
      },
      {
        name: 'Insurance',
        type: CategoryType.EXPENSE,
        icon: '🛡️',
        color: '#85C1E9',
        description: 'Life, health, auto, home insurance',
      },
      {
        name: 'Taxes',
        type: CategoryType.EXPENSE,
        icon: '📋',
        color: '#F1948A',
        description: 'Income tax, property tax, other taxes',
      },
      {
        name: 'Gifts & Donations',
        type: CategoryType.EXPENSE,
        icon: '🎁',
        color: '#82E0AA',
        description: 'Gifts for others, charitable donations',
      },
      {
        name: 'Pet Care',
        type: CategoryType.EXPENSE,
        icon: '🐕',
        color: '#D7BDE2',
        description: 'Pet food, vet bills, pet supplies',
      },
      {
        name: 'Miscellaneous',
        type: CategoryType.EXPENSE,
        icon: '📦',
        color: '#AED6F1',
        description: 'Other expenses not categorized elsewhere',
      },

      // Income categories
      {
        name: 'Salary',
        type: CategoryType.INCOME,
        icon: '💰',
        color: '#58D68D',
        description: 'Regular employment income',
      },
      {
        name: 'Freelance',
        type: CategoryType.INCOME,
        icon: '💻',
        color: '#5DADE2',
        description: 'Freelance work and consulting income',
      },
      {
        name: 'Investment',
        type: CategoryType.INCOME,
        icon: '📈',
        color: '#F4D03F',
        description: 'Dividends, capital gains, investment returns',
      },
      {
        name: 'Business',
        type: CategoryType.INCOME,
        icon: '🏢',
        color: '#AF7AC5',
        description: 'Business profits and revenue',
      },
      {
        name: 'Rental Income',
        type: CategoryType.INCOME,
        icon: '🏘️',
        color: '#85C1E9',
        description: 'Income from rental properties',
      },
      {
        name: 'Side Hustle',
        type: CategoryType.INCOME,
        icon: '🚀',
        color: '#F8C471',
        description: 'Part-time work and side projects',
      },
      {
        name: 'Bonus',
        type: CategoryType.INCOME,
        icon: '🎯',
        color: '#82E0AA',
        description: 'Work bonuses and performance incentives',
      },
      {
        name: 'Tax Refund',
        type: CategoryType.INCOME,
        icon: '💸',
        color: '#D7BDE2',
        description: 'Tax refunds and government returns',
      },
      {
        name: 'Gift Received',
        type: CategoryType.INCOME,
        icon: '🎁',
        color: '#F1948A',
        description: 'Money received as gifts',
      },
      {
        name: 'Other Income',
        type: CategoryType.INCOME,
        icon: '💵',
        color: '#AED6F1',
        description: 'Other sources of income',
      },
    ];

    const categories = defaultCategories.map((catData) =>
      this.categoryRepository.create({
        ...catData,
        isDefault: true,
        isActive: true,
        userId: '',
      }),
    );

    await this.categoryRepository.save(categories);
    console.log(`✅ Seeded ${categories.length} default categories`);
  }

  async getDefaultCategoriesCount(): Promise<number> {
    return await this.categoryRepository.count({
      where: { isDefault: true },
    });
  }
}
