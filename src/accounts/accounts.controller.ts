import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Account, AccountType } from './entities/account.entity';
import { UpdateAccountBalanceDto } from './dto/update-account-balance.dto';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: Account,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createAccountDto: CreateAccountDto,
    @CurrentUser() user: User,
  ): Promise<Account> {
    return await this.accountsService.create(createAccountDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts for the current user' })
  @ApiQuery({ name: 'includeInactive', type: Boolean, required: false })
  @ApiResponse({
    status: 200,
    description: 'Accounts retrieved successfully',
    type: [Account],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @CurrentUser() user: User,
    @Query('includeInactive') includeInactive?: boolean,
  ): Promise<Account[]> {
    return await this.accountsService.findAll(user.id, includeInactive);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get account summary for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Account summary retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAccountSummary(@CurrentUser() user: User) {
    return await this.accountsService.getAccountSummary(user.id);
  }

  @Get('net-worth')
  @ApiOperation({ summary: 'Get total net worth for the current user' })
  @ApiResponse({ status: 200, description: 'Net worth retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getNetWorth(@CurrentUser() user: User): Promise<{ netWorth: number }> {
    const netWorth = await this.accountsService.getTotalNetWorth(user.id);
    return { netWorth };
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get accounts by type' })
  @ApiResponse({
    status: 200,
    description: 'Accounts retrieved successfully',
    type: [Account],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAccountsByType(
    @Param('type') type: AccountType,
    @CurrentUser() user: User,
  ): Promise<Account[]> {
    return await this.accountsService.getAccountsByType(user.id, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by ID' })
  @ApiResponse({
    status: 200,
    description: 'Account retrieved successfully',
    type: Account,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Account> {
    return await this.accountsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiResponse({
    status: 200,
    description: 'Account updated successfully',
    type: Account,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @CurrentUser() user: User,
  ): Promise<Account> {
    return await this.accountsService.update(id, updateAccountDto, user.id);
  }

  @Patch(':id/balance')
  @ApiOperation({ summary: 'Update account balance' })
  @ApiResponse({
    status: 200,
    description: 'Account balance updated successfully',
    type: Account,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async updateBalance(
    @Param('id') id: string,
    @Body() updateAccountBalanceDto: UpdateAccountBalanceDto,
    @CurrentUser() user: User,
  ): Promise<Account> {
    return await this.accountsService.updateBalance(
      id,
      updateAccountBalanceDto.balance,
      user.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account (soft delete)' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.accountsService.remove(id, user.id);
    return { message: 'Account deleted successfully' };
  }
}
