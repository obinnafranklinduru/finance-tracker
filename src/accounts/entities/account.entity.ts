import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { EncryptionTransformer } from '../../common/transformers/encryption.transformer';

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  INVESTMENT = 'investment',
  CREDIT_CARD = 'credit_card',
  LOAN = 'loan',
  CASH = 'cash',
  OTHER = 'other',
}

// Helper function for masking
const maskAccountNumberForDisplay = (
  value: string | undefined,
): string | undefined => {
  if (!value) return undefined;
  if (value.length > 4) {
    return '*'.repeat(value.length - 4) + value.slice(-4);
  }
  return value;
};

@Entity('accounts')
export class Account {
  @ApiProperty({
    description: 'Unique identifier of the account',
    example: 'd1e2f3g4-h5i6-7890-1234-567890ghijkl',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the account', example: 'Main Checking' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Type of the account (e.g., checking, savings, credit card)',
    example: 'checking',
  })
  @Column({
    type: 'varchar',
    length: 50,
    default: 'checking',
  })
  type: string;

  @ApiProperty({
    description: 'Current balance of the account',
    example: 1500.75,
  })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @ApiProperty({
    description: 'Initial balance when the account was created',
    example: 1000.0,
  })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  initialBalance: number;

  @ApiProperty({ description: 'Currency of the account', example: 'USD' })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({
    description: 'Account number (masked for display, encrypted at db server)',
    example: '************1234',
    nullable: true,
  })
  @Transform(({ value }) => maskAccountNumberForDisplay(value))
  @Column({
    nullable: true,
    transformer: new EncryptionTransformer(),
  })
  accountNumber: string;

  @ApiProperty({
    description: 'Bank name (optional)',
    example: 'MyBank Inc.',
    nullable: true,
  })
  @Column({ nullable: true })
  bankName: string;

  @ApiProperty({
    description: 'Description of the account (optional)',
    example: 'My primary everyday spending account',
    nullable: true,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Color assigned to the account in the UI (optional)',
    example: '#007bff',
    nullable: true,
  })
  @Column({ nullable: true })
  color: string; // Hex color code for UI

  @ApiProperty({ description: 'Whether the account is active', example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description:
      'Whether the account balance should be included in net worth calculations',
    example: true,
  })
  @Column({ default: false })
  includeInNetWorth: boolean;

  @ApiProperty({
    description: 'ID of the user who owns this account',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @Column()
  userId: string;

  // Relations
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @ApiProperty({ type: () => Transaction, isArray: true })
  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @ApiProperty({ type: () => Transaction, isArray: true })
  @OneToMany(() => Transaction, (transaction) => transaction.toAccount)
  incomingTransfers: Transaction[];

  @ApiProperty({
    description: 'Timestamp when the account was created',
    example: '2025-06-12T10:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the account was last updated',
    example: '2025-06-12T11:30:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
