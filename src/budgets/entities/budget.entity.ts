import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

export enum BudgetPeriod {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

@Entity('budgets')
@Index(['userId', 'period', 'startDate']) // Index for efficient budget queries
export class Budget {
  @ApiProperty({
    description: 'Unique identifier of the budget',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the budget (e.g., "Monthly Food Budget")',
    example: 'Monthly Food Budget',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Total allocated amount for this budget period',
    example: 500.0,
    type: Number,
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Periodicity of the budget',
    enum: BudgetPeriod,
    example: BudgetPeriod.MONTHLY,
  })
  @Column({
    type: 'varchar',
    length: 50,
    default: BudgetPeriod.MONTHLY,
  })
  period: BudgetPeriod;

  @ApiProperty({
    description: 'Start date of the budget period (YYYY-MM-DD)',
    example: '2025-01-01',
    type: String,
    format: 'date',
  })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({
    description: 'End date of the budget period (YYYY-MM-DD)',
    example: '2025-01-31',
    type: String,
    format: 'date',
  })
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({
    description: 'Amount spent so far within this budget period',
    example: 150.5,
    type: Number,
  })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  spent: number; // Calculated field, updated when transactions are added

  @ApiProperty({
    description: 'Remaining amount in the budget (Amount - Spent)',
    example: 349.5,
    type: Number,
  })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  remaining: number; // Calculated field: amount - spent

  @ApiProperty({
    description: 'Indicates if the budget is currently active',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description:
      'Indicates if this budget should automatically recur for the next period',
    example: false,
  })
  @Column({ default: false })
  isRecurring: boolean;

  @ApiPropertyOptional({
    description: 'Optional description of the budget',
    example: 'Budget for groceries and dining out',
  })
  @Column({ nullable: true })
  description: string;

  @ApiPropertyOptional({
    description:
      'Percentage threshold (0-100) at which to trigger an alert (e.g., 80 for 80% spent)',
    example: 80,
    type: Number,
  })
  @Column({ nullable: true })
  alertThreshold: number;

  @ApiProperty({
    description: 'Indicates if budget alerts are enabled',
    example: true,
  })
  @Column({ default: false })
  alertEnabled: boolean;

  // Relations
  @ApiProperty({
    description: 'The user associated with this budget',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.budgets)
  user: User;

  @ApiProperty({
    description: 'UUID of the user associated with this budget',
    example: 'b1c2d3e4-f5a6-7890-1234-567890abcdef',
  })
  @Column()
  userId: string;

  @ApiProperty({
    description: 'The category associated with this budget',
    type: () => Category,
  })
  @ManyToOne(() => Category, (category) => category.budgets)
  category: Category;

  @ApiProperty({
    description: 'UUID of the category associated with this budget',
    example: 'c1d2e3f4-g5h6-7890-1234-567890ijklmn',
  })
  @Column()
  categoryId: string;

  @ApiProperty({
    description: 'Timestamp when the budget was created (ISO 8601 format)',
    example: '2025-06-12T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the budget was last updated (ISO 8601 format)',
    example: '2025-06-12T11:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
