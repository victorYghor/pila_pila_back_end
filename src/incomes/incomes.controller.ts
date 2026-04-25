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
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomesService } from './incomes.service';

@ApiTags('incomes')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomes: IncomesService) {}

  @Post()
  create(
    @CurrentUser() user: DecodedIdToken,
    @Body() dto: CreateIncomeDto,
  ) {
    return this.incomes.create(user.uid, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: DecodedIdToken,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
    @Query('month', new ParseIntPipe({ optional: true })) month?: number,
  ) {
    return this.incomes.findAll(user.uid, year, month);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: DecodedIdToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.incomes.findOne(user.uid, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: DecodedIdToken,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIncomeDto,
  ) {
    return this.incomes.update(user.uid, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: DecodedIdToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.incomes.remove(user.uid, id);
  }
}
