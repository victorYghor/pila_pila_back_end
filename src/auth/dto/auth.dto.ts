import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// ─── Register ────────────────────────────────────────────────────────────────

export class RegisterDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username can only contain letters, numbers and underscores',
  })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ss1', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

// ─── Verify Token (login proof sent from the app after signInWithPassword) ───

export class VerifyTokenDto {
  @ApiProperty({ description: 'Firebase ID token obtained client-side' })
  @IsString()
  idToken: string;
}

// ─── Password Reset – request ────────────────────────────────────────────────

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
}

// ─── Password Reset – confirm (OOB code + new password) ──────────────────────

export class ConfirmPasswordResetDto {
  @ApiProperty({ description: 'Out-of-band code received by e-mail' })
  @IsString()
  oobCode: string;

  @ApiProperty({ example: 'NewStrongP@ss1', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
