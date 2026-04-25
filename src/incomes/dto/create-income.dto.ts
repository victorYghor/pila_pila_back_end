import { ApiProperty } from '@nestjs/swagger';
import { IncomeTag } from '@prisma/client';
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
  amount!: number;

  @ApiProperty({ example: 'Pagamento do mês' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  description!: string;

  @ApiProperty({ enum: IncomeTag, example: IncomeTag.SALARIO })
  @IsEnum(IncomeTag)
  tag!: IncomeTag;

  @ApiProperty({ example: '2026-05-21' })
  @IsDateString()
  date!: string;
}
