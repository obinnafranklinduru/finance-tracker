import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsDateString,
  IsPhoneNumber,
  IsDecimal,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'PASSword@123#', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  monthlyIncome?: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: '+2348098437832' })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
