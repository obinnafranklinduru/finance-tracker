import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountType } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(
    createAccountDto: CreateAccountDto,
    userId: string,
  ): Promise<Account> {
    const account = this.accountRepository.create({
      ...createAccountDto,
      balance: createAccountDto.initialBalance,
      userId,
    });

    return await this.accountRepository.save(account);
  }

  async findAll(userId: string, includeInactive = false): Promise<Account[]> {
    const queryBuilder = this.accountRepository
      .createQueryBuilder('account')
      .where('account.userId = :userId', { userId });

    if (!includeInactive) {
      queryBuilder.andWhere('account.isActive = true');
    }

    return await queryBuilder
      .orderBy('account.type', 'ASC')
      .addOrderBy('account.name', 'ASC')
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, userId },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
    userId: string,
  ): Promise<Account> {
    const account = await this.findOne(id, userId);

    // If initial balance is being updated, adjust the current balance accordingly
    if (updateAccountDto.initialBalance !== undefined) {
      const balanceDifference =
        updateAccountDto.initialBalance - account.initialBalance;
      account.balance = account.balance + balanceDifference;
    }

    Object.assign(account, updateAccountDto);
    return await this.accountRepository.save(account);
  }

  async remove(id: string, userId: string): Promise<void> {
    const account = await this.findOne(id, userId);

    // Soft delete by setting isActive to false
    account.isActive = false;
    await this.accountRepository.save(account);
  }

  async getAccountsByType(
    userId: string,
    type: AccountType,
  ): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { userId, type, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getTotalNetWorth(userId: string): Promise<number> {
    const result = await this.accountRepository
      .createQueryBuilder('account')
      .select('SUM(account.balance)', 'total')
      .where('account.userId = :userId', { userId })
      .andWhere('account.isActive = true')
      .andWhere('account.includeInNetWorth = true')
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getAccountSummary(userId: string) {
    const accounts = await this.findAll(userId);

    const summary = {
      totalAccounts: accounts.length,
      totalBalance: 0,
      netWorth: 0,
      byType: {} as Record<AccountType, { count: number; balance: number }>,
    };

    // Initialize all account types
    Object.values(AccountType).forEach((type) => {
      summary.byType[type] = { count: 0, balance: 0 };
    });

    accounts.forEach((account) => {
      summary.totalBalance += parseFloat(account.balance.toString());

      if (account.includeInNetWorth) {
        summary.netWorth += parseFloat(account.balance.toString());
      }

      summary.byType[account.type].count++;
      summary.byType[account.type].balance += parseFloat(
        account.balance.toString(),
      );
    });

    return summary;
  }

  async updateBalance(
    accountId: string,
    newBalance: number,
    userId: string,
  ): Promise<Account> {
    const account = await this.findOne(accountId, userId);
    account.balance = newBalance;
    return await this.accountRepository.save(account);
  }

  async adjustBalance(
    accountId: string,
    amount: number,
    userId: string,
  ): Promise<Account> {
    const account = await this.findOne(accountId, userId);
    account.balance = parseFloat(account.balance.toString()) + amount;
    return await this.accountRepository.save(account);
  }
}
