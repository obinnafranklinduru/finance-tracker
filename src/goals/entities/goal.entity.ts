import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';

export enum GoalType {
  SAVINGS = 'savings',
  DEBT_PAYOFF = 'debt_payoff',
  INVESTMENT = 'investment',
  EMERGENCY_FUND = 'emergency_fund',
  VACATION = 'vacation',
  HOME_PURCHASE = 'home_purchase',
  CAR_PURCHASE = 'car_purchase',
  EDUCATION = 'education',
  RETIREMENT = 'retirement',
  OTHER = 'other',
}

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

@Entity('goals')
export class Goal {
  @ApiProperty({
    description: 'Unique identifier of the financial goal',
    example: 'e1f2g3h4-i5j6-7890-1234-567890abcdef',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the goal (e.g., "New Car Fund", "Emergency Savings")',
    example: 'Emergency Savings',
  })
  @Column()
  name: string;

  @ApiPropertyOptional({
    description: 'Optional detailed description of the goal',
    example: 'Building up 6 months of living expenses for emergencies.',
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Type of the financial goal',
    enum: GoalType,
    example: GoalType.EMERGENCY_FUND,
  })
  @Column({
    type: 'varchar',
    length: 50,
    default: GoalType.SAVINGS,
  })
  type: GoalType;

  @ApiProperty({
    description: 'The target amount to reach for this goal',
    example: 10000.0,
    type: Number,
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  targetAmount: number;

  @ApiProperty({
    description: 'The current amount saved or paid towards this goal',
    example: 2500.5,
    type: Number,
  })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  currentAmount: number;

  @ApiProperty({
    description: 'The target date by which to achieve the goal (YYYY-MM-DD)',
    example: '2026-12-31',
    type: String,
    format: 'date',
  })
  @Column({ type: 'date' })
  targetDate: Date;

  @ApiProperty({
    description: 'The date when the goal was started (YYYY-MM-DD)',
    example: '2025-06-01',
    type: String,
    format: 'date',
  })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({
    description: 'Current status of the goal',
    enum: GoalStatus,
    example: GoalStatus.ACTIVE,
  })
  @Column({
    type: 'varchar',
    length: 50,
    default: GoalStatus.ACTIVE,
  })
  status: GoalStatus;

  @ApiProperty({
    description:
      'Calculated progress of the goal as a percentage (currentAmount / targetAmount * 100)',
    example: 25.01,
    type: Number,
  })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progressPercentage: number;

  @ApiProperty({
    description:
      'Suggested or planned monthly contribution to reach the target amount by the target date',
    example: 200.0,
    type: Number,
  })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  monthlyContribution: number;

  @ApiPropertyOptional({
    description: 'Hex color code for UI representation of the goal',
    example: '#FFD700',
  })
  @Column({ nullable: true })
  color: string;

  @ApiPropertyOptional({
    description: 'Icon name or emoji representing the goal',
    example: '🚗',
  })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({
    description: 'Indicates if the goal is currently active for tracking',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether to automatically contribute from the linked account',
    example: false,
  })
  @Column({ default: false })
  autoContribute: boolean;

  @ApiPropertyOptional({
    description: 'Any additional notes about the goal',
    example: 'Need to review progress quarterly.',
  })
  @Column({ nullable: true })
  notes: string;

  // Relations
  @ApiProperty({
    description: 'The user who owns this financial goal',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.goals)
  user: User;

  @ApiProperty({
    description: 'UUID of the user who owns this goal',
    example: 'b1c2d3e4-f5a6-7890-1234-567890abcdef',
  })
  @Column()
  userId: string;

  @ApiPropertyOptional({
    description:
      'The account linked for automatic contributions (if autoContribute is true)',
    type: () => Account,
  })
  @ManyToOne(() => Account, { nullable: true })
  linkedAccount: Account;

  @ApiPropertyOptional({
    description: 'UUID of the linked account for auto-contributions',
    example: 'f1g2h3i4-j5k6-7890-1234-567890mnopqrst',
  })
  @Column({ nullable: true })
  linkedAccountId: string;

  @ApiProperty({
    description: 'Timestamp when the goal was created (ISO 8601 format)',
    example: '2025-06-12T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the goal was last updated (ISO 8601 format)',
    example: '2025-06-12T11:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
