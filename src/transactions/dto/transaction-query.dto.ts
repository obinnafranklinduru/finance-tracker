import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';
import { Transform } from 'class-transformer';

export class TransactionQueryDto {
  @ApiPropertyOptional({ enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-account' })
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @ApiPropertyOptional({ example: '2025-06-15' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-06-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 100.0 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  minAmount?: number;

  @ApiPropertyOptional({ example: 1000.0 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxAmount?: number;

  @ApiPropertyOptional({ example: 'grocery' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, minimum: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    example: 'date',
    enum: ['date', 'amount', 'description'],
  })
  @IsOptional()
  sortBy?: string = 'date';

  @ApiPropertyOptional({ example: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
