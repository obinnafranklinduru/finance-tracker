import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';
import { Transform } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({ example: 150.0 })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: '2025-06-12' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Grocery shopping at Walmart' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Weekly grocery run' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'CHK001234' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ example: 'Walmart Supercenter' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'uuid-of-account' })
  @IsUUID()
  accountId: string;

  @ApiPropertyOptional({ example: 'uuid-of-destination-account' })
  @IsOptional()
  @IsUUID()
  toAccountId?: string; // For transfers

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({ example: '{"frequency": "monthly", "interval": 1}' })
  @IsOptional()
  @IsString()
  recurringPattern?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isCleared?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/receipt.jpg' })
  @IsOptional()
  @IsString()
  receiptUrl?: string;
}
