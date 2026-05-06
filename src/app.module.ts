import { Module } from '@nestjs/common';
import { ExpensesModule } from './adpters/expenses/expenses.module';
import { FirebaseModule } from './adpters/firebase/firebase.module';
import { IncomesModule } from './adpters/incomes/incomes.module';
import { OverviewModule } from './adpters/overview/overview.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    FirebaseModule,
    ExpensesModule,
    IncomesModule,
    OverviewModule,
  ],
})
export class AppModule {}
