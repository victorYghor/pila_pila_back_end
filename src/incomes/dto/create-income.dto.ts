import { ApiProperty } from '@nestjs/swagger';
import { IncomeCategory } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({ example: 1800 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'Pagamento do mês' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  description: string;

  @ApiProperty({ enum: IncomeCategory, example: IncomeCategory.SALARIO })
  @IsEnum(IncomeCategory)
  category: IncomeCategory;

  @ApiProperty({ example: '2026-05-21' })
  @IsDateString()
  date: string;
}
