import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  @ValidateNested()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
