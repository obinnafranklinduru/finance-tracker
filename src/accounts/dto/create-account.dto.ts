import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDecimal,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountType } from '../entities/account.entity';
import { Transform } from 'class-transformer';

export class CreateAccountDto {
  @ApiProperty({ example: 'Chase Checking' })
  @IsString()
  name: string;

  @ApiProperty({ enum: AccountType, example: AccountType.CHECKING })
  @IsEnum(AccountType)
  type: AccountType;

  @ApiProperty({ example: 1500.0 })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  initialBalance: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: '2345783945' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional({ example: 'Chase Bank' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: 'Primary checking account' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '#4CAF50' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  includeInNetWorth?: boolean;
}
