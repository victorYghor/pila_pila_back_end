import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryExpensesDto {
  @ApiPropertyOptional({ example: 2026, description: 'Filter by year' })
  year?: number;

  @ApiPropertyOptional({ example: 4, description: 'Filter by month (1-12)' })
  month?: number;
}
