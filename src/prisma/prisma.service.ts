import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Cria o pool de conexão nativo do pacote 'pg'
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // 2. Cria o adaptador do Prisma usando esse pool
    const adapter = new PrismaPg(pool);

    // 3. Passa o adaptador para o construtor do PrismaClient original
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}