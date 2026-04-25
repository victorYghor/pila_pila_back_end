import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OverviewService } from './overview.service';

@ApiTags('overview')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('overview')
export class OverviewController {
  constructor(private readonly overview: OverviewService) {}

  @Get()
  getMonthly(
    @CurrentUser() user: DecodedIdToken,
    @Query('year', new DefaultValuePipe(new Date().getUTCFullYear()), ParseIntPipe)
    year: number,
    @Query('month', new DefaultValuePipe(new Date().getUTCMonth() + 1), ParseIntPipe)
    month: number,
  ) {
    return this.overview.getMonthly(user.uid, year, month);
  }
}
