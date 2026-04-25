import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
