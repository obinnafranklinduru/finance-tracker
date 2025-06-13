import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { AccountsService } from '../accounts/accounts.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountsService: AccountsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    // Validate account ownership
    await this.accountsService.findOne(createTransactionDto.accountId, userId);

    // Validate category ownership
    await this.categoriesService.findOne(
      createTransactionDto.categoryId,
      userId,
    );

    // For transfers, validate destination account
    if (createTransactionDto.type === TransactionType.TRANSFER) {
      if (!createTransactionDto.toAccountId) {
        throw new BadRequestException(
          'Destination account is required for transfers',
        );
      }
      await this.accountsService.findOne(
        createTransactionDto.toAccountId,
        userId,
      );
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      userId,
      date: new Date(createTransactionDto.date),
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Update account balances
    await this.updateAccountBalances(savedTransaction);

    return await this.findOne(savedTransaction.id, userId);
  }

  async findAll(userId: string, query: TransactionQueryDto) {
    const queryBuilder = this.createQueryBuilder(userId);

    // Apply filters
    this.applyFilters(queryBuilder, query);

    // Apply sorting
    const sortField = this.getSortField(query.sortBy || 'date');
    queryBuilder.orderBy(sortField, query.sortOrder || 'DESC');

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Get results and count
    const [transactions, total] = await queryBuilder.getManyAndCount();

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
      relations: ['category', 'account', 'toAccount'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    const existingTransaction = await this.findOne(id, userId);

    // Validate new account ownership if changed
    if (
      updateTransactionDto.accountId &&
      updateTransactionDto.accountId !== existingTransaction.accountId
    ) {
      await this.accountsService.findOne(
        updateTransactionDto.accountId,
        userId,
      );
    }

    // Validate new category ownership if changed
    if (
      updateTransactionDto.categoryId &&
      updateTransactionDto.categoryId !== existingTransaction.categoryId
    ) {
      await this.categoriesService.findOne(
        updateTransactionDto.categoryId,
        userId,
      );
    }

    // Validate new destination account if changed
    if (
      updateTransactionDto.toAccountId &&
      updateTransactionDto.toAccountId !== existingTransaction.toAccountId
    ) {
      await this.accountsService.findOne(
        updateTransactionDto.toAccountId,
        userId,
      );
    }

    // Reverse the old transaction's effect on account balances
    await this.reverseAccountBalances(existingTransaction);

    // Update the transaction
    Object.assign(existingTransaction, updateTransactionDto);
    if (updateTransactionDto.date) {
      existingTransaction.date = new Date(updateTransactionDto.date);
    }

    const updatedTransaction =
      await this.transactionRepository.save(existingTransaction);

    // Apply the new transaction's effect on account balances
    await this.updateAccountBalances(updatedTransaction);

    return await this.findOne(updatedTransaction.id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const transaction = await this.findOne(id, userId);

    // Reverse the transaction's effect on account balances
    await this.reverseAccountBalances(transaction);

    await this.transactionRepository.remove(transaction);
  }

  private createQueryBuilder(userId: string): SelectQueryBuilder<Transaction> {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('transaction.toAccount', 'toAccount')
      .where('transaction.userId = :userId', { userId });
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Transaction>,
    query: TransactionQueryDto,
  ) {
    if (query.type) {
      queryBuilder.andWhere('transaction.type = :type', { type: query.type });
    }

    if (query.categoryId) {
      queryBuilder.andWhere('transaction.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    if (query.accountId) {
      queryBuilder.andWhere('transaction.accountId = :accountId', {
        accountId: query.accountId,
      });
    }

    if (query.startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', {
        startDate: query.startDate,
      });
    }

    if (query.endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', {
        endDate: query.endDate,
      });
    }

    if (query.minAmount) {
      queryBuilder.andWhere('transaction.amount >= :minAmount', {
        minAmount: query.minAmount,
      });
    }

    if (query.maxAmount) {
      queryBuilder.andWhere('transaction.amount <= :maxAmount', {
        maxAmount: query.maxAmount,
      });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(transaction.description LIKE :search OR transaction.notes LIKE :search OR transaction.location LIKE :search)',
        { search: `%${query.search}%` },
      );
    }
  }

  private getSortField(sortBy: string): string {
    const sortFields = {
      date: 'transaction.date',
      amount: 'transaction.amount',
      description: 'transaction.description',
    };

    return sortFields[sortBy] || 'transaction.date';
  }

  private async updateAccountBalances(transaction: Transaction): Promise<void> {
    const amount = parseFloat(transaction.amount.toString());

    switch (transaction.type) {
      case TransactionType.INCOME:
        await this.accountsService.adjustBalance(
          transaction.accountId,
          amount,
          transaction.userId,
        );
        break;

      case TransactionType.EXPENSE:
        await this.accountsService.adjustBalance(
          transaction.accountId,
          -amount,
          transaction.userId,
        );
        break;

      case TransactionType.TRANSFER:
        if (transaction.toAccountId) {
          // Subtract from source account
          await this.accountsService.adjustBalance(
            transaction.accountId,
            -amount,
            transaction.userId,
          );
          // Add to destination account
          await this.accountsService.adjustBalance(
            transaction.toAccountId,
            amount,
            transaction.userId,
          );
        }
        break;
    }
  }

  private async reverseAccountBalances(
    transaction: Transaction,
  ): Promise<void> {
    const amount = parseFloat(transaction.amount.toString());

    switch (transaction.type) {
      case TransactionType.INCOME:
        await this.accountsService.adjustBalance(
          transaction.accountId,
          -amount,
          transaction.userId,
        );
        break;

      case TransactionType.EXPENSE:
        await this.accountsService.adjustBalance(
          transaction.accountId,
          amount,
          transaction.userId,
        );
        break;

      case TransactionType.TRANSFER:
        if (transaction.toAccountId) {
          // Add back to source account
          await this.accountsService.adjustBalance(
            transaction.accountId,
            amount,
            transaction.userId,
          );
          // Subtract from destination account
          await this.accountsService.adjustBalance(
            transaction.toAccountId,
            -amount,
            transaction.userId,
          );
        }
        break;
    }
  }

  async getTransactionSummary(
    userId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const queryBuilder = this.createQueryBuilder(userId);

    if (startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', { endDate });
    }

    const transactions = await queryBuilder.getMany();

    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      transactionCount: transactions.length,
      byCategory: {} as Record<
        string,
        { name: string; amount: number; count: number }
      >,
    };

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount.toString());

      if (transaction.type === TransactionType.INCOME) {
        summary.totalIncome += amount;
      } else if (transaction.type === TransactionType.EXPENSE) {
        summary.totalExpenses += amount;
      }

      // Group by category
      const categoryId = transaction.categoryId;
      if (!summary.byCategory[categoryId]) {
        summary.byCategory[categoryId] = {
          name: transaction.category?.name || 'Unknown',
          amount: 0,
          count: 0,
        };
      }

      summary.byCategory[categoryId].amount += amount;
      summary.byCategory[categoryId].count++;
    });

    summary.netIncome = summary.totalIncome - summary.totalExpenses;

    return summary;
  }
}
