import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        userId,
        amount: new Prisma.Decimal(dto.amount),
        description: dto.description,
        tag: dto.tag,
        date: new Date(dto.date),
        essential: dto.essential ?? false,
        recurrent: dto.recurrent ?? false,
      },
    });
  }

  findAll(userId: string, year?: number, month?: number) {
    const where: Prisma.ExpenseWhereInput = { userId };

    if (year && month) {
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 1));
      where.date = { gte: start, lt: end };
    } else if (year) {
      const start = new Date(Date.UTC(year, 0, 1));
      const end = new Date(Date.UTC(year + 1, 0, 1));
      where.date = { gte: start, lt: end };
    }

    return this.prisma.expense.findMany({ where, orderBy: { date: 'desc' } });
  }

  async findOne(userId: string, id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    await this.findOne(userId, id);

    const data: Prisma.ExpenseUpdateInput = {};
    if (dto.amount !== undefined) data.amount = new Prisma.Decimal(dto.amount);
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.tag !== undefined) data.tag = dto.tag;
    if (dto.date !== undefined) data.date = new Date(dto.date);
    if (dto.essential !== undefined) data.essential = dto.essential;
    if (dto.recurrent !== undefined) data.recurrent = dto.recurrent;

    return this.prisma.expense.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.expense.delete({ where: { id } });
    return { id };
  }
}
