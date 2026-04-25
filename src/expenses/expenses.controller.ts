import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@ApiTags('expenses')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expenses: ExpensesService) {}

  @Post()
  create(
    @CurrentUser() user: DecodedIdToken,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expenses.create(user.uid, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: DecodedIdToken,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
    @Query('month', new ParseIntPipe({ optional: true })) month?: number,
  ) {
    return this.expenses.findAll(user.uid, year, month);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: DecodedIdToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.expenses.findOne(user.uid, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: DecodedIdToken,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expenses.update(user.uid, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: DecodedIdToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.expenses.remove(user.uid, id);
  }
}
