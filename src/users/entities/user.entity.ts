import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Budget } from '../../budgets/entities/budget.entity';
import { Goal } from '../../goals/entities/goal.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    description: 'Hashed password of the user',
    example: 'hashedpassword123',
    writeOnly: true, // This makes the property visible only for input, not output
  })
  @Column()
  @Exclude() // Exclude from serialization (e.g., when returning JSON)
  password: string;

  @ApiPropertyOptional({
    description: "User's declared monthly income",
    example: 5000.0,
    type: 'number',
    format: 'float',
    default: 0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monthlyIncome: number;

  @ApiPropertyOptional({
    description: 'Preferred currency for financial tracking',
    example: 'USD',
    default: 'USD',
  })
  @Column({ default: 'USD' })
  currency: string;

  @ApiPropertyOptional({
    description: 'Date of birth of the user',
    example: '1990-01-15',
    type: 'string',
    format: 'date',
  })
  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '+2348012345678',
  })
  @Column({ nullable: true })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Indicates if the user account is active',
    example: true,
    default: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Timestamp when the user account was created',
    example: '2024-06-12T10:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the user account was last updated',
    example: '2024-06-12T11:30:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations

  @ApiPropertyOptional({
    description: 'List of transactions associated with the user',
    type: () => [Transaction],
  })
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @ApiPropertyOptional({
    description: 'List of financial accounts belonging to the user',
    type: () => [Account],
  })
  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @ApiPropertyOptional({
    description: 'List of budgets created by the user',
    type: () => [Budget],
  })
  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @ApiPropertyOptional({
    description: 'List of financial goals set by the user',
    type: () => [Goal],
  })
  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];
}
