import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type TransactionItem = {
  id: string;
  type: 'expense' | 'income';
  description: string;
  category: string;
  amount: number;
  date: string;
};

@Injectable()
export class OverviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getMonthly(userId: string, year: number, month: number) {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    const [expenses, incomes, allExpenses, allIncomes] = await Promise.all([
      this.prisma.expense.findMany({
        where: { userId, date: { gte: start, lt: end } },
        orderBy: { date: 'desc' },
      }),
      this.prisma.income.findMany({
        where: { userId, date: { gte: start, lt: end } },
        orderBy: { date: 'desc' },
      }),
      this.prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      this.prisma.income.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
    ]);

    const totalExpenses = expenses.reduce(
      (acc, e) => acc.add(e.amount),
      new Prisma.Decimal(0),
    );
    const totalIncomes = incomes.reduce(
      (acc, i) => acc.add(i.amount),
      new Prisma.Decimal(0),
    );

    const lifetimeBalance = (allIncomes._sum.amount ?? new Prisma.Decimal(0))
      .sub(allExpenses._sum.amount ?? new Prisma.Decimal(0));

    const transactions: TransactionItem[] = [
      ...incomes.map<TransactionItem>((i) => ({
        id: i.id,
        type: 'income',
        description: i.description,
        category: i.category,
        amount: i.amount.toNumber(),
        date: i.date.toISOString(),
      })),
      ...expenses.map<TransactionItem>((e) => ({
        id: e.id,
        type: 'expense',
        description: e.description,
        category: e.tag,
        amount: e.amount.toNumber(),
        date: e.date.toISOString(),
      })),
    ].sort((a, b) => b.date.localeCompare(a.date));

    return {
      year,
      month,
      balance: lifetimeBalance.toNumber(),
      totalIncomes: totalIncomes.toNumber(),
      totalExpenses: totalExpenses.toNumber(),
      transactions,
    };
  }
}
