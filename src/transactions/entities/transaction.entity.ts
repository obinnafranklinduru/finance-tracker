import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Account } from '../../accounts/entities/account.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

@Entity('transactions')
@Index(['userId', 'date']) // Index for efficient queries by user and date
export class Transaction {
  @ApiProperty({
    description: 'Unique identifier for the transaction',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The amount of the transaction',
    example: 123.45,
    type: 'number',
    format: 'float',
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'The type of the transaction (income, expense, transfer)',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  type: string;

  @ApiProperty({
    description: 'The date of the transaction',
    example: '2024-06-12',
    type: 'string',
    format: 'date',
  })
  @Column({ type: 'date' })
  date: Date;

  @ApiPropertyOptional({
    description: 'A brief description of the transaction',
    example: 'Groceries from local supermarket',
  })
  @Column({ nullable: true })
  description: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the transaction',
    example: 'Organic produce and household items.',
  })
  @Column({ nullable: true })
  notes: string;

  @ApiPropertyOptional({
    description: 'Reference number, check number, or other relevant reference',
    example: 'INV-2024-001',
  })
  @Column({ nullable: true })
  reference: string; // Reference number, check number, etc.

  @ApiPropertyOptional({
    description: 'The location where the transaction occurred',
    example: 'New York, NY',
  })
  @Column({ nullable: true })
  location: string; // Where the transaction occurred

  @ApiPropertyOptional({
    description: 'Indicates if the transaction is recurring',
    example: false,
    default: false,
  })
  @Column({ default: false })
  isRecurring: boolean;

  @ApiPropertyOptional({
    description:
      'JSON string defining the recurring pattern (e.g., cron job pattern)',
    example: '{ "frequency": "monthly", "day": 1 }',
  })
  @Column({ nullable: true })
  recurringPattern: string; // JSON string for recurring pattern

  @ApiPropertyOptional({
    description: 'Indicates if the transaction has cleared the bank',
    example: true,
    default: false,
  })
  @Column({ default: false })
  isCleared: boolean; // Whether transaction has cleared the bank

  @ApiPropertyOptional({
    description: 'URL to the receipt image or document',
    example: 'https://example.com/receipts/transaction-123.jpg',
  })
  @Column({ nullable: true })
  receiptUrl: string; // URL to receipt image/document

  @ApiPropertyOptional({
    description: 'The user associated with the transaction',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ApiPropertyOptional({
    description: 'The ID of the user associated with the transaction',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @Column({ nullable: true, type: 'uuid' })
  userId: string;

  @ApiPropertyOptional({
    description: 'The category associated with the transaction',
    type: () => Category,
  })
  @ManyToOne(() => Category, (category) => category.transactions)
  category: Category;

  @ApiPropertyOptional({
    description: 'The ID of the category associated with the transaction',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @Column({ nullable: true, type: 'uuid' })
  categoryId: string;

  @ApiPropertyOptional({
    description: 'The account from which the transaction originated',
    type: () => Account,
  })
  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;

  @ApiPropertyOptional({
    description: 'The ID of the account from which the transaction originated',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @Column({ nullable: true, type: 'uuid' })
  accountId: string;

  @ApiPropertyOptional({
    description:
      'The account to which the transfer was made (for transfer transactions)',
    type: () => Account,
  })
  @ManyToOne(() => Account, { nullable: true })
  toAccount: Account;

  @ApiPropertyOptional({
    description:
      'The ID of the account to which the transfer was made (for transfer transactions)',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @Column({ nullable: true })
  toAccountId: string;

  @ApiPropertyOptional({
    description: 'ID of the parent transaction if this is a split transaction',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @Column({ nullable: true })
  parentTransactionId: string;

  @ApiPropertyOptional({
    description: 'Indicates if this is part of a split transaction',
    example: false,
    default: false,
  })
  @Column({ default: false })
  isSplit: boolean;

  @ApiProperty({
    description: 'The date and time when the transaction was created',
    example: '2024-06-12T10:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the transaction was last updated',
    example: '2024-06-12T11:30:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
