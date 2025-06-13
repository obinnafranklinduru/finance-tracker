import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateAccountBalanceDto {
  @ApiProperty({
    description: 'The new balance for the account',
    example: 1234.56,
    type: Number,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @IsPositive({ message: 'Balance must be a positive number' })
  balance: number;
}
