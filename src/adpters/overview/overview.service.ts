import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type TransactionItem = {
  id: string;
  type: 'expense' | 'income';
  description: string;
  tag: string;
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
      // Correção 1: Coloque o ': TransactionItem' após os parâmetros (i)
      ...incomes.map((i): TransactionItem => ({
        id: i.id,
        type: 'income',
        description: i.description,
        tag: i.tag,
        amount: i.amount.toNumber(),
        date: i.date.toISOString(),
      })),
      
      // Correção 2: Tire a tipagem do 'e' e coloque o ': TransactionItem' após os parâmetros
      ...expenses.map((e): TransactionItem => ({
        id: e.id,
        type: 'expense',
        description: e.description,
        tag: e.tag,
        
        // Correção 3: Converta de Decimal/Date do Prisma para number/string do TransactionItem
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
