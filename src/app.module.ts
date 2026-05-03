import { Module } from '@nestjs/common';
import { ExpensesModule } from './expenses/expenses.module';
import { FirebaseModule } from './firebase/firebase.module';
import { IncomesModule } from './incomes/incomes.module';
import { OverviewModule } from './overview/overview.module';
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
