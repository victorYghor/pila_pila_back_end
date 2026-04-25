import { ApiProperty } from '@nestjs/swagger';
import { ExpenseTag } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ example: 10 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'Conta de luz' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  description: string;

  @ApiProperty({ enum: ExpenseTag, example: ExpenseTag.SERVICOS })
  @IsEnum(ExpenseTag)
  tag: ExpenseTag;

  @ApiProperty({ example: '2026-05-21' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  essential?: boolean;

  @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  recurrent?: boolean;
}
