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
import { GoalType } from '../entities/goal.entity';
import { Transform } from 'class-transformer';

export class CreateGoalDto {
  @ApiProperty({ example: 'Emergency Fund' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Save for 6 months of expenses' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: GoalType, example: GoalType.EMERGENCY_FUND })
  @IsEnum(GoalType)
  type: GoalType;

  @ApiProperty({ example: 10000.0 })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  targetAmount: number;

  @ApiProperty({ example: '2024-12-31' })
  @IsDateString()
  targetDate: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: 500.0 })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  monthlyContribution?: number;

  @ApiPropertyOptional({ example: '#4CAF50' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: '💰' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 'uuid-of-linked-account' })
  @IsOptional()
  @IsUUID()
  linkedAccountId?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  autoContribute?: boolean;

  @ApiPropertyOptional({ example: 'Notes about this goal' })
  @IsOptional()
  @IsString()
  notes?: string;
}
