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
import { BudgetPeriod } from '../entities/budget.entity';
import { Transform } from 'class-transformer';

export class CreateBudgetDto {
  @ApiProperty({ example: 'Monthly Groceries Budget' })
  @IsString()
  name: string;

  @ApiProperty({ example: 500.0 })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @ApiProperty({ enum: BudgetPeriod, example: BudgetPeriod.MONTHLY })
  @IsEnum(BudgetPeriod)
  period: BudgetPeriod;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-01-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ example: 'Budget for grocery expenses' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  alertThreshold?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  alertEnabled?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
