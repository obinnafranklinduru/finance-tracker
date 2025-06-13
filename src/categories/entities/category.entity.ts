import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Budget } from '../../budgets/entities/budget.entity';

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Entity('categories')
export class Category {
  @ApiProperty({
    description: 'Unique identifier of the category',
    example: 'd1e2f3g4-h5i6-7890-1234-567890ghijkl',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Groceries',
  })
  @Column()
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description for the category',
    example: 'Daily food and household supplies',
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Type of the category (income or expense)',
    enum: CategoryType,
    example: CategoryType.EXPENSE,
  })
  @Column({
    type: 'varchar',
    length: 50,
    default: CategoryType.EXPENSE,
  })
  type: CategoryType;

  @ApiPropertyOptional({
    description: 'Hex color code for UI representation of the category',
    example: '#FF6B6B',
  })
  @Column({ nullable: true })
  color: string;

  @ApiPropertyOptional({
    description: 'Icon name or emoji representing the category',
    example: '🛒',
  })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({
    description: 'Indicates if the category is currently active',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Indicates if this is a system-default category',
    example: false,
  })
  @Column({ default: false })
  isDefault: boolean;

  // Relations
  @ApiPropertyOptional({
    description:
      'The user who owns this category (null for system default categories)',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: true })
  user: User;

  @ApiPropertyOptional({
    description:
      'UUID of the user who owns this category (null for system default categories)',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @Column({ nullable: true })
  userId: string;

  @ApiProperty({
    description: 'List of transactions associated with this category',
    type: () => [Transaction],
  })
  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @ApiProperty({
    description: 'List of budgets associated with this category',
    type: () => [Budget],
  })
  @OneToMany(() => Budget, (budget) => budget.category)
  budgets: Budget[];

  @ApiProperty({
    description: 'Timestamp when the category was created (ISO 8601 format)',
    example: '2025-06-12T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description:
      'Timestamp when the category was last updated (ISO 8601 format)',
    example: '2025-06-12T11:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
